// Базовый URL для API mokky.dev
// Примечание: в реальном проекте вам нужно создать свой API на mokky.dev
const API_URL = 'https://a53a7eaa64bfceaf.mokky.dev';

// Вспомогательная функция для работы с fetch
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Произошла ошибка при запросе к API');
  }
  console.log(response);
  return response.json();
};

export const apiService = {
  // Аутентификация
  async login(email, password) {
    const data = await fetchWithAuth('/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data.user;
  },

  async register(userData) {
    const data = await fetchWithAuth('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data.user;
  },

  async getCurrentUser() {
    return fetchWithAuth('/auth_me');
  },

  async getUsers() {
    return fetchWithAuth('/users');
  },

  // Категории
  async getCategories() {
    return fetchWithAuth('/categories');
  },

  // Товары
  async getProducts(categoryId = null) {
    let url = '/products';
    const params = [];

    if (categoryId) {
      params.push(`categoryId=${categoryId}`);
    }

    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }

    return fetchWithAuth(url);
  },

  async getProductById(id) {
    return fetchWithAuth(`/products/${id}`);
  },

  async addProduct(productData) {
    return fetchWithAuth('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id, productData) {
    return fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Отзывы
  async addReview(reviewData) {
    return fetchWithAuth(`/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Админ-функции
  async getPendingProducts() {
    return fetchWithAuth('/products?status=pending');
  },

  async getReviewProducts(id) {
    return fetchWithAuth('/reviews?productId=' + id);
  },

  async getReviews() {
    return fetchWithAuth('/reviews');
  },

  async approveProduct(id) {
    return fetchWithAuth(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'approved' }),
    });
  },

  async rejectProduct(id) {
    return fetchWithAuth(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'rejected' }),
    });
  },
};
