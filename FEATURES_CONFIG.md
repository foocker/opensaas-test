# 功能模块配置系统

本项目实现了基于配置的功能模块管理系统，遵循**解耦原则**：功能实现和功能开关完全分离。

## 🎯 设计原则

- ✅ **配置驱动** - 通过修改配置文件控制功能显示
- ✅ **完全解耦** - 功能代码和启用状态分离
- ✅ **易于扩展** - 添加新功能只需修改配置
- ✅ **权限控制** - 支持登录要求和管理员权限

---

## 📁 核心文件

### [app/src/shared/features.ts](app/src/shared/features.ts) - 功能配置中心

所有功能模块的配置都在这个文件中定义。

```typescript
export const FEATURES: Record<string, FeatureConfig> = {
  aiScheduler: {
    id: "aiScheduler",
    name: "AI Day Scheduler",
    description: "使用 AI 智能规划每日任务",
    route: routes.DemoAppRoute.to,
    icon: LayoutDashboard,
    enabled: true,  // 🔧 改为 false 可隐藏此功能
    requireAuth: true,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 1,
  },
  // ... 更多功能
};
```

### 配置项说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 功能唯一标识 |
| `name` | string | 功能名称（显示在菜单） |
| `description` | string | 功能描述 |
| `route` | string | 路由路径 |
| `icon` | Component | 图标组件（lucide-react） |
| `enabled` | boolean | **是否启用该功能** |
| `requireAuth` | boolean | 是否需要登录 |
| `adminOnly` | boolean | 是否仅管理员可见 |
| `showInMenu` | boolean | 是否显示在用户菜单 |
| `menuOrder` | number | 菜单排序（数字越小越靠前） |

---

## 🔧 如何控制功能显示

### 方法 1: 修改 enabled 字段（推荐）

**隐藏 AI Day Scheduler 功能：**

打开 [app/src/shared/features.ts](app/src/shared/features.ts)，找到对应功能，将 `enabled` 改为 `false`：

```typescript
aiScheduler: {
  id: "aiScheduler",
  name: "AI Day Scheduler",
  // ...
  enabled: false,  // ❌ 功能已禁用，不会显示在任何地方
}
```

**保存文件，刷新页面** → AI Day Scheduler 从用户菜单中消失

### 方法 2: 修改 showInMenu 字段

如果只想从菜单中隐藏，但保留路由访问：

```typescript
aiScheduler: {
  enabled: true,      // ✅ 功能启用
  showInMenu: false,  // 🚫 但不显示在菜单中
}
```

这样功能仍然可以通过直接访问 URL 使用，但菜单中不会显示。

---

## ➕ 如何添加新功能

### 步骤 1: 在 features.ts 中添加配置

```typescript
export const FEATURES: Record<string, FeatureConfig> = {
  // ... 现有功能

  // 新增功能：文本生成器
  textGenerator: {
    id: "textGenerator",
    name: "AI Text Generator",
    description: "使用 AI 生成文本内容",
    route: "/text-generator",
    icon: FileText,  // 从 lucide-react 导入
    enabled: true,   // 🔧 启用此功能
    requireAuth: true,
    adminOnly: false,
    showInMenu: true,
    menuOrder: 2,
  },
};
```

### 步骤 2: 实现功能页面

1. 在 `main.wasp` 中添加路由：
   ```wasp
   route TextGeneratorRoute { path: "/text-generator", to: TextGeneratorPage }
   page TextGeneratorPage {
     authRequired: true,
     component: import TextGenerator from "@src/text-generator/TextGeneratorPage"
   }
   ```

2. 创建页面组件：
   ```bash
   mkdir -p app/src/text-generator
   touch app/src/text-generator/TextGeneratorPage.tsx
   ```

3. 实现页面逻辑

### 步骤 3: （可选）权限控制

在页面组件中检查功能是否启用：

```typescript
import { canAccessFeature } from "../shared/features";

export default function TextGeneratorPage({ user }) {
  // 检查用户是否有权限访问
  if (!canAccessFeature("textGenerator", !!user, user?.isAdmin)) {
    return <div>此功能未启用</div>;
  }

  return <div>文本生成器页面</div>;
}
```

---

## 📋 当前已配置的功能

### 1. AI Day Scheduler ✅
- **状态**: 启用
- **位置**: 用户菜单第1项
- **权限**: 需要登录
- **路由**: `/demo-app`
- **功能**: 使用 AI 规划每日任务

**如何关闭**:
```typescript
aiScheduler: { enabled: false }
```

### 2. AI Image Generator ✅
- **状态**: 启用
- **位置**: Landing Page（不在菜单中）
- **权限**: 无需登录
- **路由**: `/`
- **功能**: 使用 AI 生成图像

**如何关闭**:
```typescript
aiImageGenerator: { enabled: false }
```

### 3. Documentation ⚠️
- **状态**: 未实现（已关闭）
- **说明**: 仅作为配置示例

### 4. Custom AI Tool ⚠️
- **状态**: 未实现（已关闭）
- **说明**: 仅作为配置示例

