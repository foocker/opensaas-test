// 模板类型定义
export interface Template {
  id: string
  title: string
  titleEn?: string // 英文标题（可选）
  description: string
  inImg: string | null // 输入图片路径，null 表示无输入图
  outImg: string // 输出图片路径
  model: 'flash' | 'pro' // 从输出文件名判断
  category: string // 分类
  requiresVip: boolean // 是否需要 VIP
}

export type TemplateCategory =
  | '3D渲染'
  | '角色设计'
  | '漫画创作'
  | '商品摄影'
  | '图像处理'
  | '室内设计'
  | '人像摄影'
  | '创意设计'
  | '教育图表'
  | '其他'