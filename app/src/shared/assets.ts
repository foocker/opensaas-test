/**
 * 资源配置文件 - 集中管理公共图片 imports
 *
 * 🎯 为什么需要这个文件？
 * 1. 集中管理 - 品牌相关的图片 import 在一个地方
 * 2. 易于替换 - 修改品牌图片只需改这里
 * 3. 类型安全 - TypeScript 自动补全和检查
 * 4. Vite 优化 - 使用 import 让 Vite 处理资源（hash、压缩等）
 *
 * 📝 管理原则：
 * ✅ 管理：品牌 Logo、Banner、Favicon 等公共资源
 * ❌ 不管理：业务相关的动态内容（AI 模板、用户上传等）
 *
 * 📝 使用方法：
 * import { BrandAssets } from "../../shared/assets";
 * <img src={BrandAssets.logo} alt={BrandAssets.logoAlt} />
 *
 * ⚠️ 重要：Wasp 使用 Vite，必须使用 import 方式导入图片
 */

// ==================== 品牌资源 ====================
import logo from "../client/static/logo.webp";
import openSaasBannerLight from "../client/static/open-saas-banner-light.svg";
import openSaasBannerDark from "../client/static/open-saas-banner-dark.svg";
import avatarPlaceholder from "../client/static/avatar-placeholder.webp";

// ==================== 示例/案例资源 ====================
import daBoiAvatar from "../client/static/da-boi.webp";
import kivo from "../client/static/examples/kivo.webp";
import messync from "../client/static/examples/messync.webp";
import microinfluencerClub from "../client/static/examples/microinfluencers.webp";
import promptpanda from "../client/static/examples/promptpanda.webp";
import reviewradar from "../client/static/examples/reviewradar.webp";
import scribeist from "../client/static/examples/scribeist.webp";
import searchcraft from "../client/static/examples/searchcraft.webp";

// ==================== 功能展示资源 ====================
import aiReady from "../client/static/assets/aiready.webp";
import aiReadyDark from "../client/static/assets/aiready-dark.webp";

/**
 * 品牌相关的图片资源
 *
 * ⚠️ 使用此模板时，请替换以下所有图片为你自己的品牌图片：
 * 1. 将你的图片放到 app/src/client/static/ 目录
 * 2. 修改上面的 import 语句指向你的图片
 * 3. 修改 BrandAssets.logoAlt 为你的品牌名称
 */
export const BrandAssets = {
  // 🏢 Logo
  logo: logo,                          // 主 Logo（⚠️ 需要替换）
  logoAlt: "Nano Banana Magic",        // Logo alt 文字（⚠️ 需要修改为你的品牌名）

  // 📱 Banner（用于 Hero 区域展示）
  bannerLight: openSaasBannerLight,    // 浅色主题 Banner（⚠️ 需要替换）
  bannerDark: openSaasBannerDark,      // 深色主题 Banner（⚠️ 需要替换）

  // 👤 头像占位符
  avatarPlaceholder: avatarPlaceholder, // 用户头像默认图
} as const;

// ==================== 功能展示资源 ====================
/**
 * 功能展示图片资源
 *
 * 当前使用的功能展示：
 * - aiReady/aiReadyDark: 在 ExampleHighlightedFeature.tsx 中使用
 * - 显示条件: config.ts 中 FeatureFlags.landingPage.showHighlightedFeature = true
 *
 * 📝 如何添加新的功能展示图片：
 * 1. 将截图放到 app/src/client/static/assets/ 目录
 *    例如：my-feature.webp、my-feature-dark.webp
 *
 * 2. 在这里添加 import：
 *    import myFeature from "../client/static/assets/my-feature.webp";
 *    import myFeatureDark from "../client/static/assets/my-feature-dark.webp";
 *
 * 3. 添加到 FeatureAssets：
 *    export const FeatureAssets = {
 *      aiReady: aiReady,
 *      aiReadyDark: aiReadyDark,
 *      myFeature: myFeature,           // 新增
 *      myFeatureDark: myFeatureDark,   // 新增
 *    } as const;
 *
 * 4. 创建展示组件（参考 ExampleHighlightedFeature.tsx）
 * 5. 在 LandingPage.tsx 中使用你的组件
 */
export const FeatureAssets = {
  aiReady: aiReady,                 // AI 功能展示（浅色主题）
  aiReadyDark: aiReadyDark,        // AI 功能展示（深色主题）
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
  example1: kivo,                 // 示例 1（可替换）
  example2: messync,              // 示例 2（可替换）
  example3: microinfluencerClub,  // 示例 3（可替换）
  example4: promptpanda,          // 示例 4（可替换）
  example5: reviewradar,          // 示例 5（可替换）
  example6: scribeist,            // 示例 6（可替换）
  example7: searchcraft,          // 示例 7（可替换）
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
  daBoi: daBoiAvatar,

  // 图标
  iconCopyAlt: "/icons/icon-copy-alt.svg",
} as const;

// ==================== 导出所有资源 ====================
/**
 * 统一导出对象（可选）
 *
 * 你可以选择使用：
 * - 分类导入：import { BrandAssets } from "../../shared/assets";
 * - 统一导入：import { Assets } from "../../shared/assets"; 然后使用 Assets.brand.logo
 */
export const Assets = {
  brand: BrandAssets,
  features: FeatureAssets,
  techStack: TechStackLogos,
  examples: ExampleAssets,
  misc: MiscAssets,
} as const;

// ==================== 使用指南 ====================
/**
 * 📖 如何替换品牌图片：
 *
 * 1. 将你的图片放到 `app/src/client/static/` 目录
 * 2. 修改上面的 import 语句指向你的图片
 *    例如：import logo from "../client/static/your-logo.webp";
 * 3. 修改 BrandAssets.logoAlt 为你的品牌名
 * 4. 所有使用 BrandAssets 的组件会自动更新
 *
 * 💡 提示：
 * - 推荐使用 WebP 格式（体积小，质量好）
 * - Logo 建议使用 SVG（矢量图，无损缩放）
 * - 图片压缩工具：https://squoosh.app
 */
