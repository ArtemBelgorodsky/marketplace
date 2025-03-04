import { createRouter, createWebHistory } from 'vue-router';

// Импорт компонентов страниц
import HomePage from '../views/HomePage.vue';
import ProductDetailPage from '../views/ProductDetailPage.vue';
import AddProductPage from '../views/AddProductPage.vue';
import AdminPanelPage from '../views/AdminPanelPage.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';

// Определение маршрутов
const routes = [
  { path: '/', component: HomePage, name: 'home' },
  {
    path: '/product/:id',
    component: ProductDetailPage,
    props: true,
    name: 'product-detail',
  },
  {
    path: '/add-product',
    component: AddProductPage,
    name: 'add-product',
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: AdminPanelPage,
    name: 'admin',
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  { path: '/login', component: LoginPage, name: 'login' },
  { path: '/register', component: RegisterPage, name: 'register' },
];

// Создание роутера
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Защита маршрутов будет добавлена в main.js после инициализации Pinia

export default router;
