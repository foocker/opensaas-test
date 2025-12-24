/**
 * 网站配置文件
 * 通过修改这个文件来快速定制你的 SaaS 应用
 */

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
export const ExternalLinks = {
  documentation: "https://docs.opensaas.sh",
  blog: "https://docs.opensaas.sh/blog",
  github: "https://github.com/wasp-lang/wasp",
} as const;

// ==================== 功能开关配置 ====================
export const FeatureFlags = {
  // 首页区块显示配置
  // 每个区块都可以独立开关，支持快速组合不同的首页效果
  landingPage: {
    showHero: true,              // Hero 区域（主标题、副标题、CTA 按钮）
    showExamples: false,          // 示例轮播（展示使用案例）
    showClients: false,          // 客户/技术栈 Logo 展示（Used by）
    showHighlightedFeature: false, // 突出功能展示（大图 + 文字说明）
    showFeatures: false,         // 传统列表式功能展示（2列布局）
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

  // AI 功能
  ai: {
    scheduler: true,       // AI 日程规划
    // 后续可以添加更多 AI 功能
  },

  // 其他功能
  fileUpload: false,       // 文件上传功能
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
