import type { PrismaPromise } from "@prisma/client";
import type { GptResponse, Task, User } from "wasp/entities";
import { HttpError, prisma } from "wasp/server";
import type {
  CreateTask,
  DeleteTask,
  GenerateGptResponse,
  GetAllTasksByUser,
  GetGptResponses,
  UpdateTask,
} from "wasp/server/operations";
import * as z from "zod";
import { SubscriptionStatus } from "../payment/plans";
import { getModelCreditCost, hasEnoughCredits } from "../payment/creditPricing";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";
import { chatCompletion, imageGeneration } from "./aiProvider";
import { GeneratedSchedule, TaskPriority } from "./schedule";

//#region Actions
const generateGptResponseInputSchema = z.object({
  hours: z.number(),
});

type GenerateGptResponseInput = z.infer<typeof generateGptResponseInputSchema>;

export const generateGptResponse: GenerateGptResponse<
  GenerateGptResponseInput,
  GeneratedSchedule
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  const { hours } = ensureArgsSchemaOrThrowHttpError(
    generateGptResponseInputSchema,
    rawArgs,
  );
  const tasks = await context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });

  console.log("Calling AI API to generate schedule");
  const generatedSchedule = await generateScheduleWithGpt(tasks, hours);
  if (generatedSchedule === null) {
    throw new HttpError(
      500,
      "Encountered a problem in communication with AI provider",
    );
  }

  const createResponse = context.entities.GptResponse.create({
    data: {
      user: { connect: { id: context.user.id } },
      content: JSON.stringify(generatedSchedule),
    },
  });

  const transactions: PrismaPromise<GptResponse | User>[] = [createResponse];

  // We decrement the credits for users without an active subscription
  // after using up tokens to get a daily plan from Chat GPT.
  //
  // This way, users don't feel cheated if something goes wrong.
  // On the flipside, users can theoretically abuse this and spend more
  // credits than they have, but the damage should be pretty limited.
  //
  // Think about which option you prefer for your app and edit the code accordingly.
  if (!isUserSubscribed(context.user)) {
    const currentCredits = Number(context.user.credits);
    if (currentCredits > 0) {
      const decrementCredit = context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });
      transactions.push(decrementCredit);
    } else {
      throw new HttpError(
        402,
        "User has no subscription and is out of credits",
      );
    }
  }

  console.log("Decrementing credits and saving response");
  await prisma.$transaction(transactions);

  return generatedSchedule;
};

function isUserSubscribed(user: User) {
  return (
    user.subscriptionStatus === SubscriptionStatus.Active ||
    user.subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd
  );
}

const createTaskInputSchema = z.object({
  description: z.string().nonempty(),
});

type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask: CreateTask<CreateTaskInput, Task> = async (
  rawArgs,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { description } = ensureArgsSchemaOrThrowHttpError(
    createTaskInputSchema,
    rawArgs,
  );

  const task = await context.entities.Task.create({
    data: {
      description,
      user: { connect: { id: context.user.id } },
    },
  });

  return task;
};

const updateTaskInputSchema = z.object({
  id: z.string().nonempty(),
  isDone: z.boolean().optional(),
  time: z.string().optional(),
});

type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTask: UpdateTask<UpdateTaskInput, Task> = async (
  rawArgs,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { id, isDone, time } = ensureArgsSchemaOrThrowHttpError(
    updateTaskInputSchema,
    rawArgs,
  );

  const task = await context.entities.Task.update({
    where: {
      id,
      user: {
        id: context.user.id,
      },
    },
    data: {
      isDone,
      time,
    },
  });

  return task;
};

const deleteTaskInputSchema = z.object({
  id: z.string().nonempty(),
});

type DeleteTaskInput = z.infer<typeof deleteTaskInputSchema>;

export const deleteTask: DeleteTask<DeleteTaskInput, Task> = async (
  rawArgs,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { id } = ensureArgsSchemaOrThrowHttpError(
    deleteTaskInputSchema,
    rawArgs,
  );

  const task = await context.entities.Task.delete({
    where: {
      id,
      user: {
        id: context.user.id,
      },
    },
  });

  return task;
};
//#endregion

//#region Queries
export const getGptResponses: GetGptResponses<void, GptResponse[]> = async (
  _args,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.GptResponse.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });
};

