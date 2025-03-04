import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/apiService';
import { useToastStore } from './toastStore';

export const useCategoryStore = defineStore('category', () => {
  const toastStore = useToastStore();

  const categories = ref([]);
  const loading = ref(false);

  // Загрузка категорий
  const fetchCategories = async () => {
    try {
      loading.value = true;
      categories.value = await apiService.getCategories();
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось загрузить категории');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // Получение названия категории по ID
  const getCategoryName = (categoryId) => {
    const category = categories.value.find((c) => c.id === categoryId);
    return category ? category.name : 'Неизвестная категория';
  };

  return {
    categories,
    loading,
    fetchCategories,
    getCategoryName,
  };
});
