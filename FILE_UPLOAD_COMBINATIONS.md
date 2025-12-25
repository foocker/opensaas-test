# File Upload 功能组合方案

## 📋 File Upload 当前能力

**支持的文件类型：**
- ✅ 图片：JPEG, PNG
- ✅ 文档：PDF
- ✅ 文本：所有文本文件
- ✅ 视频：QuickTime (.mov), MP4

**技术栈：**
- 存储：阿里云 OSS（S3兼容）
- 最大文件大小：5MB
- 功能：上传、下载、删除

---

## 🎯 可以组合的应用场景

### 1. **AI 图像处理工作流** ⭐⭐⭐⭐⭐

**组合功能：**
- File Upload（上传图片）
- AI Image Generator（图像处理）

**应用场景：**
```
用户上传图片 → AI 处理（去背景、风格转换、图像增强）→ 下载处理后的图片
```

**实现思路：**
1. 用户在 File Upload 页面上传原始图片
2. 在 AI Image Generator 中读取已上传的图片
3. 使用 AI 对图片进行处理（参考图生成、风格迁移等）
4. 将处理后的图片保存到用户文件列表

**配置：**
```typescript
// config.ts
ai: {
  imageGenerator: true,  // ✅ 启用
}
fileUpload: true,        // ✅ 启用
```

---

### 2. **AI 文档分析系统** ⭐⭐⭐⭐

**组合功能：**
- File Upload（上传 PDF/文本）
- AI Text Generator（未实现，需开发）

**应用场景：**
```
上传文档 → AI 提取摘要/关键信息 → 生成分析报告
```

**可以实现：**
- 📄 PDF 智能摘要
- 📝 文档关键词提取
- 🔍 内容分析和问答
- 📊 数据提取

**需要开发：**
```typescript
// 新增 AI 文本生成功能
ai: {
  textGenerator: true,   // 需实现
  documentAnalysis: true, // 需实现
}
```

---

### 3. **视频字幕生成** ⭐⭐⭐⭐

**组合功能：**
- File Upload（上传视频）
- AI 语音识别（需开发）

**应用场景：**
```
上传视频 → AI 提取音频 → 语音转文字 → 生成字幕文件
```

**支持的视频格式：**
- QuickTime (.mov)
- MP4

**需要开发：**
- 视频音频提取
- AI 语音转文字（Whisper API）
- 字幕文件生成（SRT格式）

---

### 4. **AI 训练数据管理** ⭐⭐⭐

**组合功能：**
- File Upload（上传训练数据）
- AI 模型训练（需开发）

**应用场景：**
```
上传数据集 → 数据预处理 → AI 模型训练 → 模型部署
```

**适用于：**
- 图像分类训练数据
- 文本语料库
- 标注数据集

---

## 🚀 推荐实现顺序

### 阶段 1：快速实现（1-2天）⚡

**场景：AI 图像处理工作流**

1. **修改 AI Image Generator，支持上传图片作为参考**

   在 [BananaPlayground.tsx](app/src/landing-page/components/BananaPlayground.tsx) 中添加：
   ```typescript
   // 新增：从已上传文件中选择参考图
   const { data: userFiles } = useQuery(getAllFilesByUser);
   ```

2. **添加"使用已上传图片"按钮**
   - 显示用户已上传的图片列表
   - 点击图片自动填充为参考图

3. **保存生成的图片到文件列表**
   ```typescript
   // 生成图片后自动上传到用户文件
   const saveGeneratedImage = async (imageBase64: string) => {
     const blob = base64ToBlob(imageBase64);
     await uploadFileWithProgress(blob, "generated-image.png");
   };
   ```

**优势：**
- ✅ 无需新开发 AI 功能
- ✅ 利用现有的 File Upload 和 Image Generator
- ✅ 用户体验提升明显

---

### 阶段 2：中期扩展（1周）📈

**场景：AI 文档分析**

1. **新增 AI 文本功能**

   在 [config.ts](app/src/shared/config.ts) 中：
   ```typescript
   ai: {
     textGenerator: true,      // 新增
     documentAnalysis: true,   // 新增
   }
   ```

2. **创建文档分析页面**
   ```bash
   mkdir app/src/document-analysis
   touch app/src/document-analysis/DocumentAnalysisPage.tsx
   ```

3. **实现 PDF/文本提取**
   - 使用 `pdf-parse` 提取 PDF 文本
   - 调用 OpenAI/Gemini API 进行分析

4. **生成分析报告**
   - 摘要
   - 关键词
   - 主题分类

---

### 阶段 3：长期规划（1个月+）🎯

**场景：完整的 AI 内容处理平台**

**功能矩阵：**

| 输入类型 | AI 处理 | 输出结果 |
|---------|---------|---------|
| 图片 | 风格转换、去背景、增强 | 处理后图片 |
| 文档 | 摘要、分析、翻译 | 分析报告 |
| 视频 | 字幕生成、场景检测 | 字幕文件 |
| 音频 | 转文字、降噪 | 文本/音频 |

---

## 💡 具体实现示例

### 示例 1：AI 图像处理工作流

**第 1 步：上传原始图片**

