import Vue from 'vue'

// 引入Elementui资源文件
import ElementUI from 'element-ui';  //组件代码js
import 'element-ui/lib/theme-chalk/index.css';  //样式代码css

// 引入axios
import axios from 'axios';

// 直接把axios挂载在Vue的原型上
Vue.prototype.axios = axios;

// base.css
import '@/common/css/base.css';

// 引入顶级组件App
import App from './App.vue';
// 引入路由
import router from './router';

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 定义一个登录状态
  let isLogin = false;

  // 允许携带cookie
  axios.defaults.withCredentials=true;
  // 发送请求 去检查用户是否登录（是否有cookie）
  axios.get('http://192.168.20.97:3000/users/checkIsLogin')
    .then(response => {
      isLogin = response.data.isLogin;
      // 如果已经登录 直接放行
      // if (!isLogin) {
      //   if (to.path !== '/login') {
      //     return next({'path': '/login'})
      //   } else {
      //     next()
      //   }
      // } else {
      //   next();
      // }
    })

  // 放行
  next();
}) 

// 注册ElementUI
Vue.use(ElementUI);

// 阻止生产提示
Vue.config.productionTip = false

// 创建Vue实例 挂在dom
new Vue({
  router, // 路由也要挂在
  render: h => h(App)  
}).$mount('#app') // 挂载DOM
