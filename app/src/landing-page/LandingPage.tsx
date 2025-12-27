import { FeatureFlags } from "../shared/config";
import AITemplates from "./components/AITemplates";
import BananaPlayground from "./components/BananaPlayground";
import Clients from "./components/Clients";
import ExamplesCarousel from "./components/ExamplesCarousel";
import FAQ from "./components/FAQ";
import FeaturesGrid from "./components/FeaturesGrid";
import FloatingParticles from "./components/FloatingParticles";
import Footer from "./components/Footer";
import GradientOrbs from "./components/GradientOrbs";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import {
  examples,
  faqs,
  features,
  footerNavigation,
  testimonials,
} from "./contentSections";
import AIReady from "./ExampleHighlightedFeature";

export default function LandingPage() {
  const landingPageConfig = FeatureFlags.landingPage;

  return (
    <div className="bg-background text-foreground relative">
      {/* 背景动画效果 - 使用 fixed 定位确保覆盖整个视口 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {landingPageConfig.showFloatingParticles && <FloatingParticles />}
        {landingPageConfig.showGradientOrbs && <GradientOrbs position="top-right" />}
      </div>

      <main className="relative z-10">
        {landingPageConfig.showHero && <Hero />}
        {landingPageConfig.showAITemplates && <AITemplates />}
        {landingPageConfig.showBananaPlayground && <BananaPlayground />}
        {landingPageConfig.showExamples && <ExamplesCarousel examples={examples} />}
        {landingPageConfig.showClients && <Clients />}
        {landingPageConfig.showHighlightedFeature && <AIReady />}
        {/* showFeatures 使用传统列表式功能展示，需要不同的数据格式，当前未启用 */}
        {landingPageConfig.showFeaturesGrid && <FeaturesGrid features={features} />}
        {landingPageConfig.showTestimonials && <Testimonials testimonials={testimonials} />}
        {landingPageConfig.showFAQ && <FAQ faqs={faqs} />}
      </main>
      {landingPageConfig.showFooter && <Footer footerNavigation={footerNavigation} />}
    </div>
  );
}