用户访问 `/file-upload`，上传图片：
```
原始图片.jpg → 上传到阿里云 OSS → 保存记录到数据库
```

**第 2 步：在 AI Generator 中使用**

修改 [BananaPlayground.tsx](app/src/landing-page/components/BananaPlayground.tsx)：

```typescript
// 新增：选择已上传图片作为参考
const [selectedFileId, setSelectedFileId] = useState<string>("");
const { data: userFiles } = useQuery(getAllFilesByUser);

// 显示文件选择器
<div className="uploaded-images-selector">
  {userFiles?.map(file => (
    <img
      key={file.id}
      src={file.downloadUrl}
      onClick={() => setSelectedFileId(file.id)}
      className={selectedFileId === file.id ? "selected" : ""}
    />
  ))}
</div>

// 使用选中的图片作为参考
const handleGenerate = async () => {
  const selectedFile = userFiles?.find(f => f.id === selectedFileId);
  if (selectedFile) {
    // 下载图片并转为 base64
    const imageBase64 = await fetchImageAsBase64(selectedFile.s3Key);

    // 调用 AI API，使用参考图生成
    const result = await generateImage({
      model: selectedModel,
      prompt: userPrompt,
      images: [imageBase64], // 参考图
    });
  }
};
```

**第 3 步：保存生成结果**

```typescript
// 将生成的图片保存到用户文件
const saveResult = async (imageBase64: string) => {
  // 1. 获取上传 URL
  const { uploadUrl, s3Key } = await createFileUploadUrl({
    fileName: `generated-${Date.now()}.png`,
    fileType: "image/png",
  });

  // 2. Base64 转 Blob
  const blob = base64ToBlob(imageBase64);

  // 3. 上传到 OSS
  await uploadFileWithProgress(blob, uploadUrl);

  // 4. 保存记录到数据库
  await addFileToDb({
    s3Key,
    name: `AI Generated Image - ${Date.now()}`,
    type: "image/png",
  });

  toast({
    title: "Success",
    description: "Generated image saved to your files!",
  });
};
```

---

### 示例 2：PDF 文档摘要

**新建功能模块：**

```typescript
// app/src/document-analysis/operations.ts
export const analyzePdf = async (args: { fileId: string }, context) => {
  // 1. 获取文件
  const file = await context.entities.File.findUnique({
    where: { id: args.fileId },
  });

  // 2. 从 OSS 下载 PDF
  const pdfBuffer = await downloadFromOSS(file.s3Key);

  // 3. 提取文本
  const pdfParse = require("pdf-parse");
  const pdfData = await pdfParse(pdfBuffer);
  const text = pdfData.text;

  // 4. 调用 AI 生成摘要
  const response = await chatCompletion([
    {
      role: "system",
      content: "你是一个专业的文档分析助手。请为以下文档生成摘要。",
    },
    {
      role: "user",
      content: `请为以下文档生成摘要（不超过200字）：\n\n${text}`,
    },
  ], "google/gemini-2.0-flash-exp");

  return {
    summary: response.text,
    wordCount: text.split(/\s+/).length,
    pageCount: pdfData.numpages,
  };
};
```

---

## 🎨 配置示例

### 场景 1：纯图像处理平台

```typescript
// config.ts
export const FeatureFlags = {
  ai: {
    scheduler: false,
    imageGenerator: true,   // ✅ 启用
    textGenerator: false,
  },
  fileUpload: true,         // ✅ 启用

  landingPage: {
    showBananaPlayground: true,  // ✅ 主要功能
    showAITemplates: true,
    showHero: true,
  },
};
```

**用户体验：**
1. Landing Page → 试用 AI 图像生成
2. 注册/登录
3. File Upload → 上传自己的图片
4. AI Generator → 使用上传的图片作为参考
5. 下载/分享生成结果

---

### 场景 2：多功能 AI 平台

```typescript
// config.ts
export const FeatureFlags = {
  ai: {
    scheduler: true,        // 任务规划
    imageGenerator: true,   // 图像生成
    textGenerator: true,    // 文本分析（需开发）
  },
  fileUpload: true,
  documentAnalysis: true,   // 文档分析（需开发）
};
```

**用户菜单：**
- AI Day Scheduler
- AI Image Generator
- Document Analysis ⭐ 新增
- File Upload
- Account Settings

---

## 📊 总结

### 当前可用组合（无需额外开发）

1. **AI 图像 + File Upload**
   - 上传参考图
   - 生成新图像
   - 保存到文件库

### 需要开发的组合

2. **AI 文本 + File Upload**
   - PDF 摘要
   - 文档分析
   - 需要 1 周开发

3. **AI 视频 + File Upload**
   - 字幕生成
   - 场景检测
   - 需要 2 周开发

### 推荐优先级

⭐⭐⭐⭐⭐ **优先实现：AI 图像处理工作流**
- 最快实现（1-2天）
- 用户价值高
- 无需新 AI 功能

⭐⭐⭐⭐ **次优先：文档分析**
- 中等开发量（1周）
- 差异化功能
- 商业价值高

⭐⭐⭐ **长期规划：视频处理**
- 开发量大（2周+）
- 技术难度较高
- 市场需求大

---

**现在就可以开始实现 AI 图像处理工作流！** 🚀
