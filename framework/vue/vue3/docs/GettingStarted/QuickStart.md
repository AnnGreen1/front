# 快速上手
### 线上尝试 Vue
想要快速体验 Vue，你可以直接试试我们的演练场。

如果你更喜欢不用任何构建的原始 HTML，可以使用 JSFiddle 入门。

如果你已经比较熟悉 Node.js 和构建工具等概念，还可以直接在浏览器中打开 StackBlitz 来尝试完整的构建设置。

### 创建一个 Vue 应用
##### 前提条件

- 熟悉命令行
- 已安装 16.0 或更高版本的 [Node.js](https://nodejs.org/)

在本节中，我们将介绍如何在本地搭建 Vue 单页应用。创建的项目将使用基于 Vite 的构建设置，并允许我们使用 Vue 的单文件组件 (SFC)。

确保你安装了最新版本的 Node.js，然后在命令行中运行以下命令 (不要带上 > 符号)：
```
> npm init vue@latest
```
这一指令将会安装并执行 create-vue，它是 Vue 官方的项目脚手架工具。你将会看到一些诸如 TypeScript 和测试支持之类的可选功能提示：
```
✔ Project name: … <your-project-name>
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit testing? … No / Yes
✔ Add Cypress for both Unit and End-to-End testing? … No / Yes
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes

Scaffolding project in ./<your-project-name>...
Done.
```
如果不确定是否要开启某个功能，你可以直接按下回车键选择 `No`。在项目被创建后，通过以下步骤安装依赖并启动开发服务器：
```
> cd <your-project-name>
> npm install
> npm run dev
```
你现在应该已经运行起来了你的第一个 Vue 项目！请注意，生成的项目中的示例组件使用的是组合式 API 和 `<script setup>`，而非选项式 API。下面是一些补充提示：

- 推荐的 IDE 配置是 Visual Studio Code + Volar 扩展。如果使用其他编辑器，参考 IDE 支持章节。
- 更多工具细节，包括与后端框架的整合，我们会在工具链指南进行讨论。
- 要了解构建工具 Vite 更多背后的细节，请查看 Vite 文档。
- 如果你选择使用 TypeScript，请阅读 TypeScript 使用指南。
当你准备将应用发布到生产环境时，请运行：
```
npm run build
```
此命令会在 ./dist 文件夹中为你的应用创建一个生产环境的构建版本。关于将应用上线生产环境的更多内容，请阅读生产环境部署指南。


### 通过 CDN 使用 Vue
你可以借助 script 标签直接通过 CDN 来使用 Vue：

```javascript
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```
这里我们使用了 unpkg，但你也可以使用任何提供 npm 包服务的 CDN，例如 jsdelivr 或 cdnjs。当然，你也可以下载此文件并自行提供服务。

通过 CDN 使用 Vue 时，不涉及“构建步骤”。这使得设置更加简单，并且可以用于增强静态的 HTML 或与后端框架集成。但是，你将无法使用单文件组件 (SFC) 语法。

### 使用全局构建版本
上面的例子使用了全局构建版本的 Vue，该版本的所有顶层 API 都以属性的形式暴露在了全局的 Vue 对象上。这里有一个使用全局构建版本的例子：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue
  
  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```
JSFiddle 中的示例

### 使用 ES 模块构建版本
在本文档的其余部分我们使用的主要是 ES 模块语法。现代浏览器大多都已原生支持 ES 模块。因此我们可以像这样通过 CDN 以及原生 ES 模块使用 Vue：

```
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
  
  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```
注意我们使用了 `<script type="module">`，且导入的 CDN URL 指向的是 Vue 的 ES 模块构建版本。

JSFiddle 中的示例

#### 启用 Import maps
在上面的示例中，我们使用了完整的 CDN URL 来导入，但在文档的其余部分中，你将看到如下代码：

```js
import { createApp } from 'vue'
```
我们可以使用导入映射表 (Import Maps) 来告诉浏览器如何定位到导入的 vue：

```html
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: 'Hello Vue!'
      }
    }
  }).mount('#app')
</script>
```

你也可以在映射表中添加其他的依赖——但请务必确保你使用的是该库的 ES 模块版本。

##### 导入映射表的浏览器支持情况

目前只有基于 Chromium 的浏览器支持导入映射表，所以我们推荐你在学习过程中使用 Chrome 或 Edge。

如果你使用的是 Firefox 浏览器，则该功能仅在 102+ 版本中受支持，且目前需要启用 about:config 中的 dom.importMaps.enabled 选项。

如果你更喜欢那些还不支持导入映射表的浏览器，你可以使用 es-module-shims 来进行 polyfill。

##### 生产环境中的注意事项

到目前为止示例中使用的都是 Vue 的开发构建版本——如果你打算在生产中通过 CDN 使用 Vue，请务必查看生产环境部署指南。

#### 拆分模块
随着对这份指南的逐步深入，我们可能需要将代码分割成单独的 JavaScript 文件，以便更容易管理。例如：

```html
<!-- index.html -->
<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```
```js
// my-component.js
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>count is {{ count }}</div>`
}
```
如果直接在浏览器中打开了上面的 index.html，你会发现它抛出了一个错误，因为 ES 模块不能通过 file:// 协议工作。为了使其工作，你需要使用本地 HTTP 服务器通过 http:// 协议提供 index.html。

要启动一个本地的 HTTP 服务器，请先安装 Node.js，然后从命令行在 HTML 文件所在文件夹下运行 npx serve。你也可以使用其他任何可以基于正确的 MIME 类型服务静态文件的 HTTP 服务器。

可能你也注意到了，这里导入的组件模板是内联的 JavaScript 字符串。如果你正在使用 VSCode，你可以安装 es6-string-html 扩展，然后在字符串前加上一个前缀注释 /\*html\*/ 以高亮语法。

#### 无需构建的组合式 API 用法
组合式 API 的许多示例将使用 `<script setup>` 语法。如果你想在无需构建的情况下使用组合式 API，请参阅 `setup()` 选项。