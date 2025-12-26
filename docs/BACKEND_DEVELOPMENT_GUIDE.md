# 后端开发指南

本文档详细说明如何在 Wasp 框架下进行后端开发。由于 Wasp 已经提供了完善的基础设施，后端开发主要是编写业务逻辑和数据库操作，非常简单直接。

---

## 🎯 核心理念

**Wasp 已经处理了 90% 的后端基础工作，你只需要写业务逻辑。**

### ✅ Wasp 已经提供的能力

- 🔐 **认证系统** - Session 管理、密码哈希、OAuth
- 🗄️ **数据库** - Prisma ORM、自动迁移、类型安全
- 📧 **邮件发送** - SMTP 集成、邮件队列
- ⚙️ **后台任务** - Cron 定时任务、重试机制
- 🔒 **安全防护** - SQL 注入、CSRF、XSS 防护
- 📡 **API 路由** - 自动生成、类型安全
- 🔄 **热重载** - 代码修改自动重启

### 🎯 你需要做的（核心业务逻辑）

- 实现 Query/Action 函数
- 调用外部 API（AI、支付、存储等）
- 数据处理和计算
- 业务规则验证
- 错误处理

---

## 📋 后端开发工作流

### 完整流程

```
1. 定义数据模型 (schema.prisma)
   ↓
2. 数据库迁移 (wasp db migrate-dev)
   ↓
3. 在 main.wasp 中定义 Query/Action
   ↓
4. 实现业务逻辑 (TypeScript 函数)
   ↓
5. 前端调用 (useQuery/useAction)
   ↓
6. 测试和调试
```

---

## 1️⃣ 定义数据模型

### 文件位置
```
app/schema.prisma
```

### 示例：定义一个任务模型

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 基础字段
  title       String
  description String?
  isDone      Boolean  @default(false)

  // 关联用户
  user        User     @relation(fields: [userId], references: [id])
  userId      Int
}

// 记得在 User 模型中添加反向关联
model User {
  // ... 其他字段
  tasks       Task[]
}
```

### 常用字段类型

| Prisma 类型 | TypeScript 类型 | 说明 |
|------------|----------------|------|
| `String` | `string` | 文本 |
| `Int` | `number` | 整数 |
| `Float` | `number` | 浮点数 |
| `Boolean` | `boolean` | 布尔值 |
| `DateTime` | `Date` | 日期时间 |
| `Json` | `any` | JSON 对象 |
| `Decimal` | `Decimal` | 精确小数（积分系统用） |

### 数据库迁移

```bash
# 开发环境 - 创建迁移并应用
wasp db migrate-dev

# 会提示输入迁移名称，例如：add_task_model

# 生产环境 - 仅应用迁移
wasp db migrate-deploy
```

---

## 2️⃣ 在 main.wasp 中定义 Query/Action

### Query vs Action

| 类型 | 用途 | 特点 | 示例 |
|-----|------|------|------|
| **Query** | 读取数据 | - 不修改数据<br>- 可以缓存<br>- 前端自动重新获取 | `getAllTasks`<br>`getTaskById`<br>`getUserProfile` |
| **Action** | 修改数据 | - 创建/更新/删除<br>- 不缓存<br>- 自动触发 Query 刷新 | `createTask`<br>`updateTask`<br>`deleteTask` |

### 定义 Query

```wasp
// main.wasp

// 获取所有任务
query getAllTasksByUser {
  fn: import { getAllTasksByUser } from "@src/demo-ai-app/operations",
  entities: [Task]  // 声明访问的数据模型
}

// 获取单个任务
query getTaskById {
  fn: import { getTaskById } from "@src/demo-ai-app/operations",
  entities: [Task]
}
```

### 定义 Action

```wasp
// main.wasp

// 创建任务
action createTask {
  fn: import { createTask } from "@src/demo-ai-app/operations",
  entities: [Task]
}

// 更新任务
action updateTask {
  fn: import { updateTask } from "@src/demo-ai-app/operations",
  entities: [Task]
}

// 删除任务
action deleteTask {
  fn: import { deleteTask } from "@src/demo-ai-app/operations",
  entities: [Task]
}
```

### entities 参数说明

```wasp
// 单个 entity
entities: [Task]

// 多个 entities
entities: [Task, User, GptResponse]

