# Opensaas Builder

一个**配置驱动**的 SaaS 框架，提供完整的基础设施，让你只需专注于业务逻辑。

## 🚀 项目结构

```
opensaas-test/
├── app/                # Web 应用（Wasp 框架）
├── docs/               # 📚 完整文档（配置、使用指南）
├── e2e-tests/          # Playwright 端到端测试
├── blog/               # 博客/文档站（Astro + Starlight）
└── README.md           # 项目说明
```

## ✨ 核心特性

- ✅ **Stripe 支付系统** - 充值积分、订阅套餐
- ✅ **AI API 集成** - 多提供商支持（OpenRouter, Nano API）
- ✅ **积分系统** - Decimal 精度、动态扣费
- ✅ **文件上传** - 阿里云 OSS、图片/视频/PDF 支持
- ✅ **用户认证** - 邮箱密码、Google OAuth
- ✅ **邮件发送** - SMTP (Resend)、邮件模板
- ✅ **管理员面板** - 用户统计、收入分析、流量来源
- ✅ **功能配置系统** - 配置驱动、动态菜单
- ✅ **SEO 优化** - Meta 标签、Sitemap、结构化数据
- ✅ **Google Analytics** - 流量统计和分析

## 📚 文档索引

### 🎯 核心指南

| 文档 | 说明 |
|------|------|
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | **完整架构设计** - 系统概览、开发流程 |
| [GOOGLE_ANALYTICS_SETUP.md](./docs/GOOGLE_ANALYTICS_SETUP.md) | Google Analytics 配置指南 |
| [SEO_GUIDE.md](./docs/SEO_GUIDE.md) | SEO 优化完整指南 |
| [AI_API_GUIDE.md](./docs/AI_API_GUIDE.md) | AI API 使用文档 |
| [AUTH_GUIDE.md](./docs/AUTH_GUIDE.md) | 用户认证配置 |
| [EMAIL_GUIDE.md](./docs/EMAIL_GUIDE.md) | 邮件系统配置 |

### 🔧 功能模块

| 文档 | 说明 |
|------|------|
| [CREDIT_SYSTEM.md](./docs/CREDIT_SYSTEM.md) | 积分系统架构 |
| [STRIPE_SETUP.md](./docs/STRIPE_SETUP.md) | Stripe 支付配置 |
| [FEATURES_CONFIG.md](./docs/FEATURES_CONFIG.md) | 功能模块配置 |
| [FILE_UPLOAD_COMBINATIONS.md](./docs/FILE_UPLOAD_COMBINATIONS.md) | 文件上传使用方案 |

### 📖 其他文档

| 文档 | 说明 |
|------|------|
| [CONFIGURATION_GUIDE.md](./docs/CONFIGURATION_GUIDE.md) | 配置系统指南 |
| [CONFIG_GUIDE.md](./docs/CONFIG_GUIDE.md) | Landing Page 配置 |
| [COMPONENTS_MAPPING.md](./docs/COMPONENTS_MAPPING.md) | 组件映射说明 |
| [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md) | 快速参考 |

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo>
cd opensaas-test
```

### 2. 安装依赖

```bash
cd app
npm install
```

### 3. 配置环境变量

```bash
cp app/.env.server.example app/.env.server
cp app/.env.client.example app/.env.client
# 编辑这两个文件，填入你的 API Keys
```

### 4. 启动开发服务器

```bash
wasp start
```

### 5. 访问应用

- 前端: `http://localhost:3000`
- 管理员: `http://localhost:3000/admin`

## 📖 详细说明

查看各目录的 README：

- [app/README.md](./app/README.md) - Web 应用说明
- [e2e-tests/README.md](./e2e-tests/README.md) - 测试说明
- [blog/README.md](./blog/README.md) - 博客/文档站说明

## 🎯 核心设计理念

### 1. 配置驱动

所有功能通过 `config.ts` 控制，无需修改核心代码：

```typescript
export const FeatureFlags = {
  ai: {
    imageGenerator: true,  // ✅ 启用 AI 图像生成
    textGenerator: false,  // ⚠️ 未实现
  },
  fileUpload: true,        // ✅ 启用文件上传
  analytics: true,         // ✅ 启用 Google Analytics
};
```

### 2. 解耦设计

各模块完全独立，可任意组合：

- 充值逻辑：`plans.ts` + Stripe Dashboard
- 扣费逻辑：`creditPricing.ts`（独立配置）
- 两者互不影响，可独立调整

### 3. 开箱即用

用户只需：
1. 实现前端 UI
2. 实现业务逻辑
3. 调用已有的基础设施

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

基于 [Open Saas](https://opensaas.sh) 模板构建。

---

**🎉 现在开始构建你的 AI 驱动的 SaaS 产品吧！**
