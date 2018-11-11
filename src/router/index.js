import Vue from 'vue'
import Router from 'vue-router'
import KnitImageBuilder from '@/pages/KnitImageBuilder'
import About from '@/pages/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'KnitImageBuilder',
      component: KnitImageBuilder
    },
    // {
    //   path: '/about',
    //   name: 'About',
    //   component: About
    // }
  ]
})