// 为什么要声明 entities？
// 1. Wasp 自动生成类型
// 2. 自动缓存失效（Action 执行后刷新相关 Query）
// 3. 权限检查
```

---

## 3️⃣ 实现业务逻辑

### 文件组织

```
app/src/
├── demo-ai-app/
│   ├── operations.ts        # Query/Action 实现
│   ├── helpers.ts           # 辅助函数
│   └── types.ts             # 类型定义
├── payment/
│   ├── operations.ts
│   └── webhook.ts
└── analytics/
    ├── operations.ts
    └── stats.ts
```

### Query 实现模板

```typescript
// src/demo-ai-app/operations.ts
import { Task } from "wasp/entities";
import type { GetAllTasksByUser } from "wasp/server/operations";
import { HttpError } from "wasp/server";

// ✅ Query 函数签名
// - args: 前端传入的参数
// - context: Wasp 提供的上下文（user, entities）
export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (
  args,
  context
) => {
  // 1️⃣ 认证检查（Wasp 自动处理）
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  // 2️⃣ 数据库查询
  const tasks = await context.entities.Task.findMany({
    where: {
      userId: context.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 3️⃣ 返回数据
  return tasks;
};
```

### Action 实现模板

```typescript
// src/demo-ai-app/operations.ts
import type { CreateTask } from "wasp/server/operations";
import { HttpError } from "wasp/server";

// 定义参数类型
type CreateTaskArgs = {
  title: string;
  description?: string;
};

// ✅ Action 函数签名
export const createTask: CreateTask<CreateTaskArgs, Task> = async (
  args,
  context
) => {
  // 1️⃣ 认证检查
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  // 2️⃣ 参数验证
  if (!args.title || args.title.trim().length === 0) {
    throw new HttpError(400, "标题不能为空");
  }

  if (args.title.length > 200) {
    throw new HttpError(400, "标题过长（最多200字符）");
  }

  // 3️⃣ 业务逻辑
  const task = await context.entities.Task.create({
    data: {
      title: args.title.trim(),
      description: args.description?.trim(),
      userId: context.user.id,
    },
  });

  // 4️⃣ 返回结果
  return task;
};
```

---

## 4️⃣ 使用 context 对象

### context 提供的能力

```typescript
{
  user: User | null,              // 当前登录用户（如果已登录）
  entities: {                     // Prisma 数据库客户端
    Task: PrismaTaskDelegate,
    User: PrismaUserDelegate,
    // ... 所有数据模型
  }
}
```

### 1. 认证检查 (context.user)

```typescript
// ✅ 基础认证检查
export const myAction = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  // context.user 类型：
  // {
  //   id: number,
  //   email: string,
  //   username: string,
  //   isAdmin: boolean,
  //   credits: Decimal,
  //   // ... User 模型的所有字段
  // }

  const userId = context.user.id;
  const isAdmin = context.user.isAdmin;
};
```

### 2. 权限检查

```typescript
// ✅ 管理员权限检查
export const deleteUser = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, "需要管理员权限");
  }

  // 执行删除操作
};

// ✅ 资源所有权检查
export const updateTask = async ({ id, title }, context) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  // 查询任务
  const task = await context.entities.Task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new HttpError(404, "任务不存在");
  }

  // 检查是否是任务所有者
  if (task.userId !== context.user.id) {
    throw new HttpError(403, "无权修改此任务");
  }

  // 执行更新
  const updated = await context.entities.Task.update({
    where: { id },
    data: { title },
  });

  return updated;
};
```

### 3. 数据库操作 (context.entities)

#### 查询操作

```typescript
// ✅ findUnique - 查询单条记录（通过唯一字段）
const user = await context.entities.User.findUnique({
  where: { id: 1 },
});

const userByEmail = await context.entities.User.findUnique({
  where: { email: "user@example.com" },
});

