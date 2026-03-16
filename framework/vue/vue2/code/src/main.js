import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './style/index.scss'

Vue.config.productionTip = false

new Vue({
  // $root 访问根实例
  data: {
    foo: 1
  },
  router,
  render: h => h(App)
}).$mount('#app')
