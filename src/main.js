// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/vuetify'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
 
Vue.use(Vuetify)
Vue.use(require('vue-moment'))

// 言語の設定
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'ja', // デフォルト言語はjaにしておくが、ブラウザの言語を拾ってきてここに入れる => 言語変更されたら書き換える
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n: i18n,
  router,
  components: { App },
  template: '<App/>'
})