// ✅ findMany - 查询多条记录
const tasks = await context.entities.Task.findMany({
  where: {
    userId: context.user.id,
    isDone: false,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 10,  // 限制数量
  skip: 0,   // 跳过数量（分页）
});

// ✅ findFirst - 查询第一条匹配的记录
const latestTask = await context.entities.Task.findFirst({
  where: { userId: context.user.id },
  orderBy: { createdAt: "desc" },
});

// ✅ count - 统计数量
const taskCount = await context.entities.Task.count({
  where: {
    userId: context.user.id,
    isDone: true,
  },
});
```

#### 创建操作

```typescript
// ✅ create - 创建单条记录
const task = await context.entities.Task.create({
  data: {
    title: "新任务",
    description: "描述",
    userId: context.user.id,
  },
});

// ✅ createMany - 批量创建（注意：不返回创建的记录）
const result = await context.entities.Task.createMany({
  data: [
    { title: "任务1", userId: context.user.id },
    { title: "任务2", userId: context.user.id },
  ],
});
// result: { count: 2 }
```

#### 更新操作

```typescript
// ✅ update - 更新单条记录
const updated = await context.entities.Task.update({
  where: { id: 1 },
  data: {
    isDone: true,
    updatedAt: new Date(),
  },
});

// ✅ updateMany - 批量更新
const result = await context.entities.Task.updateMany({
  where: {
    userId: context.user.id,
    isDone: false,
  },
  data: {
    isDone: true,
  },
});
// result: { count: 5 }

// ✅ upsert - 存在则更新，不存在则创建
const task = await context.entities.Task.upsert({
  where: { id: 1 },
  update: { title: "更新标题" },
  create: {
    title: "新任务",
    userId: context.user.id,
  },
});
```

#### 删除操作

```typescript
// ✅ delete - 删除单条记录
const deleted = await context.entities.Task.delete({
  where: { id: 1 },
});

// ✅ deleteMany - 批量删除
const result = await context.entities.Task.deleteMany({
  where: {
    userId: context.user.id,
    isDone: true,
  },
});
// result: { count: 3 }
```

#### 关联查询

```typescript
// ✅ include - 包含关联数据
const task = await context.entities.Task.findUnique({
  where: { id: 1 },
  include: {
    user: true,  // 包含关联的用户信息
  },
});
// task.user: { id, email, username, ... }

// ✅ select - 选择特定字段
const task = await context.entities.Task.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    title: true,
    user: {
      select: {
        username: true,
        email: true,
      },
    },
  },
});
// 只返回选中的字段

// ✅ 嵌套查询
const user = await context.entities.User.findUnique({
  where: { id: context.user.id },
  include: {
    tasks: {
      where: { isDone: false },
      orderBy: { createdAt: "desc" },
      take: 5,
    },
  },
});
// user.tasks: Task[]
```

---

## 5️⃣ 错误处理

### HttpError 类型

```typescript
import { HttpError } from "wasp/server";

// 常用 HTTP 状态码
throw new HttpError(400, "错误请求");        // Bad Request
throw new HttpError(401, "未登录");          // Unauthorized
throw new HttpError(403, "无权限");          // Forbidden
throw new HttpError(404, "资源不存在");      // Not Found
throw new HttpError(409, "资源冲突");        // Conflict
throw new HttpError(500, "服务器错误");      // Internal Server Error
```

### 完整的错误处理示例

```typescript
export const updateTask: UpdateTask = async ({ id, title }, context) => {
  try {
    // 1️⃣ 认证检查
    if (!context.user) {
      throw new HttpError(401, "未登录");
    }

    // 2️⃣ 参数验证
    if (!title || title.trim().length === 0) {
      throw new HttpError(400, "标题不能为空");
    }

    if (title.length > 200) {
      throw new HttpError(400, "标题过长（最多200字符）");
    }

    // 3️⃣ 资源存在性检查
    const task = await context.entities.Task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new HttpError(404, "任务不存在");
    }

    // 4️⃣ 权限检查
    if (task.userId !== context.user.id) {
      throw new HttpError(403, "无权修改此任务");
    }

    // 5️⃣ 执行更新
    const updated = await context.entities.Task.update({
      where: { id },
      data: { title: title.trim() },
    });

    return updated;

  } catch (error) {
    // 6️⃣ 错误处理
    if (error instanceof HttpError) {
      // 已知的业务错误，直接抛出
      throw error;
    }

    // 未知错误，记录日志并返回通用错误
    console.error("更新任务失败:", error);
    throw new HttpError(500, "更新任务失败，请稍后重试");
  }
};
```

### 外部 API 调用的错误处理

```typescript
import { HttpError } from "wasp/server";

