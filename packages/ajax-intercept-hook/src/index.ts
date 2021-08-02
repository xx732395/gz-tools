// import { urlAddQuery, uuid } from './utils'
type BaseType = string | number | boolean

interface CustomAttrType {
  url: string
  method: string
  [prop: string]: BaseType
}

interface XMLHttpRequestPlus extends XMLHttpRequest {
  customAttr: CustomAttrType
}

interface RewriterOpenOptions {
  url?: string
  method?: string
}

interface RewriterSendOptions {
  body: Document | BodyInit | null | undefined
}

interface OpenHttpHook {
  (mothod: string, url: string, xhr: XMLHttpRequestPlus): RewriterOpenOptions | void // 可以修改 url和 method
}

interface SendHttpHook {
  (
    mothod: string,
    url: string,
    body: Document | BodyInit | null | undefined,
    xhr: XMLHttpRequestPlus
  ): RewriterSendOptions | void
}

interface onreadyStateChangeHttpHook {
  (mothod: string, url: string, xhr: XMLHttpRequestPlus): void
}

interface onreadyStateChange4Status200HttpHook {
  (mothod: string, url: string, xhr: XMLHttpRequestPlus): void
}

function noop() {
  // noop
}

export class XMLHTTPRequestIntercept {
  private openHook: OpenHttpHook
  private sendHook: SendHttpHook
  private onreadyStateChangeHook: onreadyStateChangeHttpHook
  private onreadyStateChange4Status200Hook: onreadyStateChange4Status200HttpHook

  constructor({
    openHook = noop,
    sendHook = noop,
    onreadyStateChangeHook = noop,
    onreadyStateChange4Status200Hook = noop
  } = {}) {
    this.openHook = openHook
    this.sendHook = sendHook
    this.onreadyStateChangeHook = onreadyStateChangeHook
    this.onreadyStateChange4Status200Hook = onreadyStateChange4Status200Hook
    this.init()
  }

  init() {
    if (!window.XMLHttpRequest) {
      return
    }
    const classthis = this
    const nativeAjaxSend = XMLHttpRequest.prototype.send // 首先将原生的方法保存。
    const nativeAjaxOpen = XMLHttpRequest.prototype.open
    // 劫持open方法，是为了拿到请求的url
    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequestPlus,
      method: string,
      url: string,
      async: boolean = true,
      username?: string | null | undefined,
      password?: string | null | undefined
    ) {
      const xhrInstance = this
      const openResult = classthis.openHook(method, url, xhrInstance)
      const reUrl = openResult?.url || url
      const reMethod = openResult?.method || method
      xhrInstance.customAttr = {
        method: reMethod,
        url: reUrl
      }
      return nativeAjaxOpen.call(xhrInstance, reMethod, reUrl, async, username, password)
    }

    XMLHttpRequest.prototype.send = function (
      this: XMLHttpRequestPlus,
      body?: Document | BodyInit | null | undefined
    ) {
      const xhrInstance = this
      // xhrInstance.addEventListener('abort', e => {
      //   // 主动取消ajax的情况需要标注，否则可能会产生误报
      //   if (e.type === 'abort') {
      //     xhrInstance.customAttr.isAbort = true
      //   }
      // })

      const oldCb = xhrInstance.onreadystatechange
      xhrInstance.addEventListener('readystatechange', (event: Event) => {
        if (xhrInstance.readyState === 4) {
          const { method, url } = xhrInstance.customAttr
          classthis.onreadyStateChangeHook(method, url, xhrInstance)
          if (xhrInstance.status < 300 && xhrInstance.status > 199) {
            classthis.onreadyStateChange4Status200Hook(method, url, xhrInstance)
          }
        }
        if (oldCb) {
          oldCb.call(xhrInstance, event)
        }
      })
      const sendResult = classthis.sendHook(
        xhrInstance.customAttr.method,
        xhrInstance.customAttr.url,
        body,
        xhrInstance
      )
      const reBoyd = sendResult?.body || body
      return nativeAjaxSend.call(xhrInstance, reBoyd)
    }
  }
}
