# vue3-javascript-demo

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
--------------------------

---------------------------
# vite-vue3-javascript-demo创建流程   
### 1、npm create
```
npm create vite@latest project-name
```
### 2、Select a framework
选择预设模板Vue
### 3、Select a variant
选择JavaScript
### 4、run
```
npm install
npm run dev
```
### 5、router
```
npm install vue-router@4 -S
```
### 6、routes
在src文件夹下，创建router文件夹，并在router文件下创建index.js路由文件；再新建routes文件夹，分文件路由。

### 7、Sass
安装Sass，新建公共样式style文件夹，把公共样式文件引入main.js

### 8、axios
安装axios，新建utils文件夹，新建request.js文件；新建api文件夹，引入request.js，写请求即可；