export const generateGptResponse = async ({ prompt }, context) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  try {
    // 调用外部 API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    // ✅ 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API 错误:", errorData);

      // 根据不同的错误码返回不同的消息
      if (response.status === 429) {
        throw new HttpError(429, "请求过于频繁，请稍后再试");
      }
      if (response.status === 401) {
        throw new HttpError(500, "API 配置错误");
      }
      throw new HttpError(500, "AI 服务暂时不可用");
    }

    // ✅ 解析响应
    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new HttpError(500, "AI 返回了空响应");
    }

    // ✅ 扣除积分
    const cost = calculateCost(data.usage);
    await deductCredits(context.user.id, cost, context);

    // ✅ 保存记录
    await context.entities.GptResponse.create({
      data: {
        userId: context.user.id,
        prompt,
        response: content,
        cost,
      },
    });

    return { content, cost };

  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    // 网络错误、超时等
    console.error("AI 生成失败:", error);
    throw new HttpError(500, "AI 生成失败，请稍后重试");
  }
};
```

---

## 6️⃣ 实战示例

### 示例 1：完整的 CRUD 操作（任务管理）

```typescript
// src/demo-ai-app/operations.ts
import { Task } from "wasp/entities";
import type {
  GetAllTasksByUser,
  CreateTask,
  UpdateTask,
  DeleteTask,
} from "wasp/server/operations";
import { HttpError } from "wasp/server";

// ==================== Query ====================

// 获取用户的所有任务
export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  return await context.entities.Task.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: "desc" },
  });
};

// ==================== Actions ====================

// 创建任务
type CreateTaskArgs = {
  title: string;
  description?: string;
};

export const createTask: CreateTask<CreateTaskArgs, Task> = async (
  { title, description },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  if (!title || title.trim().length === 0) {
    throw new HttpError(400, "标题不能为空");
  }

  return await context.entities.Task.create({
    data: {
      title: title.trim(),
      description: description?.trim(),
      userId: context.user.id,
    },
  });
};

// 更新任务
type UpdateTaskArgs = {
  id: number;
  title?: string;
  description?: string;
  isDone?: boolean;
};

export const updateTask: UpdateTask<UpdateTaskArgs, Task> = async (
  { id, title, description, isDone },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  // 检查任务是否存在且属于当前用户
  const task = await context.entities.Task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new HttpError(404, "任务不存在");
  }

  if (task.userId !== context.user.id) {
    throw new HttpError(403, "无权修改此任务");
  }

  // 构建更新数据
  const data: any = {};
  if (title !== undefined) data.title = title.trim();
  if (description !== undefined) data.description = description?.trim();
  if (isDone !== undefined) data.isDone = isDone;

  return await context.entities.Task.update({
    where: { id },
    data,
  });
};

// 删除任务
type DeleteTaskArgs = {
  id: number;
};

export const deleteTask: DeleteTask<DeleteTaskArgs, Task> = async (
  { id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  // 检查任务是否存在且属于当前用户
  const task = await context.entities.Task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new HttpError(404, "任务不存在");
  }

  if (task.userId !== context.user.id) {
    throw new HttpError(403, "无权删除此任务");
  }

  return await context.entities.Task.delete({
    where: { id },
  });
};
```

### 示例 2：积分扣费（业务逻辑）

```typescript
// src/shared/creditUtils.ts
import { Decimal } from "decimal.js";
import { HttpError } from "wasp/server";
import type { User } from "wasp/entities";

/**
 * 扣除用户积分
 */
export async function deductCredits(
  userId: number,
  amount: Decimal,
  context: any
): Promise<void> {
  // 1️⃣ 获取用户当前积分
  const user = await context.entities.User.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user) {
    throw new HttpError(404, "用户不存在");
  }

  const currentCredits = new Decimal(user.credits.toString());
  const costAmount = new Decimal(amount.toString());

  // 2️⃣ 检查积分是否足够
  if (currentCredits.lessThan(costAmount)) {
    throw new HttpError(402, "积分不足，请充值");
  }

  // 3️⃣ 扣除积分
  const newCredits = currentCredits.minus(costAmount);

  await context.entities.User.update({
    where: { id: userId },
    data: { credits: newCredits.toFixed(6) },
  });

  // 4️⃣ 记录日志
  await context.entities.Logs.create({
    data: {
      userId,
      message: `扣除积分: ${costAmount.toFixed(6)}`,
      level: "info",
    },
  });
}

/**
 * 计算 AI API 调用成本
 */
