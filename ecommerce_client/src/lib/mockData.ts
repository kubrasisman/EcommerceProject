import type { Product } from '@/types/product.types'

// Mock product data for development
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life. Experience crystal-clear sound quality and comfortable design.',
    price: 199.99,
    originalPrice: 299.99,
    discount: 33,
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'TechBrand',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 50,
    rating: 4.5,
    reviewCount: 128,
    tags: ['wireless', 'bluetooth', 'noise-cancellation'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Advanced smartwatch with health tracking, GPS, and 7-day battery life. Stay connected and monitor your fitness goals.',
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'TechBrand',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 30,
    rating: 4.7,
    reviewCount: 256,
    tags: ['smartwatch', 'fitness', 'gps'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Premium Laptop Backpack',
    description: 'Durable and stylish laptop backpack with multiple compartments and water-resistant material. Perfect for work and travel.',
    price: 79.99,
    category: 'Fashion',
    subcategory: 'Bags',
    brand: 'TravelGear',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 100,
    rating: 4.3,
    reviewCount: 89,
    tags: ['backpack', 'laptop', 'travel'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    description: 'Comfortable ergonomic office chair with lumbar support and adjustable height. Improve your posture and productivity.',
    price: 299.99,
    category: 'Home',
    subcategory: 'Furniture',
    brand: 'HomeComfort',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400',
    stock: 25,
    rating: 4.6,
    reviewCount: 142,
    tags: ['office', 'chair', 'ergonomic'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat with extra cushioning for ultimate comfort during your practice. Eco-friendly and durable.',
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    category: 'Sports',
    subcategory: 'Fitness',
    brand: 'FitLife',
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    stock: 80,
    rating: 4.4,
    reviewCount: 67,
    tags: ['yoga', 'fitness', 'exercise'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Bestseller Novel Collection',
    description: 'Collection of 5 bestselling novels from award-winning authors. Perfect for book lovers.',
    price: 49.99,
    category: 'Books',
    subcategory: 'Fiction',
    brand: 'BookWorld',
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    stock: 150,
    rating: 4.8,
    reviewCount: 312,
    tags: ['books', 'fiction', 'bestseller'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Gaming Console Pro',
    description: 'Next-generation gaming console with 4K graphics and lightning-fast load times. Includes two wireless controllers.',
    price: 499.99,
    category: 'Toys',
    subcategory: 'Gaming',
    brand: 'GameTech',
    images: [
      'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=400',
    stock: 15,
    rating: 4.9,
    reviewCount: 523,
    tags: ['gaming', 'console', '4k'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Wireless Keyboard & Mouse Combo',
    description: 'Sleek wireless keyboard and mouse combo with long battery life. Perfect for productivity and gaming.',
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'TechBrand',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    stock: 60,
    rating: 4.2,
    reviewCount: 98,
    tags: ['keyboard', 'mouse', 'wireless'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Helper function to get mock products with filtering
export function getMockProducts(filter?: {
  category?: string
  search?: string
}): Product[] {
  let filtered = [...mockProducts]

  if (filter?.category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === filter.category?.toLowerCase()
    )
  }

  if (filter?.search) {
    const searchLower = filter.search.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
    )
  }

  return filtered
}

