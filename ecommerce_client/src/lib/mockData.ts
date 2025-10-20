import type { Product } from '@/types/product.types'
import type { Category } from '@/types/category.types'

// Mock categories
const mockCategories: { [key: string]: Category[] } = {
  electronics: [
    { id: 1, code: 1001, name: 'Electronics', description: 'Electronic devices' },
    { id: 2, code: 1002, name: 'Audio', description: 'Audio equipment' }
  ],
  wearables: [
    { id: 1, code: 1001, name: 'Electronics', description: 'Electronic devices' },
    { id: 3, code: 1003, name: 'Wearables', description: 'Wearable tech' }
  ],
  fashion: [
    { id: 4, code: 2001, name: 'Fashion', description: 'Fashion items' },
    { id: 5, code: 2002, name: 'Clothing', description: 'Clothing items' }
  ],
  home: [
    { id: 6, code: 3001, name: 'Home', description: 'Home items' },
    { id: 7, code: 3002, name: 'Furniture', description: 'Furniture items' }
  ],
  sports: [
    { id: 8, code: 4001, name: 'Sports', description: 'Sports equipment' },
    { id: 9, code: 4002, name: 'Outdoor', description: 'Outdoor gear' }
  ]
}

// Mock product data for development
export const mockProducts: Product[] = [
  {
    id: 1,
    code: 10001,
    name: 'Wireless Bluetooth Headphones',
    title: 'Premium Wireless Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience crystal-clear sound quality and comfortable design.',
    price: 199.99,
    brand: 'TechBrand',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryCodes: mockCategories.electronics,
    // UI fields
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    originalPrice: 299.99,
    discount: 33,
    tags: ['wireless', 'bluetooth', 'noise-cancellation'],
  },
  {
    id: 2,
    code: 10002,
    name: 'Smart Watch Pro',
    title: 'Advanced Smart Watch',
    description: 'Advanced smartwatch with health tracking, GPS, and 7-day battery life. Stay connected and monitor your fitness goals.',
    price: 349.99,
    brand: 'TechBrand',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    categoryCodes: mockCategories.wearables,
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    ],
    stock: 30,
    rating: 4.7,
    reviewCount: 256,
    originalPrice: 449.99,
    discount: 22,
    tags: ['smartwatch', 'fitness', 'gps'],
  },
  {
    id: 3,
    code: 10003,
    name: 'Laptop Pro 15"',
    title: 'Professional Laptop',
    description: 'High-performance laptop with Intel Core i7, 16GB RAM, and 512GB SSD. Perfect for professionals and creators.',
    price: 1299.99,
    brand: 'TechBrand',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    categoryCodes: mockCategories.electronics,
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    ],
    stock: 15,
    rating: 4.8,
    reviewCount: 89,
    originalPrice: 1499.99,
    discount: 13,
    tags: ['laptop', 'computer', 'professional'],
  },
  {
    id: 4,
    code: 20001,
    name: 'Designer Jacket',
    title: 'Premium Fashion Jacket',
    description: 'Stylish designer jacket made from premium materials. Perfect for any occasion.',
    price: 89.99,
    brand: 'FashionCo',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    categoryCodes: mockCategories.fashion,
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    ],
    stock: 45,
    rating: 4.3,
    reviewCount: 67,
    originalPrice: 129.99,
    discount: 31,
    tags: ['fashion', 'jacket', 'clothing'],
  },
  {
    id: 5,
    code: 20002,
    name: 'Running Shoes',
    title: 'Professional Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning and support. Perfect for marathon runners.',
    price: 119.99,
    brand: 'SportGear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryCodes: mockCategories.sports,
    thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    ],
    stock: 60,
    rating: 4.6,
    reviewCount: 342,
    originalPrice: 159.99,
    discount: 25,
    tags: ['shoes', 'sports', 'running'],
  },
  {
    id: 6,
    code: 30001,
    name: 'Modern Office Chair',
    title: 'Ergonomic Office Chair',
    description: 'Ergonomic office chair with lumbar support and adjustable height. Comfortable for long working hours.',
    price: 249.99,
    brand: 'HomeCo',
    imageUrl: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400',
    categoryCodes: mockCategories.home,
    thumbnail: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400',
    images: [
      'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800',
    ],
    stock: 25,
    rating: 4.4,
    reviewCount: 98,
    originalPrice: 349.99,
    discount: 29,
    tags: ['furniture', 'office', 'chair'],
  },
  {
    id: 7,
    code: 10004,
    name: '4K Smart TV 55"',
    title: 'Ultra HD Smart Television',
    description: '55-inch 4K Smart TV with HDR support and built-in streaming apps. Immersive viewing experience.',
    price: 599.99,
    brand: 'TechBrand',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    categoryCodes: mockCategories.electronics,
    thumbnail: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    ],
    stock: 20,
    rating: 4.7,
    reviewCount: 156,
    originalPrice: 799.99,
    discount: 25,
    tags: ['tv', 'smart tv', '4k'],
  },
  {
    id: 8,
    code: 10005,
    name: 'Wireless Mouse',
    title: 'Ergonomic Wireless Mouse',
    description: 'Wireless mouse with ergonomic design and long battery life. Perfect for everyday use.',
    price: 29.99,
    brand: 'TechBrand',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    categoryCodes: mockCategories.electronics,
    thumbnail: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
    ],
    stock: 100,
    rating: 4.2,
    reviewCount: 234,
    originalPrice: 39.99,
    discount: 25,
    tags: ['mouse', 'wireless', 'accessories'],
  },
]

// Helper function to get mock products with pagination
export const getMockProducts = (page = 0, limit = 20) => {
  const start = page * limit
  const end = start + limit
  const paginatedProducts = mockProducts.slice(start, end)
  
  return {
    products: paginatedProducts,
    currentPage: page,
    totalPage: Math.ceil(mockProducts.length / limit),
  }
}

// Helper function to search products
export const searchMockProducts = (query: string, page = 0, limit = 20) => {
  const filtered = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
  )
  
  const start = page * limit
  const end = start + limit
  const paginatedProducts = filtered.slice(start, end)
  
  return {
    products: paginatedProducts,
    currentPage: page,
    totalPage: Math.ceil(filtered.length / limit),
  }
}

// Helper function to get product by code
export const getMockProductByCode = (code: number): Product | undefined => {
  return mockProducts.find(p => p.code === code)
}
