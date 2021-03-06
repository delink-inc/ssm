import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

import './styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control

// custom filters
// import age from './filters'

Vue.use(ElementUI, { locale })
Vue.use(VueMaterial)
// Vue.use(age)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
