import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiService } from '../services/apiService';
import { useToastStore } from './toastStore';

export const useProductStore = defineStore('product', () => {
  const toastStore = useToastStore();

  const products = ref([]);
  const selectedProduct = ref(null);
  const loading = ref(false);
  const productsLoading = ref(false);
  const reiviewProduct = ref(null);

  // Загрузка товаров по категории
  const fetchProducts = async (categoryId, sortBy = 'popular') => {
    try {
      productsLoading.value = true;
      products.value = await apiService.getProducts(categoryId, sortBy);
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось загрузить товары');
      console.error(error);
    } finally {
      productsLoading.value = false;
    }
  };

  // Загрузка товара по ID
  const fetchProductById = async (productId) => {
    try {
      loading.value = true;
      selectedProduct.value = await apiService.getProductById(productId);
      reiviewProduct.value = await apiService.getReviewProducts(productId);
    } catch (error) {
      toastStore.showToast(
        'error',
        'Ошибка',
        'Не удалось загрузить информацию о товаре'
      );
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  // Добавление нового товара
  const addProduct = async (productData) => {
    try {
      const newProduct = await apiService.addProduct(productData);
      toastStore.showToast(
        'success',
        'Товар отправлен',
        'Ваш товар отправлен на проверку администратором'
      );
      return newProduct;
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось добавить товар');
      console.error(error);
      throw error;
    }
  };

  // Добавление отзыва к товару
  const addReview = async (productId, reviewData) => {
    try {
      await apiService.addReview(reviewData);
      // Обновляем данные о товаре
      await fetchProductById(productId);
      toastStore.showToast(
        'success',
        'Отзыв добавлен',
        'Ваш отзыв успешно добавлен'
      );
    } catch (error) {
      toastStore.showToast('error', 'Ошибка', 'Не удалось добавить отзыв');
      console.error(error);
      throw error;
    }
  };

  return {
    products,
    selectedProduct,
    loading,
    productsLoading,
    reiviewProduct,
    fetchProducts,
    fetchProductById,
    addProduct,
    addReview,
  };
});
