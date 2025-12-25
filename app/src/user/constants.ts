import { Settings, Shield } from "lucide-react";
import { routes } from "wasp/client/router";
import { getMenuFeatures } from "../shared/features";

/**
 * 获取用户菜单项（包含动态功能配置）
 *
 * @param isAuthenticated - 用户是否已登录
 * @param isAdmin - 用户是否为管理员
 * @returns 用户菜单项列表
 */
export function getUserMenuItems(isAuthenticated: boolean, isAdmin: boolean = false) {
  // 1. 从功能配置系统获取启用的功能
  const enabledFeatures = getMenuFeatures(isAuthenticated, isAdmin);

  // 2. 转换为菜单项格式
  const featureMenuItems = enabledFeatures
    .filter((feature) => feature.route) // 只包含有路由的功能
    .map((feature) => ({
      name: feature.name,
      to: feature.route!,
      icon: feature.icon,
      isAuthRequired: feature.requireAuth,
      isAdminOnly: feature.adminOnly,
    }));

  // 3. 添加固定的系统菜单项（Account Settings, Admin Dashboard）
  const systemMenuItems = [
    {
      name: "Account Settings",
      to: routes.AccountRoute.to,
      icon: Settings,
      isAuthRequired: false,
      isAdminOnly: false,
    },
    {
      name: "Admin Dashboard",
      to: routes.AdminRoute.to,
      icon: Shield,
      isAuthRequired: false,
      isAdminOnly: true,
    },
  ];

  // 4. 合并功能菜单和系统菜单
  return [...featureMenuItems, ...systemMenuItems];
}

// 保持向后兼容，默认导出未登录状态的菜单
export const userMenuItems = getUserMenuItems(false, false);
