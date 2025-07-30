import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'

describe('/api/search', () => {
  it('should return all products when no query parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/search')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('results')
    expect(data).toHaveProperty('count')
    expect(data.results).toHaveLength(9)
    expect(data.count).toBe(9)
  })

  it('should filter products by category', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?category=hoodie')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results).toHaveLength(3)
    expect(data.results.every((p: any) => p.category === 'hoodie')).toBe(true)
  })

  it('should filter products by color', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?color=black')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results).toHaveLength(3) // black hoodie, hat, shoes
    expect(data.results.every((p: any) => p.color === 'black')).toBe(true)
  })

  it('should filter products by text query', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=sneakers')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results.length).toBeGreaterThan(0)
    expect(data.results.every((p: any) => 
      p.name.toLowerCase().includes('sneakers') || 
      p.description.toLowerCase().includes('sneakers')
    )).toBe(true)
  })

  it('should filter products by maximum price', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?max_price=30')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results.every((p: any) => p.price <= 30)).toBe(true)
  })

  it('should filter products by minimum price', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?min_price=100')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results.every((p: any) => p.price >= 100)).toBe(true)
  })

  it('should combine multiple filters', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?category=hoodie&color=black&max_price=50')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results).toHaveLength(1)
    expect(data.results[0].sku).toBe('HOODIE-BLACK-001')
  })

  it('should return empty results for no matches', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=nonexistent')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results).toHaveLength(0)
    expect(data.count).toBe(0)
  })

  it('should handle case-insensitive queries', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=HOODIE&category=HOODIE')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.results).toHaveLength(3)
  })

  it('should return correct product structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?category=shoes')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    const product = data.results[0]
    
    expect(product).toHaveProperty('sku')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('description')
    expect(product).toHaveProperty('category')
    expect(product).toHaveProperty('color')
    expect(product).toHaveProperty('sizes')
    expect(product).toHaveProperty('inventory')
    expect(product).toHaveProperty('image')
    
    expect(typeof product.sku).toBe('string')
    expect(typeof product.name).toBe('string')
    expect(typeof product.price).toBe('number')
    expect(typeof product.description).toBe('string')
    expect(Array.isArray(product.sizes)).toBe(true)
  })

  it('should handle invalid price parameters gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?max_price=invalid')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    // Should return all products when price filter is invalid
    expect(data.results).toHaveLength(9)
    expect(data.count).toBe(9)
  })
})