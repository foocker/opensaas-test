/**
 * AI 精选模板组件
 * 展示精选的 AI 图像生成模板
 */

import { useState } from "react";
import { templates, getAllCategories, getTemplatePrompt } from "../aiTemplatesData";
import type { Template } from "../template";
import { cn } from "../../client/utils";

export default function AITemplates() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 生成分类列表
  const categories = [
    { id: "all", name: "全部" },
    ...getAllCategories().map(cat => ({ id: cat, name: cat }))
  ];

  // 过滤模板
  const filteredTemplates =
    selectedCategory === "all"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  // 排序：有输入图的在前
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (a.inImg && !b.inImg) return -1;
    if (!a.inImg && b.inImg) return 1;
    return 0;
  });

  return (
    <div id="ai-templates" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      {/* 标题 */}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">
          精选模板
        </h2>
        <p className="text-muted-foreground mt-6 text-lg leading-8">
          专业设计师精心打造的 AI 图像生成模板，助您轻松实现创意构想
        </p>
      </div>

      {/* 分类筛选 */}
      <div className="mt-12 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "rounded-full px-6 py-2 text-sm font-medium transition-all duration-200",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const [showModal, setShowModal] = useState(false);

  // 点击"试一试"跳转到 Banana 游乐场并填充 prompt
  const handleTryIt = () => {
    // 获取该模板的 prompt
    const prompt = getTemplatePrompt(template.id);

    // 滚动到 Banana 游乐场
    const playgroundElement = document.getElementById("banana-playground");
    if (playgroundElement) {
      playgroundElement.scrollIntoView({ behavior: "smooth" });

      // 等待滚动完成后填充 prompt
      setTimeout(() => {
        const textarea = playgroundElement.querySelector("textarea");
        if (textarea) {
          // 使用 React 的方式触发 change 事件
          const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
          )?.set;
          if (nativeTextAreaValueSetter) {
            nativeTextAreaValueSetter.call(textarea, prompt);
            const event = new Event("input", { bubbles: true });
            textarea.dispatchEvent(event);
          }
          textarea.focus();
        }
      }, 800);
    }
  };

  return (
    <>
      <div className="bg-card border-border group relative overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        {/* 模型标签 */}
        <div className="absolute left-4 top-4 z-10">
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-bold uppercase shadow-lg",
              template.model === "pro"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
            )}
          >
            {template.model}
          </span>
        </div>

        {/* 图片区域 - 有输入图显示两张，无输入图显示一张 */}
        {template.inImg ? (
          // 有输入图：显示输入和输出图，hover 切换
          <div
            className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted"
            onClick={() => setShowModal(true)}
          >
            {/* 输入图 */}
            <div className="absolute inset-0">
              <img
                src={template.inImg}
                alt={`${template.title} 输入`}
                className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
            </div>

            {/* 输出图 */}
            <div className="absolute inset-0">
              <img
                src={template.outImg}
                alt={template.title}
                className="h-full w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            {/* 悬停提示 */}
            <div className="bg-black/50 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="text-center text-white">
                <div className="mb-2 text-sm font-medium">查看输出效果</div>
                <div className="text-xs opacity-80">点击放大</div>
              </div>
            </div>
          </div>
        ) : (
          // 无输入图：只显示输出图
          <div
            className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted"
            onClick={() => setShowModal(true)}
          >
            <img
              src={template.outImg}
              alt={template.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* 信息区域 */}
        <div className="p-6">
          <h3 className="text-foreground mb-2 text-lg font-semibold">
            {template.title}
          </h3>
          {template.description && (
            <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
              {template.description}
            </p>
          )}

          {/* 操作按钮 */}
          <button
            onClick={handleTryIt}
            className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-2.5 font-medium transition-all duration-200"
          >
            试一试
          </button>
        </div>
      </div>

      {/* 预览模态框 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background relative max-h-[90vh] max-w-6xl overflow-auto rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowModal(false)}
              className="text-muted-foreground hover:text-foreground absolute right-4 top-4 text-2xl"
            >
              ×
            </button>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* 输入图 */}
              {template.inImg && (
                <div>
                  <h4 className="text-foreground mb-4 text-center text-lg font-semibold">
                    输入
                  </h4>
                  <img
                    src={template.inImg}
                    alt={`${template.title} 输入`}
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {/* 输出图 */}
              <div className={template.inImg ? "" : "lg:col-span-2"}>
                <h4 className="text-foreground mb-4 text-center text-lg font-semibold">
                  输出
                </h4>
                <img
                  src={template.outImg}
                  alt={template.title}
                  className="w-full rounded-lg"
                />
              </div>
            </div>

            {/* 模板信息 */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-foreground mb-2 text-xl font-bold">
                {template.title}
              </h3>
              {template.titleEn && (
                <p className="text-muted-foreground mb-4 text-sm">
                  {template.titleEn}
                </p>
              )}
              {template.description && (
                <p className="text-muted-foreground mb-4">
                  {template.description}
                </p>
              )}

              {/* 操作按钮 */}
              <button
                onClick={handleTryIt}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 font-medium transition-all duration-200"
              >
                使用此模板
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
