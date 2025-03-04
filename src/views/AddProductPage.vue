<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-bold text-purple-900 mb-6">
      Добавить новый товар
    </h2>
    <p class="text-gray-600 mb-6">
      Заполните форму ниже, чтобы добавить свой товар на платформу. После
      отправки, ваш товар будет проверен администратором перед публикацией.
    </p>

    <div v-if="categoryStore.loading" class="flex justify-center py-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"
      ></div>
    </div>

    <form
      v-else
      @submit.prevent="submitProduct"
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div class="md:col-span-2">
        <label class="block text-gray-700 font-medium mb-2"
          >Название товара</label
        >
        <input
          v-model="newProduct.name"
          type="text"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-gray-700 font-medium mb-2">Категория</label>
        <select
          v-model="newProduct.categoryId"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        >
          <option value="" disabled>Выберите категорию</option>
          <option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="block text-gray-700 font-medium mb-2"
          >Описание товара</label
        >
        <textarea
          v-model="newProduct.description"
          class="w-full border border-purple-300 rounded-md p-3"
          rows="4"
          required
        ></textarea>
      </div>
      <div class="md:col-span-2">
        <label class="block text-gray-700 font-medium mb-2">Продавец</label>
        <textarea
          v-model="newProduct.seller"
          class="w-full border border-purple-300 rounded-md p-3"
          rows="4"
          required
        ></textarea>
      </div>
      <div>
        <label class="block text-gray-700 font-medium mb-2">Цена (₽)</label>
        <input
          v-model="newProduct.price"
          type="number"
          min="0"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>

      <div>
        <label class="block text-gray-700 font-medium mb-2"
          >Ссылка на изображение товара</label
        >
        <input
          v-model="newProduct.image"
          type="text"
          min="0"
          class="w-full border border-purple-300 rounded-md p-3"
          required
        />
      </div>

      <div class="md:col-span-2 flex justify-end space-x-4">
        <router-link
          :to="{ name: 'home' }"
          class="px-6 py-3 border border-purple-300 rounded-md text-purple-700 font-medium"
        >
          Отмена
        </router-link>
        <button
          type="submit"
          class="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-md"
          :disabled="submitting"
        >
          <span v-if="submitting">Отправка...</span>
          <span v-else>Отправить на проверку</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/productStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useUserStore } from '../stores/userStore';
import { useToastStore } from '../stores/toastStore';

const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const userStore = useUserStore();
const toastStore = useToastStore();

const submitting = ref(false);
const imagePreview = ref(null);
const newProduct = ref({
  name: '',
  categoryId: '',
  description: '',
  price: '',
  image: '',
  seller: '',
});

// Отправка формы
const submitProduct = async () => {
  try {
    submitting.value = true;

    // Подготовка данных
    const productData = {
      name: newProduct.value.name,
      categoryId: newProduct.value.categoryId,
      description: newProduct.value.description,
      price: parseFloat(newProduct.value.price),
      image: newProduct.value.image,
      seller: newProduct.value.seller,
      status: 'pending',
    };

    // Отправка на сервер
    await productStore.addProduct(productData);

    // Переход на главную
    router.push({ name: 'home' });
  } catch (error) {
    console.error(error);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  // Загрузка категорий
  categoryStore.fetchCategories();
});
</script>
