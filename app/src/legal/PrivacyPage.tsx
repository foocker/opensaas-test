/**
 * Privacy Policy Page - 隐私政策
 *
 * 数据来源: legalContent.ts (privacyContent)
 * 展示组件: LegalPageTemplate
 */

import LegalPageTemplate from "./components/LegalPageTemplate";
import { privacyContent } from "./legalContent";

export default function PrivacyPage() {
  return <LegalPageTemplate data={privacyContent} />;
}
