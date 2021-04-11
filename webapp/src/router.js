import Vue from 'vue'
import Router from 'vue-router'


import Home from './views/Home';
import SocialRecovery from './views/SocialRecovery';
import LoginAccount from './views/LoginAccount';
import Test from './views/Test';


Vue.use(Router);



let routers = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      needLogin: true
    }
  },
  {
    path: '/login_account',
    name: 'login_account',
    component: LoginAccount,
  },
  {
    path: '/social_recovery',
    name: 'social_recovery',
    component: SocialRecovery,
    meta: {
      needLogin: true
    }
  },
  
  {
    path: '/test',
    name: 'test',
    component: Test,
    meta: {
      needLogin: true
    }
  }
  
];

export default new Router({
  routes: routers
})