export function calculateAICost(
  model: string,
  inputTokens: number,
  outputTokens: number
): Decimal {
  // 从配置读取定价
  const pricing = {
    "gpt-4": {
      input: new Decimal("0.00003"),   // 每 token 0.00003 积分
      output: new Decimal("0.00006"),  // 每 token 0.00006 积分
    },
    "gpt-3.5-turbo": {
      input: new Decimal("0.000001"),
      output: new Decimal("0.000002"),
    },
  };

  const modelPricing = pricing[model] || pricing["gpt-3.5-turbo"];

  const inputCost = modelPricing.input.times(inputTokens);
  const outputCost = modelPricing.output.times(outputTokens);

  return inputCost.plus(outputCost);
}
```

### 示例 3：管理员功能（权限控制）

```typescript
// src/admin/operations.ts
import type { UpdateIsUserAdminById } from "wasp/server/operations";
import { HttpError } from "wasp/server";

/**
 * 设置用户的管理员状态（仅管理员可操作）
 */
type UpdateIsUserAdminByIdArgs = {
  userId: number;
  isAdmin: boolean;
};

export const updateIsUserAdminById: UpdateIsUserAdminById<
  UpdateIsUserAdminByIdArgs,
  void
> = async ({ userId, isAdmin }, context) => {
  // 1️⃣ 检查当前用户是否是管理员
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403, "需要管理员权限");
  }

  // 2️⃣ 不能修改自己的管理员状态
  if (context.user.id === userId) {
    throw new HttpError(400, "不能修改自己的管理员状态");
  }

  // 3️⃣ 检查目标用户是否存在
  const targetUser = await context.entities.User.findUnique({
    where: { id: userId },
  });

  if (!targetUser) {
    throw new HttpError(404, "用户不存在");
  }

  // 4️⃣ 更新管理员状态
  await context.entities.User.update({
    where: { id: userId },
    data: { isAdmin },
  });

  // 5️⃣ 记录日志
  await context.entities.Logs.create({
    data: {
      userId: context.user.id,
      message: `${isAdmin ? "授予" : "撤销"}用户 ${userId} 的管理员权限`,
      level: "info",
    },
  });
};
```

---

## 7️⃣ 前端调用

### Query 调用

```typescript
// 前端组件
import { useQuery } from "wasp/client/operations";
import { getAllTasksByUser } from "wasp/client/operations";

export function TaskList() {
  // ✅ useQuery - 自动处理加载状态、错误、缓存
  const { data: tasks, isLoading, error, refetch } = useQuery(getAllTasksByUser);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      {tasks?.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
      <button onClick={refetch}>刷新</button>
    </div>
  );
}
```

### Action 调用

```typescript
// 前端组件
import { useAction } from "wasp/client/operations";
import { createTask, updateTask, deleteTask } from "wasp/client/operations";

