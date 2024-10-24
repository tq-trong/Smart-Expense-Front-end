import { createRouter, createWebHistory } from 'vue-router'

import BlankLayout from '../layouts/BlankLayout.vue'
import ClientLayout from '../layouts/ClientLayout.vue'

import LoginPage from '../components/auth/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue';
import FamilyMembers from '../views/FamilyMembers.vue'
import ExpensesPage from '../views/ExpensesManagement.vue'
import ExpenseCreate from '../views/ExpenseCreate.vue'
import ExpenseEdit from '../views/ExpenseEdit.vue'
import InvitationsPage from '../views/InvitationsPage.vue'
import InvitationCreate from '../views/InvitationCreate.vue'
import LogsPage from '../views/LogsPage.vue'

const routes = [

  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: 'Login page',
      layout: BlankLayout
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    props: route => ({
      user: route.query.user || '',
      startDate: route.query.startDate || null,
      endDate: route.query.endDate || ''
    }),
    meta: {
      layout: ClientLayout
    }
  },
  {
    path: '/family-members',
    name: 'family-members',
    component: FamilyMembers,
    props: route => ({
      page: parseInt(route.query.page) || 1,
      search: route.query.search || ''
    }),
    meta: {
      layout: ClientLayout
    }
  },
  {
    path: '/expenses',
    name: 'expenses',
    component: ExpensesPage,
    children: [
      {
        path: 'create',
        name: 'expenseCreate',
        component: ExpenseCreate,
      },
      {
        path: 'edit/:id',
        name: 'expenseEdit',
        component: ExpenseEdit,
        props: route => ({
          id: parseInt(route.params.id) || null
        }),
      },
    ],
    props: route => ({
      page: parseInt(route.query.page) || 1,
      user: route.query.user || 'all',
      startDate: route.query.startDate || null,
      endDate: route.query.endDate || null,
      category: route.query.category || 'all',
      search: route.query.search || ''
    }),
    meta: {
      layout: ClientLayout
    }
  },
  {
    path: '/invitations',
    name: 'invitations',
    component: InvitationsPage,
    props: route => ({
      page: parseInt(route.query.page) || 1,
      search: route.query.search || ''
    }),
    meta: {
      layout: ClientLayout
    },
    children: [
      {
        path: 'invite',
        name: 'invitationCreate',
        component: InvitationCreate,
      },
    ]
  },
  {
    path: '/logs',
    name: 'logs',
    component: LogsPage,
    props: route => ({
      page: parseInt(route.query.page) || 1,
      user: route.query.search || 'all',
      startDate: route.query.startDate || '',
      endDate: route.query.endDate || '',
      search: route.query.search || ''
    }),
    meta: {
      layout: ClientLayout
    }
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
})

router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token');
  if (to.path === '/home' && !token) {
    next('/login'); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
  } else {
    next(); // Cho phép truy cập trang
  }
});

router.afterEach((to) => {
  document.title = to.meta.title || 'Default Title';  // Đặt title mặc định nếu không có meta title
});


export default router