## gz-tool

### XMLHTTPRequest 拦截功能

使用原型改写的方式进行拦截，对项目代码无侵入即可达到目的
目前笔者主要用来对项目中的接口耗时和接口错误进行统计！

### 使用方法

可以直接 script 标签引入 也可以使用 npm 安装使用

### demo

引入 script 资源

```javascript
<script src="../lib/index.js"></script>
```

```javascript
new GzTool.XMLHTTPRequestIntercept({
  openHook: (mothod, url, xhr) => {
    // 可以改写request url method
    console.log('openHook', mothod, url, xhr)
    return {
      url: 'https://my-json-server.typicode.com/typicode/demo/posts',
      method: 'POST'
    }
  },
  sendHook: (mothod, url, body, xhr) => {
    // 可以改写request body
    console.log('sendHook', mothod, url, xhr)
  },
  onreadyStateChangeHook: (mothod, url, xhr) => {
    console.log(mothod, url, xhr)
  },
  onreadyStateChange4Status200Hook: (mothod, url, xhr) => {
    console.log('onreadyStateChange4Status200Hook', mothod, url, xhr)
  }
})
```
