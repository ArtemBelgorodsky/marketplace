import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/apiService';
import { useToastStore } from './toastStore';

export const useAdminStore = defineStore('admin', () => {
  const toastStore = useToastStore();

  const pendingProducts = ref([]);
  const products = ref([]);
  const loading = ref(false);
  const users = ref([]);
  const reviews = ref([]);

  // Загрузка данных для админ-панели
  const fetchAdminData = async () => {
    try {
      loading.value = true;

      // Параллельная загрузка данных
      const [pendingProductsData, productsData, usersData, reviewsData] =
        await Promise.all([
          apiService.getPendingProducts(),
          apiService.getProducts(),
          apiService.getUsers(),
          apiService.getReviews(),
        ]);

      pendingProducts.value = pendingProductsData;
      products.value = productsData;
      users.value = usersData;
      reviews.value = reviewsData;
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось загрузить данные');
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // Одобрение товара
  const approveProduct = async (productId) => {
    try {
      await apiService.approveProduct(productId);

      // Удаление из списка ожидающих
      pendingProducts.value = pendingProducts.value.filter(
        (p) => p.id !== productId
      );

      toastStore.showToast(
        'success',
        'Товар одобрен',
        'Товар успешно опубликован на платформе'
      );
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось одобрить товар');
      console.error(error);
    }
  };

  // Отклонение товара
  const rejectProduct = async (productId) => {
    try {
      await apiService.rejectProduct(productId);

      // Удаление из списка ожидающих
      pendingProducts.value = pendingProducts.value.filter(
        (p) => p.id !== productId
      );

      toastStore.showToast(
        'success',
        'Товар отклонен',
        'Товар был отклонен и удален из системы'
      );
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось отклонить товар');
      console.error(error);
    }
  };

  return {
    pendingProducts,
    loading,
    users,
    reviews,
    products,
    fetchAdminData,
    approveProduct,
    rejectProduct,
  };
});
