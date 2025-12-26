/**
 * 资源配置文件 - 集中管理公共图片路径
 *
 * 🎯 为什么需要这个文件？
 * 1. 集中管理 - 品牌相关的图片路径在一个地方
 * 2. 易于替换 - 修改品牌图片只需改这里
 * 3. 类型安全 - TypeScript 自动补全和检查
 * 4. 避免错误 - 拼写错误会被立即发现
 *
 * 📝 管理原则：
 * ✅ 管理：品牌 Logo、Banner、Favicon 等公共资源
 * ❌ 不管理：业务相关的动态内容（AI 模板、用户上传等）
 *
 * 📝 使用方法：
 * import { BrandAssets, FeatureAssets } from "@src/shared/assets";
 * <img src={BrandAssets.logo} alt="Logo" />
 */

// ==================== 品牌资源 ====================
// 需要替换为你自己的品牌图片
export const BrandAssets = {
  // 🏢 Logo
  logo: "/logo.webp",                              // 主 Logo（需要替换）
  logoAlt: "Nano Banana Magic",                    // Logo alt 文字

  // 📱 Banner（用于 SEO、社交媒体分享）
  bannerLight: "/open-saas-banner-light.svg",      // 浅色主题 Banner（需要替换）
  bannerDark: "/open-saas-banner-dark.svg",        // 深色主题 Banner（需要替换）
  publicBanner: "/public-banner.webp",             // 公开分享用的 Banner（需要替换）

  // 👤 头像占位符
  avatarPlaceholder: "/avatar-placeholder.webp",   // 用户头像占位符
} as const;

// ==================== 功能展示资源 ====================
// OpenSaaS 模板的示例图片，可以替换为你自己的功能截图
export const FeatureAssets = {
  aiReady: "/assets/aiready.webp",                 // AI 功能展示
  aiReadyDark: "/assets/aiready-dark.webp",        // AI 功能展示（深色）
  payments: "/assets/payments.webp",               // 支付功能展示
  fileUpload: "/assets/fileupload.webp",           // 文件上传展示
  admin: "/assets/admin.webp",                     // 管理后台展示
  email: "/assets/email.webp",                     // 邮件功能展示
  blog: "/assets/blog.webp",                       // 博客功能展示
  openApi: "/assets/openapi.webp",                 // API 文档展示
} as const;

// ==================== 技术栈 Logo ====================
// 第三方服务的 Logo，通常不需要替换
export const TechStackLogos = {
  // Node.js
  nodejsLight: "/logos/nodejs-light.webp",
  nodejsDark: "/logos/nodejs-dark.webp",

  // Tailwind CSS
  tailwindLight: "/logos/tailwind-light.webp",
  tailwindDark: "/logos/tailwind-dark.webp",

  // Stripe
  stripeLight: "/logos/stripe-light.webp",
  stripeDark: "/logos/stripe-dark.webp",
} as const;

// ==================== 示例/案例展示 ====================
// OpenSaaS 模板的示例，如果你有自己的案例可以替换
export const ExampleAssets = {
  example1: "/examples/kivo.webp",                 // 示例 1（可替换）
  example2: "/examples/messync.webp",              // 示例 2（可替换）
  example3: "/examples/microinfluencers.webp",     // 示例 3（可替换）
  example4: "/examples/promptpanda.webp",          // 示例 4（可替换）
  example5: "/examples/reviewradar.webp",          // 示例 5（可替换）
  example6: "/examples/scribeist.webp",            // 示例 6（可替换）
  example7: "/examples/searchcraft.webp",          // 示例 7（可替换）
} as const;

// ==================== AI 模板图片 ====================
// ⚠️ 注意：AI 模板图片不在此配置文件中管理
//
// 原因：
// 1. 这些图片是业务相关的动态内容，会频繁变化
// 2. 不同网站的 AI 模板需求不同
// 3. 应该由业务代码直接管理，而非集中配置
//
// 推荐做法：
// - 图片放在 public/templates/ 目录
// - 在业务代码中直接使用路径字符串
// - 或者在对应的业务模块中单独创建配置（如 aiTemplatesData.ts）
//
// 示例：
// const templateImage = "/templates/house_plan.png";
// <img src={templateImage} alt="Template" />
//
// 如果需要管理 AI 模板配置，请参考：
// app/src/landing-page/aiTemplatesData.ts

// ==================== 其他资源 ====================
export const MiscAssets = {
  // 通用头像（da-boi）
  daBoi: "/da-boi.webp",

  // 图标
  iconCopyAlt: "/icons/icon-copy-alt.svg",
} as const;

// ==================== 导出所有资源 ====================
export const Assets = {
  brand: BrandAssets,
  features: FeatureAssets,
  techStack: TechStackLogos,
  examples: ExampleAssets,
  misc: MiscAssets,
} as const;

// ==================== 使用指南 ====================
/**
 * 📖 如何使用这个配置文件：
 *
 * 1️⃣ 在组件中导入需要的资源：
 *
 * ```tsx
 * import { BrandAssets, FeatureAssets } from "@src/shared/assets";
 *
 * export function Header() {
 *   return (
 *     <img src={BrandAssets.logo} alt={BrandAssets.logoAlt} />
 *   );
 * }
 * ```
 *
 * 2️⃣ 或者导入整个 Assets 对象：
 *
 * ```tsx
 * import { Assets } from "@src/shared/assets";
 *
 * export function Hero() {
 *   return (
 *     <img src={Assets.brand.logo} alt={Assets.brand.logoAlt} />
 *   );
 * }
 * ```
 *
 * 3️⃣ 替换品牌图片的步骤：
 *
 *   a. 准备你的图片文件（推荐使用 .webp 格式，体积小）
 *   b. 将图片放到 `app/src/client/static/` 目录
 *   c. 在这个文件中修改对应的路径
 *   d. 所有引用这个资源的地方会自动更新
 *
 * 4️⃣ 图片命名建议：
 *
 *   - Logo: logo.webp, logo-dark.webp
 *   - Banner: banner.webp, banner-og.webp (用于 Open Graph)
 *   - Icon: icon-16.png, icon-32.png, favicon.ico
 *   - 功能截图: feature-ai.webp, feature-payment.webp
 *
 * 5️⃣ 图片优化建议：
 *
 *   - 使用 WebP 格式（比 PNG/JPG 小 25-35%）
 *   - Logo 建议使用 SVG（矢量图，无损缩放）
 *   - 压缩图片：https://squoosh.app
 *   - Open Graph 图片建议尺寸：1200x630px
 */
