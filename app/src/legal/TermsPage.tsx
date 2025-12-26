/**
 * Terms of Service Page - 服务条款
 *
 * 数据来源: legalContent.ts (termsContent)
 * 展示组件: LegalPageTemplate
 */

import LegalPageTemplate from "./components/LegalPageTemplate";
import { termsContent } from "./legalContent";

export default function TermsPage() {
  return <LegalPageTemplate data={termsContent} />;
}
