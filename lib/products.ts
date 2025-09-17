// In-memory product data store
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
  createdAt: string
  updatedAt: string
}

// In-memory storage
const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Coffee Mug",
    description: "Ceramic coffee mug with ergonomic handle",
    price: 12.99,
    category: "Home & Kitchen",
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Lightweight running shoes for daily training",
    price: 89.99,
    category: "Sports",
    inStock: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// CRUD operations
export const getAllProducts = (): Product[] => {
  return products
}

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const createProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
  const newProduct: Product = {
    ...productData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  products.push(newProduct)
  return newProduct
}

export const updateProduct = (id: string, productData: Partial<Omit<Product, "id" | "createdAt">>): Product | null => {
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return null

  products[index] = {
    ...products[index],
    ...productData,
    updatedAt: new Date().toISOString(),
  }
  return products[index]
}

export const deleteProduct = (id: string): boolean => {
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}
