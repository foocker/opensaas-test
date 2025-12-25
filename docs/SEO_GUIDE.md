# 🔍 SEO 优化指南

本文档介绍 Nano Banana Magic 的 SEO 配置和优化建议。

---

## ✅ 已实现的 SEO 功能

### 1. **Meta 标签优化**

所有 Meta 标签都配置在 [`app/main.wasp`](app/main.wasp#L12-L55) 中：

#### 基础 SEO 标签
```html
<meta name="description" content="..." />
<meta name="author" content="Nano Banana Magic" />
<meta name="keywords" content="AI API, 人工智能服务, Gemini API..." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://nbartai.com" />
```

#### Open Graph (社交分享)
用于 Facebook、LinkedIn 等平台的分享卡片：
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="https://nbartai.com/public-banner.webp" />
<meta property="og:locale" content="zh_CN" />
```

#### Twitter Card
用于 Twitter/X 平台的分享卡片：
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://nbartai.com/public-banner.webp" />
```

### 2. **结构化数据 (Schema.org)**

使用 JSON-LD 格式的结构化数据，帮助搜索引擎理解网站内容：

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nano Banana Magic",
  "url": "https://nbartai.com",
  "logo": "https://nbartai.com/logo.webp",
  "description": "比Google AI便宜70%的AI服务平台",
  "sameAs": [
    "https://github.com/yourusername",
    "https://twitter.com/yourusername"
  ]
}
```

#### WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nano Banana Magic",
  "url": "https://nbartai.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://nbartai.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

#### Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nano Banana Magic AI 服务",
  "description": "提供 Gemini、Claude 等多种 AI 模型 API 服务",
  "brand": {
    "@type": "Brand",
    "name": "Nano Banana Magic"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "CNY",
    "lowPrice": "9.99",
    "highPrice": "199.99",
    "offerCount": "4"
  }
}
```

### 3. **robots.txt**

文件位置: [`app/src/client/static/robots.txt`](app/src/client/static/robots.txt)

```
User-agent: *
Allow: /

# 禁止抓取的路径
Disallow: /admin
Disallow: /account
Disallow: /password-reset
Disallow: /email-verification

# Sitemap 位置
Sitemap: https://nbartai.com/sitemap.xml
```

### 4. **sitemap.xml**

文件位置: [`app/src/client/static/sitemap.xml`](app/src/client/static/sitemap.xml)

包含所有公开页面的 URL：
- 首页 (priority: 1.0, changefreq: daily)
- 定价页面 (priority: 0.9, changefreq: weekly)
- 登录/注册页面 (priority: 0.6-0.7, changefreq: monthly)

---

## 🧪 SEO 测试和验证

### 1. **验证 Meta 标签**

使用以下工具测试 Meta 标签是否正确：

#### Google Rich Results Test
- 访问: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
- 输入网址: `https://nbartai.com`
- 点击 "测试 URL"
- 检查结构化数据是否被正确识别

