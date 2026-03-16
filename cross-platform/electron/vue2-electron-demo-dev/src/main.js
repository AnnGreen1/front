import Vue from 'vue'
import App from './App.vue'
import router from './router'

// electron
const electron = window.require('electron')
Vue.prototype.$electron = electron

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
