const API_BASE = '/api';

class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Recursively convert camelCase to snake_case
  const snakeize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(snakeize);
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = key.replace(/[A-Z]/g, g => '_' + g.toLowerCase());
        acc[snakeKey] = snakeize(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  };

  const finalOptions = { ...options };
  if (options.body && typeof options.body === 'string' && finalOptions.headers) {
    try {
      const parsed = JSON.parse(options.body);
      finalOptions.body = JSON.stringify(snakeize(parsed));
    } catch (e) {
      // ignore
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...finalOptions,
    headers,
  });
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }
    return null;
  }
  
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    throw new ApiError(response.status, data?.message || 'API Error', data);
  }
  
  // Recursively convert snake_case to camelCase
  const camelize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(camelize);
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
        acc[camelKey] = camelize(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  };
  
  return camelize(data.data);
}

export const api = {
  auth: {
    login: (data: any) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    register: (data: any) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => fetchApi('/auth/logout', { method: 'POST' }),
    me: () => fetchApi('/auth/me'),
  },
  products: {
    list: (params?: any) => {
      const search = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetchApi(`/products/${search}`);
    },
    get: (id: string) => fetchApi(`/products/${id}`),
    categories: () => fetchApi('/products/categories'),
  },
  cart: {
    get: () => fetchApi('/cart/'),
    add: (data: any) => fetchApi('/cart/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, quantity: number) => fetchApi(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    remove: (id: number) => fetchApi(`/cart/${id}`, { method: 'DELETE' }),
    clear: () => fetchApi('/cart/', { method: 'DELETE' }),
  },
  orders: {
    list: () => fetchApi('/orders/'),
    get: (id: string) => fetchApi(`/orders/${id}`),
    create: (data: any) => fetchApi('/orders/', { method: 'POST', body: JSON.stringify(data) }),
  },
  profile: {
    get: () => fetchApi('/profile/'),
    updateSkin: (data: any) => fetchApi('/profile/skin-profile', { method: 'PUT', body: JSON.stringify(data) }),
    updateInfo: (data: any) => fetchApi('/profile/update', { method: 'PUT', body: JSON.stringify(data) }),
  },
  addresses: {
    list: () => fetchApi('/addresses/'),
    add: (data: any) => fetchApi('/addresses/', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id: number) => fetchApi(`/addresses/${id}`, { method: 'DELETE' }),
    setDefault: (id: number) => fetchApi(`/addresses/${id}/default`, { method: 'PUT' }),
  },
  wishlist: {
    get: () => fetchApi('/wishlist/'),
    add: (id: string) => fetchApi(`/wishlist/${id}`, { method: 'POST' }),
    remove: (id: string) => fetchApi(`/wishlist/${id}`, { method: 'DELETE' }),
  },
  reviews: {
    list: (productId: string) => fetchApi(`/reviews/product/${productId}`),
    add: (productId: string, data: any) => fetchApi(`/reviews/product/${productId}`, { method: 'POST', body: JSON.stringify(data) }),
  },
};
