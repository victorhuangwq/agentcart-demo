import { GET } from '@/app/api/search/route'
import { NextRequest } from 'next/server'

describe('/api/search', () => {
  it('should return all products when no query parameters', async () => {
    const request = new NextRequest('http://localhost:3000/api/search')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('results')
    expect(data).toHaveProperty('count')
    expect(data.results).toHaveLength(3)
    expect(data.count).toBe(3)

    // Verify all products are returned
    const skus = data.results.map((p: any) => p.sku)
    expect(skus).toContain('HOODIE-BLACK')
    expect(skus).toContain('HOODIE-GRAY')
    expect(skus).toContain('HOODIE-NAVY')
  })

  it('should filter products by text query', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=black')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(1)
    expect(data.count).toBe(1)
    expect(data.results[0].sku).toBe('HOODIE-BLACK')
    expect(data.results[0].name).toBe('Classic Black Hoodie')
  })

  it('should filter products by description query', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=tech')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(1)
    expect(data.count).toBe(1)
    expect(data.results[0].sku).toBe('HOODIE-GRAY')
    expect(data.results[0].description).toContain('tech')
  })

  it('should filter products by maximum price', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?max_price=30')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(2)
    expect(data.count).toBe(2)
    
    // Should include black ($25) and gray ($30) hoodies
    const skus = data.results.map((p: any) => p.sku)
    expect(skus).toContain('HOODIE-BLACK')
    expect(skus).toContain('HOODIE-GRAY')
    expect(skus).not.toContain('HOODIE-NAVY') // $35
  })

  it('should filter products by minimum price', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?min_price=30')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(2)
    expect(data.count).toBe(2)
    
    // Should include gray ($30) and navy ($35) hoodies
    const skus = data.results.map((p: any) => p.sku)
    expect(skus).toContain('HOODIE-GRAY')
    expect(skus).toContain('HOODIE-NAVY')
    expect(skus).not.toContain('HOODIE-BLACK') // $25
  })

  it('should filter products by price range', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?min_price=25&max_price=30')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(2)
    expect(data.count).toBe(2)
    
    // Should include black ($25) and gray ($30) hoodies
    const skus = data.results.map((p: any) => p.sku)
    expect(skus).toContain('HOODIE-BLACK')
    expect(skus).toContain('HOODIE-GRAY')
    expect(skus).not.toContain('HOODIE-NAVY') // $35
  })

  it('should combine text query and price filters', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=hoodie&max_price=30')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(2)
    expect(data.count).toBe(2)
    
    // All products contain "hoodie" in name, but only 2 are <= $30
    const skus = data.results.map((p: any) => p.sku)
    expect(skus).toContain('HOODIE-BLACK')
    expect(skus).toContain('HOODIE-GRAY')
  })

  it('should return empty results for no matches', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=nonexistent')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(0)
    expect(data.count).toBe(0)
  })

  it('should handle case-insensitive queries', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=TECH')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toHaveLength(1)
    expect(data.results[0].sku).toBe('HOODIE-GRAY')
  })

  it('should return correct product structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=black')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    const product = data.results[0]
    
    expect(product).toHaveProperty('sku')
    expect(product).toHaveProperty('name')
    expect(product).toHaveProperty('price')
    expect(product).toHaveProperty('description')
    
    expect(typeof product.sku).toBe('string')
    expect(typeof product.name).toBe('string')
    expect(typeof product.price).toBe('number')
    expect(typeof product.description).toBe('string')
  })

  it('should handle invalid price parameters gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?max_price=invalid')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    // Should return all products when price filter is invalid
    expect(data.results).toHaveLength(3)
    expect(data.count).toBe(3)
  })
})