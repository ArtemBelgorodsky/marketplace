<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-purple-900 mb-6">
      Панель администратора
    </h2>

    <div v-if="adminStore.loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"
      ></div>
    </div>

    <div v-else>
      <div class="mb-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Товары на проверке
        </h3>

        <div
          v-if="!adminStore.pendingProducts.length"
          class="text-gray-500 text-center py-4"
        >
          Нет товаров, ожидающих проверки
        </div>

        <div
          v-for="product in adminStore.pendingProducts"
          :key="product.id"
          class="border border-purple-200 rounded-lg p-4 mb-4"
        >
          <div class="flex flex-col md:flex-row gap-4">
            <div class="w-full md:w-1/4">
              <img
                :src="product.image || '/placeholder.svg?height=200&width=200'"
                :alt="product.name"
                class="w-full h-auto rounded-md"
              />
            </div>
            <div class="w-full md:w-3/4">
              <h4 class="font-semibold text-lg text-gray-800 mb-1">
                {{ product.name }}
              </h4>
              <p class="text-sm text-gray-500 mb-2">
                Категория:
                {{ categoryStore.getCategoryName(product.categoryId) }}
              </p>
              <p class="text-sm text-gray-500 mb-2">
                Продавец: {{ product.seller }}
              </p>
              <p class="text-gray-700 mb-4">{{ product.description }}</p>
              <div class="flex justify-end space-x-3">
                <button
                  @click="rejectProduct(product.id)"
                  class="px-4 py-2 border border-red-300 text-red-600 rounded-md"
                >
                  Отклонить
                </button>
                <button
                  @click="approveProduct(product.id)"
                  class="px-4 py-2 bg-green-600 text-white rounded-md"
                >
                  Одобрить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 class="text-xl font-semibold text-gray-800 mb-4">
          Статистика платформы
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-purple-100 rounded-lg p-4">
            <div class="text-purple-800 font-semibold mb-1">Всего товаров</div>
            <div class="text-3xl font-bold text-purple-900">
              {{ adminStore.products.length }}
            </div>
          </div>
          <div class="bg-purple-100 rounded-lg p-4">
            <div class="text-purple-800 font-semibold mb-1">
              Всего пользователей
            </div>
            <div class="text-3xl font-bold text-purple-900">
              {{ adminStore.users.length }}
            </div>
          </div>
          <div class="bg-purple-100 rounded-lg p-4">
            <div class="text-purple-800 font-semibold mb-1">Всего отзывов</div>
            <div class="text-3xl font-bold text-purple-900">
              {{ adminStore.users.length }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '../stores/adminStore';
import { useCategoryStore } from '../stores/categoryStore';

const adminStore = useAdminStore();
const categoryStore = useCategoryStore();

// Одобрение товара
const approveProduct = (productId) => {
  adminStore.approveProduct(productId);
};

// Отклонение товара
const rejectProduct = (productId) => {
  adminStore.rejectProduct(productId);
};

onMounted(() => {
  // Загрузка данных для админ-панели
  adminStore.fetchAdminData();

  // Загрузка категорий, если они еще не загружены
  if (categoryStore.categories.length === 0) {
    categoryStore.fetchCategories();
  }
});
</script>
