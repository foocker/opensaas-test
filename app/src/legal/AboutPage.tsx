/**
 * About Page - 关于我们
 *
 * 数据来源: legalContent.ts (aboutContent)
 * 展示组件: LegalPageTemplate
 */

import LegalPageTemplate from "./components/LegalPageTemplate";
import { aboutContent } from "./legalContent";

export default function AboutPage() {
  return <LegalPageTemplate data={aboutContent} />;
}
