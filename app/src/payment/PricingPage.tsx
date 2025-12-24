import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "wasp/client/auth";
import { Alert, AlertDescription } from "../client/components/ui/alert";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "../client/components/ui/card";
import { cn } from "../client/utils";

// 充值套餐选项
const rechargeOptions = [
  { amount: 9.9, label: "¥9.9", description: "入门充值", popular: false },
  { amount: 50, label: "¥50", description: "推荐充值", popular: true },
  { amount: 100, label: "¥100", description: "超值充值", popular: false },
  { amount: 200, label: "¥200", description: "大额充值", popular: false },
];

const PricingPage = () => {
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: user } = useAuth();
  const navigate = useNavigate();

  async function handleRechargeClick(amount: number) {
    if (!user) {
      navigate("/login");
      return;
    }

    // TODO: 实现充值逻辑
    // 这里将来会调用支付宝充值接口
    console.log(`Recharge amount: ${amount}`);
    setErrorMessage("充值功能即将上线！");
  }

  return (
    <div className="py-10 lg:mt-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div id="pricing" className="mx-auto max-w-4xl text-center">
          <h2 className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-primary">按需付费</span>，用多少付多少
          </h2>
        </div>
        <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-center text-lg leading-8">
          充值后即可使用 AI 服务，Token 按 <span className="text-primary font-bold">3折</span> 实时扣费
          <br />
          余额不足时会自动提醒，随时充值，无需担心
        </p>

        {errorMessage && (
          <Alert variant="destructive" className="mt-8 max-w-2xl mx-auto">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* 充值套餐卡片 */}
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-8">
          {rechargeOptions.map((option) => (
            <Card
              key={option.amount}
              className={cn(
                "relative flex grow flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg",
                {
                  "ring-primary !bg-transparent ring-2": option.popular,
                  "ring-border ring-1 lg:my-8": !option.popular,
                },
              )}
            >
              {option.popular && (
                <div
                  className="absolute right-0 top-0 -z-10 h-full w-full transform-gpu blur-3xl"
                  aria-hidden="true"
                >
                  <div
                    className="from-primary/40 via-primary/20 to-primary/10 absolute h-full w-full bg-gradient-to-br opacity-30"
                    style={{
                      clipPath: "circle(670% at 50% 50%)",
                    }}
                  />
                </div>
              )}

              <CardContent className="h-full justify-between p-8 xl:p-10">
                <div className="flex items-center justify-between gap-x-4">
                  <CardTitle className="text-foreground text-lg font-semibold leading-8">
                    {option.description}
                  </CardTitle>
                  {option.popular && (
                    <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-semibold">
                      推荐
                    </span>
                  )}
                </div>

                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-foreground text-4xl font-bold tracking-tight">
                    {option.label}
                  </span>
                </p>

                <ul
                  role="list"
                  className="text-muted-foreground mt-8 space-y-3 text-sm leading-6"
                >
                  <li className="flex gap-x-3">
                    <CheckCircle
                      className="text-primary h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                    一次性充值 {option.amount} 元
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle
                      className="text-primary h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                    Token 3折实时扣费
                  </li>
                  <li className="flex gap-x-3">
                    <CheckCircle
                      className="text-primary h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                    无使用期限
                  </li>
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleRechargeClick(option.amount)}
                  variant={option.popular ? "default" : "outline"}
                  className="w-full"
                  disabled={isPaymentLoading}
                >
                  {!!user ? "立即充值" : "登录后充值"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 计费说明 */}
        <div className="mx-auto mt-16 max-w-2xl">
          <h3 className="text-foreground text-2xl font-bold text-center mb-6">
            计费说明
          </h3>
          <div className="bg-muted rounded-lg p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary h-5 w-5 flex-none mt-0.5" />
              <div>
                <p className="text-foreground font-semibold">按需付费</p>
                <p className="text-muted-foreground text-sm">
                  每次 AI 调用前实时扣费，Token 按市场价的 30% 计费
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary h-5 w-5 flex-none mt-0.5" />
              <div>
                <p className="text-foreground font-semibold">余额透明</p>
                <p className="text-muted-foreground text-sm">
                  在用户中心随时查看钱包余额和消费记录
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-primary h-5 w-5 flex-none mt-0.5" />
              <div>
                <p className="text-foreground font-semibold">余额预警</p>
                <p className="text-muted-foreground text-sm">
                  余额低于 10 元时自动提醒，避免服务中断
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
