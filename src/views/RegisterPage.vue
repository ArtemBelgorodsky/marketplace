<template>
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-purple-900 mb-6">Регистрация</h2>

    <form @submit.prevent="register">
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Имя</label>
        <input
          v-model="registerForm.name"
          type="text"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Email</label>
        <input
          v-model="registerForm.email"
          type="email"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 font-medium mb-2">Пароль</label>
        <input
          v-model="registerForm.password"
          type="password"
          class="w-full border border-purple-300 rounded-md p-3"
          required
          minlength="6"
        />
        <p class="text-xs text-gray-500 mt-1">Минимум 6 символов</p>
      </div>
      <button
        type="submit"
        class="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg mb-4"
        :disabled="loading"
      >
        <span v-if="loading">Регистрация...</span>
        <span v-else>Зарегистрироваться</span>
      </button>
      <div class="text-center text-gray-600">
        Уже есть аккаунт?
        <router-link
          :to="{ name: 'login' }"
          class="text-purple-700 font-medium"
        >
          Войти
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useToastStore } from '../stores/toastStore';

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const loading = ref(false);
const registerForm = ref({
  name: '',
  email: '',
  password: '',
});

const register = async () => {
  try {
    loading.value = true;

    const userData = {
      name: registerForm.value.name,
      email: registerForm.value.email,
      password: registerForm.value.password,
      isAdmin: false,
    };

    await userStore.register(userData);

    toastStore.showToast(
      'success',
      'Успешная регистрация',
      'Вы успешно зарегистрировались'
    );

    // Перенаправление на главную
    router.push({ name: 'home' });
  } catch (error) {
    toastStore.showToast(
      'error',
      'Ошибка регистрации',
      'Пользователь с таким email уже существует'
    );
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
