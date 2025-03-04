import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toast = ref({
    show: false,
    type: 'success',
    title: '',
    message: '',
    timeout: null,
  });

  // Показать уведомление
  const showToast = (type, title, message) => {
    // Очистить существующий таймаут
    if (toast.value.timeout) {
      clearTimeout(toast.value.timeout);
    }

    // Установить данные уведомления
    toast.value.show = true;
    toast.value.type = type;
    toast.value.title = title;
    toast.value.message = message;

    // Автоматически скрыть через 3 секунды
    toast.value.timeout = setTimeout(() => {
      toast.value.show = false;
    }, 3000);
  };

  return {
    toast,
    showToast,
  };
});
