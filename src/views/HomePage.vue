<template>
  <div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-purple-900 mb-4">Категории товаров</h2>
      <div v-if="categoryStore.loading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"
        ></div>
      </div>
      <div v-else class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button
          v-for="category in categoryStore.categories"
          :key="category.id"
          @click="selectCategory(category)"
          class="bg-white hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
          :class="{
            'bg-purple-200':
              selectedCategory && selectedCategory.id === category.id,
          }"
        >
          <div class="text-purple-700 mb-2">
            <img :src="category.image" class="h-8 w-8 mx-auto" />
          </div>
          <span class="text-sm font-medium text-gray-800">{{
            category.name
          }}</span>
        </button>
      </div>
    </div>

    <div v-if="selectedCategory">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-purple-900">
          {{ selectedCategory.name }}
        </h2>
        <div class="flex space-x-2">
          <select
            v-model="sortOption"
            @change="loadProducts"
            class="border border-purple-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="popular">По популярности</option>
            <option value="rating">По рейтингу</option>
            <option value="new">Сначала новые</option>
          </select>
        </div>
      </div>

      <div v-if="productStore.productsLoading" class="flex justify-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"
        ></div>
      </div>
      <div
        v-else-if="productStore.products.length === 0"
        class="text-center py-8 text-gray-500"
      >
        В данной категории пока нет товаров
      </div>
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          @click="viewProductDetails(product.id)"
          class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="product.image || '/placeholder.svg?height=300&width=300'"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800 mb-1">
              {{ product.name }}
            </h3>
            <div class="flex items-center mb-2">
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  :class="{
                    'text-yellow-400 fill-current': i <= product.rating,
                    'text-gray-300': i > product.rating,
                  }"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-2">
              {{ truncateText(product.description, 60) }}
            </p>
            <div class="flex justify-between items-center">
              <span class="font-bold text-purple-700"
                >{{ product.price }} ₽</span
              >
              <span class="text-xs text-gray-500">{{ product.seller }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '../stores/categoryStore';
import { useProductStore } from '../stores/productStore';

const router = useRouter();
const categoryStore = useCategoryStore();
const productStore = useProductStore();

const selectedCategory = ref(null);
const sortOption = ref('popular');

// Загрузка товаров
const loadProducts = async () => {
  if (!selectedCategory.value) return;
  await productStore.fetchProducts(selectedCategory.value.id, sortOption.value);
};

// Выбор категории
const selectCategory = (category) => {
  selectedCategory.value = category;
  loadProducts();
};

// Переход на страницу товара
const viewProductDetails = (productId) => {
  router.push({ name: 'product-detail', params: { id: productId } });
};

// Вспомогательные функции
const truncateText = (text, length) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const getCategoryIcon = (categoryName) => {
  const icons = {
    Электроника: 'svg-electronics',
    'Одежда и обувь': 'svg-clothing',
    'Дом и интерьер': 'svg-home',
    'Косметика и парфюмерия': 'svg-beauty',
    'Книги и канцелярские товары': 'svg-sport',
  };

  return icons[categoryName] || 'svg-default';
};

onMounted(() => {
  categoryStore.fetchCategories();
});

const filteredProducts = computed(() => {
  return productStore.products.filter(
    (product) => product.status === 'approved'
  );
});

// Компоненты иконок
const components = {
  'svg-electronics': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      `,
  },
  'svg-clothing': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      `,
  },
  'svg-home': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      `,
  },
  'svg-beauty': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      `,
  },
  'svg-sport': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      `,
  },
  'svg-kids': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      `,
  },
  'svg-default': {
    template: `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      `,
  },
};
</script>
