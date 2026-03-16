const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: "Index Page",
    },
    other: {
      entry: "src/print.js",
      template: "public/print.html",
      filename: "print.html",
      title: "webview print test"
    }
  },
})
