import { isDate, isObject } from './utils'

function encode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }

  // 用于保存Params中的Key和Value，以这样的形式保存key=value
  let parts: Array<string> = []

  Object.keys(params).forEach(key => {
    const value = params[key]
    // If the value getting from the params by key is null of typeof undefined, must ignore it
    if (value === null || typeof value === 'undefined') {
      // do nothing and drump into the next loop
      // 知识点，forEach中return，并不是跳出循环，而是进入下一次循环
      return
    }

    let values = []
    if (Array.isArray(value)) {
      values = value
      key += '[]'
    } else {
      values = [value]
    }

    values.forEach(_value => {
      if (isDate(_value)) {
        _value = _value.toISOString()
      } else if (isObject(_value)) {
        _value = JSON.stringify(_value)
      }
      parts.push(`${encode(key)}=${encode(_value)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    // Ignore the hash in the url
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    // If the origin url having params already, must append a character "&" end of the url, otherwise append a character "?"
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
