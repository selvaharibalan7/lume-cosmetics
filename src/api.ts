import { MOCK_PRODUCTS, MOCK_ORDERS } from './data';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (data: any) => {
      await delay(500);
      return { token: 'mock-token', user: { id: 1, name: 'Guest User', email: data.email } };
    },
    register: async (data: any) => {
      await delay(500);
      return { token: 'mock-token', user: { id: 1, name: data.name, email: data.email } };
    },
    me: async () => {
      await delay(200);
      return { id: 1, name: 'Guest User', email: 'guest@example.com' };
    }
  },
  products: {
    list: async () => {
      await delay(300);
      return MOCK_PRODUCTS;
    },
    get: async (id: string) => {
      await delay(300);
      return MOCK_PRODUCTS.find(p => p.id === id) || null;
    }
  },
  cart: {
    get: async () => [],
    add: async () => ({ success: true }),
    remove: async () => ({ success: true }),
    update: async () => ({ success: true }),
    clear: async () => ({ success: true })
  },
  orders: {
    list: async () => {
      await delay(300);
      return MOCK_ORDERS;
    },
    create: async () => {
      await delay(500);
      return { success: true, orderId: 'ORD-' + Math.floor(Math.random() * 10000) };
    }
  },
  profile: {
    get: async () => ({}),
    update: async () => ({ success: true })
  },
  addresses: {
    list: async () => [],
    add: async () => ({ success: true })
  },
  wishlist: {
    get: async () => [],
    toggle: async () => ({ success: true })
  },
  reviews: {
    list: async () => [],
    add: async () => ({ success: true })
  }
};
