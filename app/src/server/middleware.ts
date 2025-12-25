import express from 'express'
import type { MiddlewareConfigFn } from 'wasp/server/middleware'

/**
 * 自定义中间件配置
 * 增加 body parser 的大小限制，以支持图片上传等大数据传输
 */
export const customMiddlewareConfigFn: MiddlewareConfigFn = (middlewareConfig) => {
  // 移除默认的 express.json 中间件（默认限制 100kb）
  middlewareConfig.delete('express.json')

  // 添加自定义的 express.json 中间件，限制提升到 50mb
  middlewareConfig.set('express.json', express.json({ limit: '50mb' }))

  // 同时也增加 urlencoded 的限制
  middlewareConfig.delete('express.urlencoded')
  middlewareConfig.set('express.urlencoded', express.urlencoded({ limit: '50mb', extended: true }))

  return middlewareConfig
}
