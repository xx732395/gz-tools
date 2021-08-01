interface queryType {
  [prop: string]: string | number | null | undefined
  [prop: number]: string | number | null | undefined
}

interface GlobalCustomAttrs extends Window {
  msCrypto: any
}
declare const window: GlobalCustomAttrs

// 给url添加参数
export function urlAddQuery(url: string, query: queryType) {
  let queryStr: Array<string> = []
  Object.keys(query).forEach(key => {
    const value = query[key]
    // if (value !== null && value !== undefined) {
    queryStr.push(`${key}${[undefined, null].includes(value as any) ? value : ''}`)
    // }
  })
  return `${url.indexOf('?') !== -1 ? '&' : '?'}${queryStr.join('&')}`
}

let buf: any
let bufIdx = 0
const hexBytes = new Array(256)

// Pre-calculate toString(16) for speed
for (let i = 0; i < 256; i++) {
  hexBytes[i] = (i + 0x100).toString(16).substr(1)
}

const randomBytes = (() => {
  // Node & Browser support
  const lib =
    typeof crypto !== 'undefined'
      ? crypto
      : typeof window !== 'undefined'
      ? window.msCrypto // IE11
      : void 0

  if (lib !== void 0) {
    if (lib.randomBytes !== void 0) {
      return lib.randomBytes
    }
    if (lib.getRandomValues !== void 0) {
      return n => {
        var bytes = new Uint8Array(n)
        lib.getRandomValues(bytes)
        return bytes
      }
    }
  }

  return n => {
    const r: Array<number> = []
    for (let i = n; i > 0; i--) {
      r.push(Math.floor(Math.random() * 256))
    }
    return r
  }
})()

export function uuid(): string {
  // Buffer some random bytes for speed
  if (buf === void 0 || bufIdx + 16 > 4096) {
    bufIdx = 0
    buf = randomBytes(4096)
  }

  const b = Array.prototype.slice.call(buf, bufIdx, (bufIdx += 16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80

  return (
    hexBytes[b[0]] +
    hexBytes[b[1]] +
    hexBytes[b[2]] +
    hexBytes[b[3]] +
    '-' +
    hexBytes[b[4]] +
    hexBytes[b[5]] +
    '-' +
    hexBytes[b[6]] +
    hexBytes[b[7]] +
    '-' +
    hexBytes[b[8]] +
    hexBytes[b[9]] +
    '-' +
    hexBytes[b[10]] +
    hexBytes[b[11]] +
    hexBytes[b[12]] +
    hexBytes[b[13]] +
    hexBytes[b[14]] +
    hexBytes[b[15]]
  )
}
