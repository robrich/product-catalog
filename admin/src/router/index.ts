import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Logout from '../views/Logout.vue';
import store from '../store';
import { UserRole } from '../types/user';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      unauthenticated: true
    }
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
    meta: {
      unauthenticated: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/products',
    name: 'ProductList',
    component: () => import(/* webpackChunkName: "products" */ '../views/ProductList.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import(/* webpackChunkName: "product" */ '../views/ProductDetail.vue')
  },
  {
    path: '/users',
    name: 'UserList',
    component: () => import(/* webpackChunkName: "users" */ '../views/UserList.vue'),
    meta: {
      role: UserRole.UserEditor
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.meta?.unauthenticated) {
    return next();
  }

  const isAuthenticated = store.getters.isAuthenticated;
  if (!isAuthenticated) {
    console.log(`401: not authorized to ${to.fullPath}`);
    return next('/');
  }

  if (to.meta?.role) {
    const inRole = !!store.state.roles.find(r => r === to.meta.role);
    if (!inRole) {
      console.log(`401: not authorized enough to ${to.fullPath}`);
      return next('/');
    }
  }

  next();
});

export default router;
