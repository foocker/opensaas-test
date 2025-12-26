import daBoiAvatar from "../client/static/da-boi.webp";
import kivo from "../client/static/examples/kivo.webp";
import messync from "../client/static/examples/messync.webp";
import microinfluencerClub from "../client/static/examples/microinfluencers.webp";
import promptpanda from "../client/static/examples/promptpanda.webp";
import reviewradar from "../client/static/examples/reviewradar.webp";
import scribeist from "../client/static/examples/scribeist.webp";
import searchcraft from "../client/static/examples/searchcraft.webp";
import { DocsUrl, FooterLinks, SocialLinks } from "../shared/common";
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
  social: [
    {
      name: "X",
      href: SocialLinks.twitter,
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: SocialLinks.github,
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Discord",
      href: SocialLinks.discord,
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: SocialLinks.youtube,
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
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
