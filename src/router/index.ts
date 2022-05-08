import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import beforeEachHandle from './beforeEachHandle';
import AdminLayout from '@/layouts/AdminLayout';
import modules from './modules/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: AdminLayout,
    redirect: {
      name: 'dashboard',
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          code: 'page_dashboard',
        },
        component: () => import(/* webpackChunkName: "dashboard", webpackPrefetch:true */ '@/views/dashboard'),
      },
      ...modules,
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/login'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/404'),
  },
  {
    // Match all paths vue2 Use * vue3 Use /:pathMatch(.*)* or /:pathMatch(.*) or /:catchAll(.*)
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
   * 注册所有的路由拦截器
   * */
beforeEachHandle.forEach((callbackFn) => {
  router.beforeEach(callbackFn);
});

export default router;
