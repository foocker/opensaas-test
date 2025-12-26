import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import { BrandAssets } from "../../shared/assets";

export default function Hero() {
  return (
    <div className="relative w-full pt-14">
      <TopGradient />
      <BottomGradient />
      <div className="md:p-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="lg:mb-18 mx-auto max-w-3xl text-center">
            <h1 className="text-foreground text-5xl font-bold sm:text-6xl">
              比 Google AI <span className="italic">便宜</span>{" "}
              <span className="text-gradient-primary">70%</span> 的 AI 服务平台
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
              按需付费，Token 3折扣费。支持 GPT、Claude、Gemini 等主流模型，为开发者提供最实惠的 AI 解决方案。
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" variant="outline" asChild>
                <WaspRouterLink to={routes.PricingPageRoute.to}>
                  查看定价
                </WaspRouterLink>
              </Button>
              <Button size="lg" variant="default" asChild>
                <WaspRouterLink to={routes.SignupRoute.to}>
                  立即开始 <span aria-hidden="true">→</span>
                </WaspRouterLink>
              </Button>
            </div>
          </div>
          <div className="mt-14 flow-root sm:mt-14">
            <div className="m-2 hidden justify-center rounded-xl md:flex lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src={BrandAssets.bannerLight}
                alt={BrandAssets.logoAlt}
                width={1000}
                height={530}
                loading="lazy"
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:hidden"
              />
              <img
                src={BrandAssets.bannerDark}
                alt={BrandAssets.logoAlt}
                width={1000}
                height={530}
                loading="lazy"
                className="hidden rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopGradient() {
  return (
    <div
      className="absolute right-0 top-0 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:top-0"
      aria-hidden="true"
    >
      <div
        className="aspect-[1020/880] w-[70rem] flex-none bg-gradient-to-tr from-amber-400 to-purple-300 opacity-10 sm:right-1/4 sm:translate-x-1/2 dark:hidden"
        style={{
          clipPath:
            "polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)",
        }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-65rem)]"
      aria-hidden="true"
    >
      <div
        className="relative aspect-[1020/880] w-[90rem] bg-gradient-to-br from-amber-400 to-purple-300 opacity-10 sm:-left-3/4 sm:translate-x-1/4 dark:hidden"
        style={{
          clipPath: "ellipse(80% 30% at 80% 50%)",
        }}
      />
    </div>
  );
}
