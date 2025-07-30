export interface Product {
  sku: string
  name: string
  price: number
  description: string
  category: 'hoodie' | 'hat' | 'shoes'
  color: string
  sizes: string[]
  inventory: { [size: string]: number }
  image: string
  features?: string[]
}

export const PRODUCTS: Product[] = [
  // Hoodies
  {
    sku: 'HOODIE-BLACK-001',
    name: 'Classic Black Hoodie',
    price: 45,
    description: 'Premium cotton blend hoodie with embroidered logo',
    category: 'hoodie',
    color: 'black',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inventory: { 'S': 50, 'M': 75, 'L': 100, 'XL': 60, 'XXL': 30 },
    image: '/images/hoodie-black.jpg',
    features: ['100% organic cotton', 'Kangaroo pocket', 'Embroidered logo']
  },
  {
    sku: 'HOODIE-GRAY-002',
    name: 'Tech Gray Hoodie',
    price: 55,
    description: 'Tech fleece hoodie with zippered pockets',
    category: 'hoodie',
    color: 'gray',
    sizes: ['S', 'M', 'L', 'XL'],
    inventory: { 'S': 30, 'M': 45, 'L': 50, 'XL': 25 },
    image: '/images/hoodie-gray.jpg',
    features: ['Tech fleece fabric', 'Zip-up hood', 'Phone pocket']
  },
  {
    sku: 'HOODIE-NAVY-003',
    name: 'Navy Creator Hoodie',
    price: 50,
    description: 'Limited edition creator series hoodie',
    category: 'hoodie',
    color: 'navy',
    sizes: ['M', 'L', 'XL'],
    inventory: { 'M': 20, 'L': 25, 'XL': 15 },
    image: '/images/hoodie-navy.jpg',
    features: ['Limited edition', 'Oversized fit', 'Special edition patch']
  },
  // Hats
  {
    sku: 'HAT-BLACK-001',
    name: 'Signature Snapback',
    price: 25,
    description: 'Classic snapback with embroidered logo',
    category: 'hat',
    color: 'black',
    sizes: ['OS'],
    inventory: { 'OS': 200 },
    image: '/images/hat-black.jpg',
    features: ['Adjustable snapback', 'Embroidered logo', 'Flat brim']
  },
  {
    sku: 'HAT-RED-002',
    name: 'Creator Beanie',
    price: 20,
    description: 'Warm knit beanie for cold days',
    category: 'hat',
    color: 'red',
    sizes: ['OS'],
    inventory: { 'OS': 150 },
    image: '/images/hat-red.jpg',
    features: ['100% acrylic', 'One size fits all', 'Woven label']
  },
  {
    sku: 'HAT-WHITE-003',
    name: 'Dad Cap',
    price: 22,
    description: 'Vintage-style dad cap with curved brim',
    category: 'hat',
    color: 'white',
    sizes: ['OS'],
    inventory: { 'OS': 100 },
    image: '/images/hat-white.jpg',
    features: ['Adjustable strap', 'Curved brim', 'Soft cotton']
  },
  // Shoes
  {
    sku: 'SHOES-BLACK-001',
    name: 'Creator Sneakers',
    price: 120,
    description: 'Limited edition signature sneakers',
    category: 'shoes',
    color: 'black',
    sizes: ['7', '8', '9', '10', '11', '12'],
    inventory: { '7': 20, '8': 30, '9': 40, '10': 45, '11': 35, '12': 20 },
    image: '/images/shoes-black.jpg',
    features: ['Premium leather', 'Custom insole', 'Limited edition']
  },
  {
    sku: 'SHOES-WHITE-002',
    name: 'Cloud Walker Sneakers',
    price: 95,
    description: 'Ultra-comfortable everyday sneakers',
    category: 'shoes',
    color: 'white',
    sizes: ['6', '7', '8', '9', '10', '11'],
    inventory: { '6': 15, '7': 25, '8': 35, '9': 40, '10': 30, '11': 20 },
    image: '/images/shoes-white.jpg',
    features: ['Memory foam', 'Breathable mesh', 'Lightweight']
  },
  {
    sku: 'SHOES-RED-003',
    name: 'Studio High-Tops',
    price: 110,
    description: 'High-top sneakers for creators',
    category: 'shoes',
    color: 'red',
    sizes: ['8', '9', '10', '11'],
    inventory: { '8': 20, '9': 25, '10': 30, '11': 15 },
    image: '/images/shoes-red.jpg',
    features: ['High-top design', 'Ankle support', 'Signature colorway']
  }
]