/**
 * 网站配置文件
 * 通过修改这个文件来快速定制你的 SaaS 应用
 */

import { fa } from "@faker-js/faker";

// ==================== 品牌配置 ====================
export const SiteConfig = {
  // 网站名称（显示在导航栏、页脚等位置）
  name: "Nano Banana Magic",

  // 网站简称（用于移动端等空间受限的地方）
  shortName: "NBM",

  // 网站描述
  description: "比 Google AI 便宜 70% 的 AI 服务平台",

  // Logo 路径（相对于 src/client/static/）
  logo: "logo.webp",

  // Logo alt 文字
  logoAlt: "Nano Banana Magic",
} as const;

// ==================== 导航菜单配置 ====================
export const NavigationConfig = {
  // 启用的营销页面导航项
  marketing: {
    features: false,     // 功能介绍（目前配置是去掉）
    pricing: true,       // 定价页面
    documentation: false, // 文档（外部链接）
    blog: false,         // 博客（外部链接）
  },

  // 启用的 Demo 功能导航项
  demo: {
    aiScheduler: true,   // AI 日程规划
    fileUpload: false,   // 文件上传（可以关闭不需要的功能）
    documentation: false,
    blog: false,
  },
} as const;

// ==================== 外部链接配置 ====================
//
// 链接类型说明：
// 1. 内部路由（推荐）: "/about"
//    - 用于同一个 Wasp 应用内的页面
//    - 单页应用 (SPA) 导航，不重新加载
//    - 需要在 main.wasp 中定义对应的路由和页面
//
// 2. 外部链接: "https://example.com"
//    - 用于独立部署的服务（如独立的博客、文档站）
//    - 用于其他网站（如 GitHub、Twitter）
//    - 浏览器会完全重新加载页面
//
// 3. 占位符: "#"
//    - 点击后不跳转，停留在当前页面
//    - 仅用于页面未开发时的临时占位
//    - 开发完成后应改为内部路由或外部链接
//
export const ExternalLinks = {
  // ==================== 顶部导航链接 ====================
  // documentation: "https://docs.opensaas.sh",  // 外部文档站
  // github: "https://github.com/foocker/opensaas-test",
  // blog: "https://docs.opensaas.sh/blog",      // 外部博客

  documentation: "#",  // 外部文档站
  github: "https://github.com/foocker/opensaas-test",
  blog: "#",      // 外部博客

  // ==================== Footer 链接配置 ====================
  footer: {
    // --- App 区块 ---
    // 如果你的文档/博客是独立部署的，使用外链
    documentationFooter: "#",
    blogFooter: "#",

    // --- Company 区块 ---
    // 推荐使用内部路由（需要在 main.wasp 中定义页面）
    about: "/about",      // 内部路由 - 关于我们页面
    privacy: "/privacy",  // 内部路由 - 隐私政策页面
    terms: "/terms",      // 内部路由 - 服务条款页面

    // 如果页面未开发，可以暂时使用占位符:
    // about: "#",    // 占位符 - 点击不跳转
    // privacy: "#",
    // terms: "#",

    // ❌ 不推荐: 外链到自己的域名（会导致页面重新加载）
    // about: "https://nbartai.com/about",
  },

  // ==================== 社交媒体链接配置 ====================
  social: {
    twitter: "#",  // Twitter/X 链接（填入你的 Twitter 主页，如 "https://twitter.com/yourhandle"）
    github: "https://github.com/foocker/opensaas-test",  // GitHub 仓库链接
    discord: "#",  // Discord 社区链接（如果有）
    youtube: "#",  // YouTube 频道链接（如果有）

    // 其他可用的社交媒体平台（按需取消注释并填入链接）:
    // linkedin: "https://www.linkedin.com/company/yourcompany",
    // facebook: "https://www.facebook.com/yourpage",
    // instagram: "https://www.instagram.com/yourhandle",
    // tiktok: "https://www.tiktok.com/@yourhandle",
  },
} as const;

// ==================== 功能开关配置 ====================
export const FeatureFlags = {
  // 首页区块显示配置
  // 每个区块都可以独立开关，支持快速组合不同的首页效果
  landingPage: {
    showHero: true,              // Hero 区域（主标题、副标题、CTA 按钮）
    showAITemplates: true,       // AI 精选模板（精选的 AI 图像生成模板）
    showBananaPlayground: true,  // Banana 游乐场（AI 图像生成交互界面）
    showExamples: false,          // 示例轮播（展示使用案例）
    showClients: false,          // 客户/技术栈 Logo 展示（Used by）
    showHighlightedFeature: false, // 突出功能展示（大图 + 文字说明）
    showFeatures: false,         // 传统列表式功能展示（2列布局） 似乎没效果 TODO 
    showFeaturesGrid: false,      // Bento 风格功能网格（推荐使用）
    showTestimonials: false,      // 用户评价（What Our Users Say）
    showFAQ: false,               // 常见问题（手风琴式展开）
    showFooter: true,            // 页脚导航
  },

  // 认证功能
  auth: {
    emailPassword: true,   // 邮箱密码登录
    googleOAuth: false,    // Google OAuth（中国大陆建议关闭）
  },

  // 支付功能
  payment: {
    stripe: true,          // Stripe 支付
    alipay: false,         // 支付宝（待实现）
  },

  // AI 功能模块（通过配置控制显示与否）
  ai: {
    scheduler: false,       // AI 日程规划（AI Day Scheduler）
    imageGenerator: true,  // AI 图像生成（Banana Playground）
    textGenerator: false,  // AI 文本生成（待实现）
    // 后续可以添加更多 AI 功能
  },

  // 其他功能
  fileUpload: true,       // 文件上传功能
  analytics: true,         // Google Analytics
} as const;

// ==================== 导航项标签配置 ====================
// 可以自定义导航项的显示文字
export const NavigationLabels = {
  features: "功能",
  pricing: "定价",
  documentation: "文档",
  blog: "博客",
  aiScheduler: "AI 日程规划",
  fileUpload: "文件上传",
} as const;

// ==================== 辅助函数 ====================
/**
 * 获取启用的营销导航项
 */
export function getEnabledMarketingNavItems() {
  const items: Array<{ name: string; to: string }> = [];

  if (NavigationConfig.marketing.features) {
    items.push({ name: NavigationLabels.features, to: "/#features" });
  }

  if (NavigationConfig.marketing.pricing) {
    items.push({ name: NavigationLabels.pricing, to: "/pricing" });
  }

  if (NavigationConfig.marketing.documentation) {
    items.push({ name: NavigationLabels.documentation, to: ExternalLinks.documentation });
  }

  if (NavigationConfig.marketing.blog) {
    items.push({ name: NavigationLabels.blog, to: ExternalLinks.blog });
  }

  return items;
}

/**
 * 获取启用的 Demo 导航项
 */
export function getEnabledDemoNavItems() {
  const items: Array<{ name: string; to: string }> = [];

  if (NavigationConfig.demo.aiScheduler && FeatureFlags.ai.scheduler) {
    items.push({ name: NavigationLabels.aiScheduler, to: "/demo" });
  }

  if (NavigationConfig.demo.fileUpload && FeatureFlags.fileUpload) {
    items.push({ name: NavigationLabels.fileUpload, to: "/file-upload" });
  }

  if (NavigationConfig.demo.documentation) {
    items.push({ name: NavigationLabels.documentation, to: ExternalLinks.documentation });
  }

  if (NavigationConfig.demo.blog) {
    items.push({ name: NavigationLabels.blog, to: ExternalLinks.blog });
  }

  return items;
}
