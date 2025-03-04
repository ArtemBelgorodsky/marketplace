<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-purple-900 mb-6">Вход в аккаунт</h2>

    <form @submit.prevent="login">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Email</label>
        <input
          v-model="loginForm.email"
          type="email"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2">Пароль</label>
        <input
          v-model="loginForm.password"
          type="password"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg mb-4"
        :disabled="loading"
      >
        <span v-if="loading">Вход...</span>
        <span v-else>Войти</span>
      </button>
      <div class="text-center text-gray-600">
        Нет аккаунта?
        <router-link
          :to="{ name: 'register' }"
          class="text-purple-700 font-medium"
        >
          Зарегистрироваться
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useToastStore } from '../stores/toastStore';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const toastStore = useToastStore();

const loading = ref(false);
const loginForm = ref({
  email: '',
  password: '',
});

const login = async () => {
  try {
    loading.value = true;
    await userStore.login(loginForm.value.email, loginForm.value.password);

    toastStore.showToast(
      'success',
      'Успешный вход',
      'Вы успешно вошли в систему'
    );

    // Перенаправление на страницу, с которой пользователь пришел, или на главную
    const redirectPath = route.query.redirect || '/';
    router.push(redirectPath);
  } catch (error) {
    toastStore.showToast('error', 'Ошибка входа', 'Неверный email или пароль');
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
