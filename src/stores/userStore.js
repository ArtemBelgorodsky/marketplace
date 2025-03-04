import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/apiService';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null);

  // Проверка авторизации
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userData = await apiService.getCurrentUser();
        currentUser.value = userData;
      } catch (error) {
        localStorage.removeItem('token');
        currentUser.value = null;
      }
    }
  };

  // Вход в систему
  const login = async (email, password) => {
    const user = await apiService.login(email, password);
    currentUser.value = user;
    return user;
  };

  // Регистрация
  const register = async (userData) => {
    const user = await apiService.register(userData);
    currentUser.value = user;
    return user;
  };

  // Выход из системы
  const logout = () => {
    localStorage.removeItem('token');
    currentUser.value = null;
  };

  return {
    currentUser,
    checkAuth,
    login,
    register,
    logout,
  };
});