export function TaskForm() {
  const createTaskFn = useAction(createTask);
  const updateTaskFn = useAction(updateTask);
  const deleteTaskFn = useAction(deleteTask);

  const handleCreate = async () => {
    try {
      const task = await createTaskFn({
        title: "新任务",
        description: "描述",
      });
      console.log("创建成功:", task);
    } catch (error) {
      console.error("创建失败:", error.message);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateTaskFn({
        id,
        isDone: true,
      });
      console.log("更新成功");
    } catch (error) {
      console.error("更新失败:", error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTaskFn({ id });
      console.log("删除成功");
    } catch (error) {
      console.error("删除失败:", error.message);
    }
  };

  return <button onClick={handleCreate}>创建任务</button>;
}
```

---

## 8️⃣ 开发检查清单

### 在编写 Query/Action 之前

- [ ] 是否在 `schema.prisma` 中定义了数据模型？
- [ ] 是否执行了 `wasp db migrate-dev`？
- [ ] 是否在 `main.wasp` 中声明了 Query/Action？
- [ ] 是否正确声明了 `entities` 参数？

### 在实现业务逻辑时

- [ ] 是否检查了 `context.user` 进行认证？
- [ ] 是否进行了必要的权限检查？
- [ ] 是否验证了用户输入参数？
- [ ] 是否正确使用了 `context.entities` 进行数据库操作？
- [ ] 是否处理了可能的错误情况？
- [ ] 是否使用了 `HttpError` 返回友好的错误消息？

### 在调用外部 API 时

- [ ] 是否处理了 API 调用失败的情况？
- [ ] 是否验证了 API 返回的数据格式？
- [ ] 是否使用了环境变量存储 API Key？
- [ ] 是否添加了超时处理？
- [ ] 是否记录了错误日志？

### 在完成开发后

- [ ] 是否在前端测试了所有功能？
- [ ] 是否测试了错误情况（无权限、参数错误等）？
- [ ] 是否添加了必要的日志记录？
- [ ] 是否更新了相关文档？

---

## 9️⃣ 常见问题

### Q1: Query 和 Action 有什么区别？

**Query**:
- 用于读取数据
- 前端会自动缓存
- 当相关 Action 执行后会自动刷新
- 使用 `useQuery` hook

**Action**:
- 用于修改数据（创建、更新、删除）
- 不缓存
- 执行后自动触发相关 Query 刷新
- 使用 `useAction` hook

### Q2: 如何在 Query/Action 中访问当前用户？

```typescript
export const myQuery = async (args, context) => {
  // context.user 包含当前登录用户的信息
  const user = context.user;

  if (!user) {
    throw new HttpError(401, "未登录");
  }

  console.log(user.id, user.email, user.isAdmin);
};
```

### Q3: 如何进行数据库事务操作？

```typescript
import { prisma } from "wasp/server";

export const transferCredits = async ({ fromUserId, toUserId, amount }, context) => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(403, "需要管理员权限");
  }

  // 使用 Prisma 事务
  await prisma.$transaction(async (tx) => {
    // 1. 扣除发送方积分
    await tx.user.update({
      where: { id: fromUserId },
      data: { credits: { decrement: amount } },
    });

    // 2. 增加接收方积分
    await tx.user.update({
      where: { id: toUserId },
      data: { credits: { increment: amount } },
    });

    // 如果任何操作失败，整个事务会回滚
  });
};
```

### Q4: 如何实现分页？

```typescript
type GetTasksArgs = {
  page: number;
  pageSize: number;
};

export const getTasksPaginated = async ({ page, pageSize }, context) => {
  if (!context.user) {
    throw new HttpError(401, "未登录");
  }

  const skip = (page - 1) * pageSize;

  const [tasks, total] = await Promise.all([
    // 获取当页数据
    context.entities.Task.findMany({
      where: { userId: context.user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    // 获取总数
    context.entities.Task.count({
      where: { userId: context.user.id },
    }),
  ]);

  return {
    tasks,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};
```

### Q5: 如何调用环境变量？

```typescript
// ✅ 服务器端（Query/Action 中）
const apiKey = process.env.OPENAI_API_KEY;

// ⚠️ 客户端环境变量
// 在 .env.client 中定义，以 REACT_APP_ 开头
// REACT_APP_PUBLIC_URL=https://example.com

// 前端访问
const publicUrl = import.meta.env.REACT_APP_PUBLIC_URL;
```

---

## 🎯 总结

### 核心要点

1. **Wasp 已经完成了 90% 的工作**
   - 认证、数据库、类型安全、API 路由
   - 你只需要写业务逻辑

2. **标准流程**
   - 定义数据模型 → 迁移数据库 → 声明 Query/Action → 实现逻辑 → 前端调用

3. **必须检查的三件事**
   - ✅ 认证：`if (!context.user)`
   - ✅ 权限：`if (!context.user.isAdmin)`
   - ✅ 所有权：`if (resource.userId !== context.user.id)`

4. **错误处理**
   - 使用 `HttpError` 返回友好错误
   - 记录错误日志方便调试
   - 处理外部 API 调用失败

5. **类型安全**
   - Wasp 自动生成所有类型
   - 充分利用 TypeScript 类型检查
   - 避免运行时错误

---

## 📚 相关文档

- [PROJECT_STRUCTURE_AND_STRATEGY.md](./PROJECT_STRUCTURE_AND_STRATEGY.md) - 项目结构与开发策略
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 完整架构设计
- [Wasp 官方文档 - Operations](https://wasp-lang.dev/docs/data-model/operations/overview)
- [Prisma 官方文档](https://www.prisma.io/docs/)

---

记住：**后端开发的重点是业务逻辑，而不是基础设施。Wasp 已经帮你处理好了基础设施，让你专注于创造价值！**
