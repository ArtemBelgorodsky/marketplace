<template>
  <div class="min-h-screen bg-purple-50">
    <!-- Header -->
    <header class="bg-purple-800 text-white shadow-md">
      <div
        class="container mx-auto px-4 py-4 flex justify-between items-center"
      >
        <div class="flex items-center">
          <router-link to="/" class="text-xl md:text-2xl font-bold"
            >ReviewMarket</router-link
          >
        </div>
        <div class="flex items-center space-x-4">
          <template v-if="!currentUser">
            <router-link to="/login" class="text-white hover:text-purple-200">
              Войти
            </router-link>
            <router-link
              to="/register"
              class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-md"
            >
              Регистрация
            </router-link>
          </template>
          <div v-else class="flex items-center space-x-2">
            <router-link
              to="/add-product"
              class="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded-md text-sm"
            >
              Добавить товар
            </router-link>
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-1"
              >
                <span>{{ currentUser.name }}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <router-link
                  v-if="currentUser.isAdmin"
                  to="/admin"
                  @click="showUserMenu = false"
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                >
                  Панель администратора
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>

    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 flex items-center z-50"
      :class="{
        'border-l-4 border-green-500': toast.type === 'success',
        'border-l-4 border-red-500': toast.type === 'error',
      }"
    >
      <div v-if="toast.type === 'success'" class="text-green-500 mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <div v-if="toast.type === 'error'" class="text-red-500 mr-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div>
        <div class="font-medium">{{ toast.title }}</div>
        <div class="text-sm text-gray-600">{{ toast.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from './stores/userStore';
import { useToastStore } from './stores/toastStore';

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const showUserMenu = ref(false);

// Получаем текущего пользователя из хранилища
const currentUser = computed(() => userStore.currentUser);

// Получаем состояние toast из хранилища
const toast = computed(() => toastStore.toast);

// Выход из системы
const logout = () => {
  userStore.logout();
  showUserMenu.value = false;
  router.push('/');
  toastStore.showToast(
    'success',
    'Выход из системы',
    'Вы успешно вышли из системы'
  );
};

// Проверка авторизации при загрузке
onMounted(() => {
  userStore.checkAuth();
});
</script>

<style></style>
