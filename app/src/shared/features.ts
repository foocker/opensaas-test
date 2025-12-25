/**
 * 功能模块配置系统
 *
 * 通过配置的方式控制功能模块的显示和启用状态。
 * 遵循解耦原则：功能实现和功能开关分离。
 *
 * 使用方法：
 * 1. 在这里定义功能配置
 * 2. 在 UI 组件中通过 isFeatureEnabled() 检查功能是否启用
 * 3. 新增功能只需添加新的配置项，无需修改其他代码
 */

import { routes } from "wasp/client/router";
import { LayoutDashboard, Image, FileText, Wand2, Upload } from "lucide-react";
import { FeatureFlags } from "./config";

export interface FeatureConfig {
  /** 功能唯一标识 */
  id: string;
  /** 功能名称（显示在菜单中） */
  name: string;
  /** 功能描述 */
  description: string;
  /** 路由路径（如果有） */
  route?: any; // 使用 any 避免 Wasp 路由类型冲突
  /** 图标组件 */
  icon?: any;
  /** 是否启用该功能 */
  enabled: boolean;
  /** 是否需要登录 */
  requireAuth: boolean;
  /** 是否仅管理员可见 */
  adminOnly: boolean;
  /** 是否显示在用户菜单中 */
  showInMenu: boolean;
  /** 菜单排序优先级（数字越小越靠前） */
  menuOrder: number;
}

/**
 * 功能模块配置列表
 *
 * 在这里添加新功能，通过 enabled 控制是否启用
 */
export const FEATURES: Record<string, FeatureConfig> = {
  // AI Day Scheduler - 任务规划功能
  aiScheduler: {
    id: "aiScheduler",
    name: "AI Day Scheduler",
    description: "使用 AI 智能规划每日任务",
    route: routes.DemoAppRoute.to,
    icon: LayoutDashboard,
    enabled: FeatureFlags.ai.scheduler,  // 🔧 在 config.ts 中控制
    requireAuth: true,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 1,
  },

  // AI Image Generator - 图像生成功能（Landing Page）
  aiImageGenerator: {
    id: "aiImageGenerator",
    name: "AI Image Generator",
    description: "使用 AI 生成图像",
    route: "/", // Landing page
    icon: Image,
    enabled: FeatureFlags.ai.imageGenerator,  // 🔧 在 config.ts 中控制
    requireAuth: false,
    adminOnly: false,
    showInMenu: false, // 不显示在菜单（在 Landing Page）
    menuOrder: 2,
  },

  // File Upload - 文件上传功能
  fileUpload: {
    id: "fileUpload",
    name: "File Upload",
    description: "上传和管理文件",
    route: routes.FileUploadRoute.to,
    icon: Upload,
    enabled: FeatureFlags.fileUpload,  // 🔧 在 config.ts 中控制
    requireAuth: true,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 3,
  },

  // 示例：文档功能（未实现，仅作配置示例）
  documentation: {
    id: "documentation",
    name: "Documentation",
    description: "查看产品文档",
    route: "/docs",
    icon: FileText,
    enabled: false,  // ⚠️ 未实现，关闭
    requireAuth: false,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 10,
  },

  // 示例：自定义 AI 工具（未实现，仅作配置示例）
  customAiTool: {
    id: "customAiTool",
    name: "Custom AI Tool",
    description: "自定义 AI 工具",
    route: "/custom-tool",
    icon: Wand2,
    enabled: false,  // ⚠️ 未实现，关闭
    requireAuth: true,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 3,
  },
};

/**
 * 检查功能是否启用
 */
export function isFeatureEnabled(featureId: string): boolean {
  const feature = FEATURES[featureId];
  return feature ? feature.enabled : false;
}

/**
 * 获取所有启用的功能
 */
export function getEnabledFeatures(): FeatureConfig[] {
  return Object.values(FEATURES).filter((feature) => feature.enabled);
}

/**
 * 获取用户菜单中显示的功能列表
 *
 * @param isAuthenticated - 用户是否已登录
 * @param isAdmin - 用户是否为管理员
 */
export function getMenuFeatures(
  isAuthenticated: boolean,
  isAdmin: boolean = false
): FeatureConfig[] {
  return Object.values(FEATURES)
    .filter((feature) => {
      // 必须启用
      if (!feature.enabled) return false;

      // 必须在菜单中显示
      if (!feature.showInMenu) return false;

      // 如果需要登录但用户未登录，不显示
      if (feature.requireAuth && !isAuthenticated) return false;

      // 如果仅管理员可见但用户不是管理员，不显示
      if (feature.adminOnly && !isAdmin) return false;

      return true;
    })
    .sort((a, b) => a.menuOrder - b.menuOrder);
}

/**
 * 获取单个功能配置
 */
export function getFeature(featureId: string): FeatureConfig | undefined {
  return FEATURES[featureId];
}

/**
 * 检查用户是否有权限访问某功能
 */
export function canAccessFeature(
  featureId: string,
  isAuthenticated: boolean,
  isAdmin: boolean = false
): boolean {
  const feature = FEATURES[featureId];
  if (!feature || !feature.enabled) return false;

  if (feature.requireAuth && !isAuthenticated) return false;
  if (feature.adminOnly && !isAdmin) return false;

  return true;
}
