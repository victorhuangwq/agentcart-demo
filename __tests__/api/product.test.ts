import { GET } from '@/app/api/product/route'
import { NextRequest } from 'next/server'

describe('/api/product', () => {
  const createRequest = (sku?: string) => {
    const url = sku 
      ? `http://localhost:3000/api/product?sku=${sku}`
      : 'http://localhost:3000/api/product'
    return new NextRequest(url)
  }

  it('should return product details for valid SKU', async () => {
    const request = createRequest('HOODIE-BLACK-001')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.product).toBeDefined()
    expect(data.product.sku).toBe('HOODIE-BLACK-001')
    expect(data.product.name).toBe('Classic Black Hoodie')
    expect(data.product.price).toBe(45)
    expect(data.product.sizes).toContain('L')
    expect(data.product.inventory).toBeDefined()
  })

  it('should return 404 for non-existent SKU', async () => {
    const request = createRequest('INVALID-SKU')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Product not found')
  })

  it('should return 400 when SKU is missing', async () => {
    const request = createRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('SKU parameter is required')
  })

  it('should handle SKU case insensitively', async () => {
    const request = createRequest('hoodie-black-001')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.product.sku).toBe('HOODIE-BLACK-001')
  })

  it('should return complete product information', async () => {
    const request = createRequest('SHOES-WHITE-002')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    const product = data.product
    expect(product).toMatchObject({
      sku: 'SHOES-WHITE-002',
      name: 'Cloud Walker Sneakers',
      price: 95,
      description: 'Ultra-comfortable everyday sneakers',
      category: 'shoes',
      color: 'white',
      sizes: expect.arrayContaining(['6', '7', '8', '9', '10', '11']),
      inventory: expect.any(Object),
      image: '/images/shoes-white.jpg',
      features: expect.arrayContaining(['Memory foam'])
    })
  })
})