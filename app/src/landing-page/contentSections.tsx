import daBoiAvatar from "../client/static/da-boi.webp";
import kivo from "../client/static/examples/kivo.webp";
import messync from "../client/static/examples/messync.webp";
import microinfluencerClub from "../client/static/examples/microinfluencers.webp";
import promptpanda from "../client/static/examples/promptpanda.webp";
import reviewradar from "../client/static/examples/reviewradar.webp";
import scribeist from "../client/static/examples/scribeist.webp";
import searchcraft from "../client/static/examples/searchcraft.webp";
import { DocsUrl, FooterLinks } from "../shared/common";
import type { GridFeature } from "./components/FeaturesGrid";

export const features: GridFeature[] = [
  {
    name: "按需付费",
    description: "Token 按 3折 实时扣费，用多少付多少",
    emoji: "💰",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "极致低价",
    description: "比 Google AI 便宜 70% 以上",
    emoji: "💸",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "多模型支持",
    description: "支持 GPT、Claude、Gemini 等主流模型",
    emoji: "🤖",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "实时扣费",
    description: "每次 AI 调用前实时扣费，余额透明",
    emoji: "⚡",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "VIP 解锁",
    description: "买断模板和工作流功能，永久使用",
    emoji: "👑",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "余额预警",
    description: "余额不足自动提醒，不用担心欠费",
    emoji: "🔔",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "快速充值",
    description: "支持支付宝充值，即时到账",
    emoji: "⚡",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "安全可靠",
    description: "数据加密传输，保护隐私安全",
    emoji: "🔐",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "开发者友好",
    description: "简单 API 接口，快速集成到你的应用",
    emoji: "🚀",
    href: DocsUrl,
    size: "large",
  },
];

export const testimonials = [
  {
    name: "Da Boi",
    role: "Wasp Mascot",
    avatarSrc: daBoiAvatar,
    socialUrl: "https://twitter.com/wasplang",
    quote: "I don't even know how to code. I'm just a plushie.",
  },
  {
    name: "Mr. Foobar",
    role: "Founder @ Cool Startup",
    avatarSrc: daBoiAvatar,
    socialUrl: "",
    quote: "This product makes me cooler than I already am.",
  },
  {
    name: "Jamie",
    role: "Happy Customer",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "My cats love it!",
  },
];

export const faqs = [
  {
    id: 1,
    question: "如何开始使用？",
    answer: "注册账号后，充值钱包余额即可开始使用 AI 服务。Token 按 3折 实时扣费。",
    href: DocsUrl,
  },
  {
    id: 2,
    question: "VIP 和普通用户有什么区别？",
    answer: "VIP 用户可以解锁所有模板和工作流功能，但 Token 消耗仍需付费（同样是 3折）。普通用户只能使用基础功能。",
    href: DocsUrl,
  },
  {
    id: 3,
    question: "真的比 Google AI 便宜 70%？",
    answer: "是的！我们通过技术优化和规模效应，将成本降低到市场价格的 30%，为开发者提供最实惠的 AI 服务。",
    href: DocsUrl,
  },
  {
    id: 4,
    question: "支持哪些支付方式？",
    answer: "目前支持支付宝充值，充值后即时到账。后续会增加更多支付方式。",
    href: DocsUrl,
  },
];

export const footerNavigation = {
  app: [
    { name: "Documentation", href: FooterLinks.documentation },
    { name: "Blog", href: FooterLinks.blog },
  ],
  company: [
    { name: "About", href: FooterLinks.about },
    { name: "Privacy", href: FooterLinks.privacy },
    { name: "Terms of Service", href: FooterLinks.terms },
  ],
};

export const examples = [
  {
    name: "Example #1",
    description: "Describe your example here.",
    imageSrc: kivo,
    href: "#",
  },
  {
    name: "Example #2",
    description: "Describe your example here.",
    imageSrc: messync,
    href: "#",
  },
  {
    name: "Example #3",
    description: "Describe your example here.",
    imageSrc: microinfluencerClub,
    href: "#",
  },
  {
    name: "Example #4",
    description: "Describe your example here.",
    imageSrc: promptpanda,
    href: "#",
  },
  {
    name: "Example #5",
    description: "Describe your example here.",
    imageSrc: reviewradar,
    href: "#",
  },
  {
    name: "Example #6",
    description: "Describe your example here.",
    imageSrc: scribeist,
    href: "#",
  },
  {
    name: "Example #7",
    description: "Describe your example here.",
    imageSrc: searchcraft,
    href: "#",
  },
];
