import { AxiosRequestConfig } from 'types'
import { encode, isDate, isPlainObject } from '../utils'

/**
 * @description: 根据配置生成可识别的url
 * @param {AxiosRequestConfig} config
 */
export function transformUrl(config: AxiosRequestConfig) {
  const { url, params } = config

  return buildUrl(url, params)
}

/**
 * @description: 拼接url
 * @param {AxiosRequestConfig} url
 * @param {AxiosRequestConfig} params
 */
function buildUrl(url: AxiosRequestConfig['url'], params?: AxiosRequestConfig['params']) {
  if (!params) {
    return url
  }

  const parts: string[] = []

  Object.keys(params).forEach((key) => {
    const value = params[key]

    if (value === null || typeof value === 'undefined') {
      return
    }

    // 统一成数组处理
    let values: any[]
    if (Array.isArray(value)) {
      values = value
      key += '[]'
    } else {
      values = [value]
    }

    // 根据value类型处理为键值对
    values.forEach((value) => {
      if (isDate(value)) {
        value = value.toISOString()
      } else if (isPlainObject(value)) {
        value = JSON.stringify(value)
      }

      parts.push(`${encode(key)}=${encode(value)}`)
    })
  })

  // 合并参数为一个字符串
  let serializedParams = parts.join('&')

  // 去除哈希值并拼接入url
  if (serializedParams) {
    const noHashParams = serializedParams.split('#')[0]

    url += (url.indexOf('?') === -1 ? '?' : '&') + noHashParams
  }

  return url
}
