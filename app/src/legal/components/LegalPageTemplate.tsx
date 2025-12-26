/**
 * Legal Page Template Component
 *
 * 通用的法律页面模板，用于 About/Privacy/Terms 等页面
 * 采用解耦设计：接收数据作为 props，只负责展示
 */

interface Section {
  heading: string;
  content: string;
}

interface LegalPageData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate?: string;
  sections: Section[];
}

interface LegalPageTemplateProps {
  data: LegalPageData;
}

export default function LegalPageTemplate({ data }: LegalPageTemplateProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {data.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{data.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">最后更新:</span> {data.lastUpdated}
            </div>
            {data.effectiveDate && (
              <div>
                <span className="font-medium">生效日期:</span> {data.effectiveDate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="prose prose-slate max-w-none dark:prose-invert">
          {data.sections.map((section, index) => (
            <section key={index} className="mb-12">
              <h2 className="mb-4 text-2xl font-semibold text-foreground">
                {section.heading}
              </h2>
              <div className="whitespace-pre-line text-muted-foreground">
                {section.content.trim()}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-4xl px-6 py-12 text-center">
          <h3 className="text-lg font-semibold text-foreground">
            有疑问吗？
          </h3>
          <p className="mt-2 text-muted-foreground">
            如果您对本页面内容有任何疑问，请随时联系我们。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@nbartai.com"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              联系我们
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              返回首页
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