---

## 🔐 权限控制说明

### requireAuth - 需要登录

```typescript
{
  requireAuth: true,  // 未登录用户不显示此功能
}
```

- `true`: 只有登录用户才能看到和访问
- `false`: 所有用户都能看到和访问

### adminOnly - 仅管理员

```typescript
{
  adminOnly: true,  // 只有管理员能看到此功能
}
```

- `true`: 只有 `isAdmin = true` 的用户才能看到
- `false`: 所有满足 `requireAuth` 条件的用户都能看到

### 示例组合

**公开功能**（如 Landing Page）：
```typescript
{
  requireAuth: false,
  adminOnly: false,
}
```

**登录用户功能**（如 AI Scheduler）：
```typescript
{
  requireAuth: true,
  adminOnly: false,
}
```

**管理员功能**（如统计后台）：
```typescript
{
  requireAuth: true,
  adminOnly: true,
}
```

---

## 🛠️ API 使用方法

### 检查功能是否启用

```typescript
import { isFeatureEnabled } from "../shared/features";

if (isFeatureEnabled("aiScheduler")) {
  // 功能已启用
}
```

### 获取所有启用的功能

```typescript
import { getEnabledFeatures } from "../shared/features";

const features = getEnabledFeatures();
// 返回所有 enabled: true 的功能
```

### 获取用户菜单项

```typescript
import { getMenuFeatures } from "../shared/features";

const menuItems = getMenuFeatures(isAuthenticated, isAdmin);
// 返回用户可以看到的菜单项
```

### 检查访问权限

```typescript
import { canAccessFeature } from "../shared/features";

if (canAccessFeature("aiScheduler", true, false)) {
  // 用户有权限访问此功能
}
```

---

## 📝 常见场景

### 场景 1: 临时关闭某个功能

产品需求：下线 AI Day Scheduler 功能进行维护

**操作**:
```typescript
// app/src/shared/features.ts
aiScheduler: {
  enabled: false,  // 改这一行
}
```

**结果**:
- ✅ 菜单中移除此项
- ✅ 直接访问 URL 会被拦截（如果实现了权限检查）
- ✅ 无需删除任何代码

### 场景 2: 新功能灰度测试

产品需求：新功能先给管理员测试

**操作**:
```typescript
newFeature: {
  enabled: true,
  requireAuth: true,
  adminOnly: true,  // 只有管理员可见
}
```

测试完成后，改为所有用户可见：
```typescript
newFeature: {
  adminOnly: false,  // 改这一行
}
```

### 场景 3: 为不同用户显示不同菜单

**效果**:
- 未登录用户：只看到公开功能
- 普通用户：看到公开功能 + 登录功能
- 管理员：看到所有功能

**实现**: 已自动实现，无需额外代码

```typescript
// UserDropdown.tsx 已自动处理
const menuItems = getUserMenuItems(isAuthenticated, isAdmin);
```

---

## 🚀 最佳实践

### 1. 新功能开发流程

```
1. 在 features.ts 添加配置（enabled: false）
2. 实现功能代码
3. 测试完成后，改为 enabled: true
4. 部署到生产环境
```

### 2. 功能命名规范

- **id**: 小驼峰命名（如 `aiScheduler`）
- **name**: 用户友好的名称（如 "AI Day Scheduler"）
- **description**: 简短描述功能用途

### 3. 菜单排序策略

```typescript
menuOrder: 1,  // 最常用的功能
menuOrder: 5,  // 次要功能
menuOrder: 10, // 不常用的功能
```

数字越小，菜单位置越靠前。

### 4. 图标选择

推荐使用 [lucide-react](https://lucide.dev/) 图标库：

```typescript
import { LayoutDashboard, Image, FileText, Wand2 } from "lucide-react";
```

---

## 🧪 测试功能配置

### 测试步骤

1. **修改配置**
   ```typescript
   aiScheduler: { enabled: false }
   ```

2. **保存文件并刷新页面**

3. **验证结果**
   - 打开用户菜单
   - 确认 "AI Day Scheduler" 已消失

4. **恢复配置**
   ```typescript
   aiScheduler: { enabled: true }
   ```

---

## 📖 相关文件

| 文件 | 作用 |
|------|------|
| [app/src/shared/features.ts](app/src/shared/features.ts) | **功能配置中心**（核心文件） |
| [app/src/user/constants.ts](app/src/user/constants.ts) | 用户菜单生成器 |
| [app/src/user/UserDropdown.tsx](app/src/user/UserDropdown.tsx) | 用户下拉菜单组件 |
| [app/main.wasp](app/main.wasp) | 路由定义 |

---

## ✅ 总结

**配置驱动的功能管理系统已完成！**

- ✅ 修改一个配置项即可控制功能显示
- ✅ 添加新功能无需修改核心代码
- ✅ 支持权限控制和菜单排序
- ✅ 完全解耦，易于维护

**下次想添加新功能？**
1. 在 `features.ts` 添加配置
2. 实现功能页面
3. 完成！