#### Facebook Sharing Debugger
- 访问: [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
- 输入网址: `https://nbartai.com`
- 点击 "调试"
- 检查 Open Graph 标签是否正确显示

#### Twitter Card Validator
- 访问: [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- 输入网址: `https://nbartai.com`
- 检查 Twitter Card 是否正确显示

#### OpenGraph.xyz
- 访问: [https://www.opengraph.xyz/](https://www.opengraph.xyz/)
- 输入网址: `https://nbartai.com`
- 查看社交分享预览效果

### 2. **验证结构化数据**

#### Google Schema Markup Validator
- 访问: [https://validator.schema.org/](https://validator.schema.org/)
- 输入网址: `https://nbartai.com`
- 检查 JSON-LD 是否符合 Schema.org 规范

#### 手动检查（浏览器）
```bash
# 1. 访问网站
# 2. 打开浏览器开发者工具 (F12)
# 3. 切换到 "Elements" 标签
# 4. 搜索 "ld+json"
# 5. 查看结构化数据是否正确嵌入
```

### 3. **验证 robots.txt 和 sitemap.xml**

#### Robots.txt Tester (Google Search Console)
```
1. 打开 Google Search Console
2. 左侧菜单 → "设置" → "robots.txt 测试工具"
3. 输入 URL: https://nbartai.com/robots.txt
4. 测试不同路径是否被正确允许/禁止
```

#### Sitemap 验证
```bash
# 方法 1: 直接访问
# 浏览器访问: https://nbartai.com/sitemap.xml

# 方法 2: Google Search Console
# 1. 打开 Google Search Console
# 2. 左侧菜单 → "站点地图"
# 3. 输入: sitemap.xml
# 4. 点击 "提交"
```

---

## 📊 Google Search Console 配置

### 1. **验证网站所有权**

#### 方法 1: HTML 文件验证（推荐）
```html
<!-- 下载 Google 提供的 HTML 文件 -->
<!-- 上传到 app/src/client/static/ 目录 -->
<!-- 文件名类似: googleXXXXXXXX.html -->
```

#### 方法 2: Meta 标签验证
```html
<!-- 在 app/main.wasp 的 head 中添加: -->
<meta name="google-site-verification" content="你的验证码" />
```

#### 方法 3: DNS 验证
```
在你的域名 DNS 设置中添加 TXT 记录
```

### 2. **提交站点地图**

```
1. 打开 Google Search Console
2. 左侧菜单 → "站点地图"
3. 输入: https://nbartai.com/sitemap.xml
4. 点击 "提交"
```

### 3. **请求索引**

```
1. 左侧菜单 → "网址检查"
2. 输入要索引的网址
3. 点击 "请求编入索引"
```

---

## 🎨 优化建议

### 1. **图片优化**

#### 创建社交分享图片
**建议尺寸:**
- Open Graph: 1200 x 630 px
- Twitter Card: 1200 x 675 px (16:9) 或 1200 x 1200 px (1:1)

**当前图片:**
- 位置: `app/src/client/static/public-banner.webp`
- 建议创建符合上述尺寸的高质量图片

#### 添加图片 Alt 文本
```html
<!-- 在 Landing Page 中确保所有图片都有 alt 属性 -->
<img src="..." alt="Nano Banana Magic AI 图像生成示例" />
```

### 2. **页面性能优化**

#### Core Web Vitals
使用 PageSpeed Insights 测试:
- 访问: [https://pagespeed.web.dev/](https://pagespeed.web.dev/)
- 输入网址: `https://nbartai.com`
- 查看性能评分和改进建议

#### 优化建议
- ✅ 图片使用 WebP 格式（已实现）
- ✅ 启用 gzip/brotli 压缩
- ✅ 使用 CDN 加速静态资源
- ⚠️ 实现懒加载（Lazy Loading）
- ⚠️ 优化 JavaScript 包大小

### 3. **内容优化**

#### 关键词策略
当前主要关键词：
- AI API
- Gemini API
- Claude API
- OpenAI 替代
- AI 图像生成
- 便宜 AI
- 按量付费

建议长尾关键词：
- "比 Google AI 便宜的 API"
- "Gemini API 国内访问"
- "AI 图像生成工具"
- "按需付费 AI 服务"

#### 标题优化（H1, H2, H3）
```typescript
// 在 Landing Page 中确保使用语义化标题
<h1>Nano Banana Magic - 比 Google AI 便宜 70% 的 AI 服务平台</h1>
<h2>支持 Gemini、Claude 等多种模型</h2>
<h3>按需付费，灵活使用</h3>
```

### 4. **移动端优化**

#### 响应式设计检查
```
Google Mobile-Friendly Test
访问: https://search.google.com/test/mobile-friendly
输入网址: https://nbartai.com
```

#### Viewport 配置
```html
<!-- 已在 main.wasp 中添加 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

## 🔗 内部链接优化

### 1. **面包屑导航**

建议添加面包屑导航（Breadcrumbs）：
```typescript
// 在页面顶部添加面包屑
<nav aria-label="breadcrumb">
  <ol>
    <li><a href="/">首页</a></li>
    <li><a href="/pricing">定价</a></li>
    <li aria-current="page">当前页面</li>
  </ol>
</nav>
```

对应的结构化数据：
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "首页",
      "item": "https://nbartai.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "定价",
      "item": "https://nbartai.com/pricing"
    }
  ]
}
```

### 2. **内部链接建议**

确保重要页面有相互链接：
- 首页 ↔ 定价页面
- 首页 ↔ 登录/注册
- 定价页面 ↔ 登录/注册

---

## 📈 监控和分析

### 1. **Google Search Console 指标**

定期查看：
- 展示次数（Impressions）
- 点击次数（Clicks）
- 平均点击率（CTR）
- 平均排名（Average Position）

### 2. **Google Analytics 指标**

结合 Google Analytics 查看：
- 有机流量（Organic Traffic）
- 跳出率（Bounce Rate）
- 平均会话时长（Avg. Session Duration）
- 转化率（Conversion Rate）

---

## 🛠️ 待优化项目

### 高优先级 ⭐⭐⭐⭐⭐

- [ ] 创建符合 OG 规范的社交分享图片（1200x630px）
- [ ] 在 Organization Schema 中补充真实的社交媒体链接
- [ ] 添加 Google Search Console 验证标签
- [ ] 提交 sitemap 到 Google Search Console

### 中优先级 ⭐⭐⭐⭐

- [ ] 实现面包屑导航和对应的结构化数据
- [ ] 添加 FAQ 结构化数据（如果有 FAQ 区块）
- [ ] 优化图片 alt 文本
- [ ] 实现图片懒加载

### 低优先级 ⭐⭐⭐

- [ ] 添加 Article Schema（如果有博客）
- [ ] 实现站内搜索功能（SearchAction 已配置）
- [ ] 添加多语言支持（hreflang 标签）
- [ ] 配置 Bing Webmaster Tools

---

## 📚 参考资源

### 官方文档
- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### 测试工具
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Schema Markup Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### SEO 学习资源
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs SEO Learning Hub](https://ahrefs.com/seo)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)

---

## ✅ SEO 检查清单

完成以下步骤以确保 SEO 优化到位：

- [x] 配置基础 Meta 标签（title, description, keywords）
- [x] 添加 Open Graph 标签
- [x] 添加 Twitter Card 标签
- [x] 添加结构化数据（Organization, WebSite, Product）
- [x] 创建 robots.txt
- [x] 创建 sitemap.xml
- [x] 添加 canonical 标签
- [x] 添加 viewport meta 标签
- [ ] 创建高质量社交分享图片
- [ ] 验证 Google Search Console 所有权
- [ ] 提交 sitemap 到 Google Search Console
- [ ] 使用 Rich Results Test 验证结构化数据
- [ ] 使用 Facebook Debugger 测试分享效果
- [ ] 使用 PageSpeed Insights 测试性能
- [ ] 优化 Core Web Vitals

---

**🎯 完成这些 SEO 优化后，你的网站将在搜索引擎中获得更好的排名和可见度！**
