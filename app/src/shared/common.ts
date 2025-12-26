import { ExternalLinks } from "./config";

// 从 config.ts 导出链接，保持向后兼容
export const DocsUrl = ExternalLinks.documentation;
export const BlogUrl = ExternalLinks.blog;

// Footer 链接
export const FooterLinks = {
  documentation: ExternalLinks.footer.documentationFooter,
  blog: ExternalLinks.footer.blogFooter,
  about: ExternalLinks.footer.about,
  privacy: ExternalLinks.footer.privacy,
  terms: ExternalLinks.footer.terms,
};

// 社交媒体链接
export const SocialLinks = {
  twitter: ExternalLinks.social.twitter,
  github: ExternalLinks.social.github,
  discord: ExternalLinks.social.discord,
  youtube: ExternalLinks.social.youtube,
};