export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (
  _args,
  context,
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
//#endregion

async function generateScheduleWithGpt(
  tasks: Task[],
  hours: number,
): Promise<GeneratedSchedule | null> {
  const parsedTasks = tasks.map(({ description, time }) => ({
    description,
    time,
  }));

  try {
    const systemPrompt = `你是一位专业的日程规划助手。你的任务是将用户提供的任务列表分解为详细的子任务，并合理安排时间。

输出格式要求（JSON）:
{
  "tasks": [
    {
      "name": "任务名称",
      "priority": "high" | "medium" | "low"
    }
  ],
  "taskItems": [
    {
      "description": "子任务详细描述",
      "time": 0.5,
      "taskName": "对应的主任务名称"
    }
  ]
}

要求:
1. 每个主任务至少分解为 3 个子任务
2. 子任务时间以小时为单位(如 0.5 = 30分钟)
3. 根据任务重要性设置优先级
4. 确保所有子任务时间总和不超过用户的工作时长`;

    const userPrompt = `我今天有 ${hours} 小时的工作时间。需要完成以下任务:
${JSON.stringify(parsedTasks, null, 2)}

请帮我制定详细的日程安排，将每个任务分解为可执行的子任务，并分配时间和优先级。
请直接返回 JSON 格式的结果，不要包含其他解释文字。`;

    const response = await chatCompletion(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      "google/gemini-2.0-flash-exp", // 使用 Gemini 2.0 Flash (免费且快速)
      0.7,
      4096
    );

    console.log("AI Response:", response.text.substring(0, 200));
    console.log("Token usage:", {
      prompt: response.promptTokens,
      completion: response.completionTokens,
      provider: response.provider,
    });

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = response.text.trim();
    if (jsonText.startsWith("```")) {
      // Remove markdown code block markers
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?$/g, "");
    }

    const schedule = JSON.parse(jsonText);

    // Validate the structure
    if (!schedule.tasks || !schedule.taskItems) {
      console.error("Invalid schedule structure:", schedule);
      return null;
    }

    return schedule as GeneratedSchedule;
  } catch (error) {
    console.error("Error generating schedule:", error);
    return null;
  }
}

//#region Image Generation Action
const generateImageInputSchema = z.object({
  model: z.string(),
  prompt: z.string().nonempty(),
  images: z.array(z.string()).optional(),
  aspectRatio: z.string().optional(),
  outputSize: z.string().optional(),
});

type GenerateImageInput = z.infer<typeof generateImageInputSchema>;

export const generateImage = async (
  rawArgs: GenerateImageInput,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation"
    );
  }

  const args = ensureArgsSchemaOrThrowHttpError(
    generateImageInputSchema,
    rawArgs
  );

  console.log("Calling AI API to generate image");
  
  try {
    const result = await imageGeneration({
      model: args.model,
      prompt: args.prompt,
      images: args.images,
      aspectRatio: args.aspectRatio,
      outputSize: args.outputSize,
    });

    console.log("Image generated successfully:", {
      model: result.model,
      provider: result.provider,
      promptTokens: result.promptTokens,
      completionTokens: result.completionTokens,
    });

    // Decrement credits for users without an active subscription
    // Credit cost is dynamically calculated based on provider and model
    if (!isUserSubscribed(context.user)) {
      const creditCost = getModelCreditCost(result.provider, result.model);

      console.log("Credit deduction info:", {
        provider: result.provider,
        model: result.model,
        creditCost,
        userCredits: context.user.credits,
      });

      if (creditCost > 0) {
        // Check if user has enough credits
        if (!hasEnoughCredits(Number(context.user.credits), result.provider, result.model)) {
          throw new HttpError(
            402,
            `Insufficient credits. Required: ${creditCost}, Available: ${context.user.credits}`
          );
        }

        // Deduct credits
        await context.entities.User.update({
          where: { id: context.user.id },
          data: {
            credits: {
              decrement: creditCost,
            },
          },
        });

        console.log(`Credits decremented by ${creditCost} for ${result.provider}/${result.model}`);
      } else {
        console.log(`No credit cost for ${result.provider}/${result.model} - free tier`);
      }
    }

    return {
      imageBase64: result.imageBase64,
      model: result.model,
      provider: result.provider,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new HttpError(
      500,
      error instanceof Error ? error.message : "Failed to generate image"
    );
  }
};
//#endregion
