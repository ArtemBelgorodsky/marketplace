<template>
  <div>
    <div v-if="productStore.loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"
      ></div>
    </div>

    <div v-else-if="product" class="bg-white rounded-lg shadow-md p-6">
      <router-link
        :to="{ name: 'home' }"
        class="text-purple-700 hover:text-purple-900 mb-4 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Назад к списку
      </router-link>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div class="mb-4 rounded-lg overflow-hidden">
            <img
              :src="product.image || '/placeholder.svg?height=400&width=400'"
              :alt="product.name"
              class="w-full h-auto"
            />
          </div>
          <div
            v-if="product.additionalImages && product.additionalImages.length"
            class="grid grid-cols-4 gap-2"
          >
            <div
              v-for="(image, index) in product.additionalImages"
              :key="index"
              class="border border-purple-200 rounded-lg overflow-hidden cursor-pointer"
              @click="setMainImage(image)"
            >
              <img
                :src="image"
                :alt="`${product.name} - изображение ${index + 1}`"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>

        <div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">
            {{ product.name }}
          </h1>
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              <svg
                v-for="i in 5"
                :key="i"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
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

          <div class="mb-4">
            <span class="text-3xl font-bold text-purple-700"
              >{{ product.price }} ₽</span
            >
          </div>

          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">Описание:</h3>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <div class="mb-6">
            <h3 class="font-semibold text-gray-800 mb-2">Продавец:</h3>
            <p class="text-gray-600">{{ product.seller }}</p>
          </div>

          <button
            class="w-full bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg mb-4"
          >
            Связаться с продавцом
          </button>
        </div>
      </div>

      <div class="mt-12">
        <h2 class="text-xl font-bold text-gray-800 mb-6">Отзывы о товаре</h2>

        <div
          v-if="userStore.currentUser"
          class="mb-8 bg-purple-50 p-4 rounded-lg"
        >
          <h3 class="font-semibold text-gray-800 mb-2">Оставить отзыв</h3>
          <div class="mb-3">
            <div class="flex items-center">
              <span class="mr-2">Оценка:</span>
              <div class="flex">
                <button
                  v-for="i in 5"
                  :key="i"
                  @click="newReviewRating = i"
                  class="h-6 w-6 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    :class="{
                      'text-yellow-400 fill-current': i <= newReviewRating,
                      'text-gray-300': i > newReviewRating,
                    }"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <textarea
            v-model="newReviewText"
            class="w-full border border-purple-300 rounded-md p-3 mb-3"
            rows="3"
            placeholder="Напишите ваш отзыв о товаре..."
          ></textarea>
          <button
            @click="submitReview"
            class="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Отправить отзыв
          </button>
        </div>

        <div
          v-if="
            !productStore.reiviewProduct ||
            productStore.reiviewProduct.length === 0
          "
          class="text-gray-500 text-center py-8"
        >
          У этого товара пока нет отзывов. Будьте первым!
        </div>

        <div v-else>
          <div
            v-for="review in productStore.reiviewProduct"
            :key="review.id"
            class="border-b border-gray-200 py-6 last:border-0"
          >
            <div class="flex justify-between mb-2">
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold mr-3"
                >
                  {{ review.userName.charAt(0) }}
                </div>
                <div>
                  <div class="font-semibold text-gray-800">
                    {{ review.userName }}
                  </div>
                  <div class="text-sm text-gray-500">{{ review.date }}</div>
                </div>
              </div>
              <div class="flex text-yellow-400">
                <svg
                  v-for="i in 5"
                  :key="i"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  :class="{
                    'text-yellow-400 fill-current': i <= review.rating,
                    'text-gray-300': i > review.rating,
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
            <p class="text-gray-700">{{ review.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../stores/productStore';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const productStore = useProductStore();
const userStore = useUserStore();

const newReviewText = ref('');
const newReviewRating = ref(5);

// Получение товара из хранилища
const product = computed(() => productStore.selectedProduct);
const reviews = computed(() => productStore.reiviewProduct);

// Загрузка данных о товаре
onMounted(() => {
  productStore.fetchProductById(route.params.id);
});

// Отправка отзыва
const submitReview = async () => {
  if (!newReviewText.value.trim()) {
    return;
  }

  try {
    const reviewData = {
      rating: newReviewRating.value,
      text: newReviewText.value,
      userName: userStore.currentUser.name,
      date: new Date().toISOString(),
      productId: route.params.id,
      userId: userStore.currentUser.id,
    };

    await productStore.addReview(route.params.id, reviewData);

    // Сброс формы
    newReviewText.value = '';
    newReviewRating.value = 5;
  } catch (error) {
    console.error(error);
  }
};

// Установка главного изображения
const setMainImage = (imageUrl) => {
  if (product.value) {
    const currentMainImage = product.value.image;
    product.value.image = imageUrl;

    // Обновляем дополнительные изображения
    if (product.value.additionalImages) {
      const index = product.value.additionalImages.indexOf(imageUrl);
      if (index !== -1) {
        product.value.additionalImages[index] = currentMainImage;
      }
    }
  }
};
</script>
