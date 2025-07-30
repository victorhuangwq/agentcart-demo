import fs from 'fs'
import path from 'path'

describe('/.well-known/agent-store.json', () => {
  let agentData: any

  beforeAll(() => {
    const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent-store.json')
    const agentJsonContent = fs.readFileSync(agentJsonPath, 'utf8')
    agentData = JSON.parse(agentJsonContent)
  })

  it('should exist and be valid JSON', () => {
    expect(agentData).toBeDefined()
    expect(typeof agentData).toBe('object')
  })

  it('should have required store information', () => {
    expect(agentData).toHaveProperty('store')
    expect(agentData).toHaveProperty('currency')
    expect(agentData).toHaveProperty('products')
    expect(agentData).toHaveProperty('api')
    expect(agentData).toHaveProperty('categories')

    expect(typeof agentData.store).toBe('string')
    expect(typeof agentData.currency).toBe('string')
    expect(Array.isArray(agentData.products)).toBe(true)
    expect(typeof agentData.api).toBe('object')
    expect(Array.isArray(agentData.categories)).toBe(true)
  })

  it('should have correct store details', () => {
    expect(agentData.store).toBe('Creator Merch Store')
    expect(agentData.currency).toBe('USD')
    expect(agentData.categories).toEqual(['hoodie', 'hat', 'shoes'])
  })

  it('should have all nine products', () => {
    expect(agentData.products).toHaveLength(9)
    
    const categories = agentData.products.map((p: any) => p.category)
    const hoodieCounts = categories.filter((c: string) => c === 'hoodie').length
    const hatCounts = categories.filter((c: string) => c === 'hat').length
    const shoesCounts = categories.filter((c: string) => c === 'shoes').length
    
    expect(hoodieCounts).toBe(3)
    expect(hatCounts).toBe(3)
    expect(shoesCounts).toBe(3)
  })

  it('should have properly structured product data', () => {
    agentData.products.forEach((product: any) => {
      expect(product).toHaveProperty('sku')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('description')
      expect(product).toHaveProperty('category')
      expect(product).toHaveProperty('color')
      expect(product).toHaveProperty('sizes')

      expect(typeof product.sku).toBe('string')
      expect(typeof product.name).toBe('string')
      expect(typeof product.price).toBe('number')
      expect(typeof product.description).toBe('string')
      expect(typeof product.category).toBe('string')
      expect(typeof product.color).toBe('string')
      expect(Array.isArray(product.sizes)).toBe(true)

      expect(product.price).toBeGreaterThan(0)
      expect(product.name.length).toBeGreaterThan(0)
      expect(product.description.length).toBeGreaterThan(0)
    })
  })

  it('should have correct product details', () => {
    const blackHoodie = agentData.products.find((p: any) => p.sku === 'HOODIE-BLACK-001')
    const snapback = agentData.products.find((p: any) => p.sku === 'HAT-BLACK-001')
    const sneakers = agentData.products.find((p: any) => p.sku === 'SHOES-BLACK-001')

    expect(blackHoodie).toBeDefined()
    expect(snapback).toBeDefined()
    expect(sneakers).toBeDefined()

    expect(blackHoodie.name).toBe('Classic Black Hoodie')
    expect(blackHoodie.price).toBe(45)
    expect(blackHoodie.category).toBe('hoodie')

    expect(snapback.name).toBe('Signature Snapback')
    expect(snapback.price).toBe(25)
    expect(snapback.category).toBe('hat')

    expect(sneakers.name).toBe('Creator Sneakers')
    expect(sneakers.price).toBe(120)
    expect(sneakers.category).toBe('shoes')
  })

  it('should have correct API endpoints', () => {
    expect(agentData.api.endpoints).toHaveProperty('search')
    expect(agentData.api.endpoints).toHaveProperty('product')
    expect(agentData.api.endpoints).toHaveProperty('buy')

    expect(agentData.api.endpoints.search.path).toBe('/api/search')
    expect(agentData.api.endpoints.product.path).toBe('/api/product')
    expect(agentData.api.endpoints.buy.path).toBe('/api/buy')
  })

  it('should have valid endpoint paths', () => {
    const endpoints = agentData.api.endpoints
    Object.values(endpoints).forEach((endpoint: any) => {
      expect(endpoint).toHaveProperty('path')
      expect(typeof endpoint.path).toBe('string')
      expect(endpoint.path).toMatch(/^\/api\//)
    })
  })

  it('should be consistent with API route implementations', () => {
    // Verify that the products in agent-store.json match those in the API
    const expectedSKUs = [
      'HOODIE-BLACK-001', 'HOODIE-GRAY-002', 'HOODIE-NAVY-003',
      'HAT-BLACK-001', 'HAT-RED-002', 'HAT-WHITE-003',
      'SHOES-BLACK-001', 'SHOES-WHITE-002', 'SHOES-RED-003'
    ]

    expectedSKUs.forEach((expectedSKU) => {
      const found = agentData.products.find((p: any) => p.sku === expectedSKU)
      expect(found).toBeDefined()
    })
  })

  it('should have no duplicate SKUs', () => {
    const skus = agentData.products.map((p: any) => p.sku)
    const uniqueSkus = [...new Set(skus)]
    expect(skus.length).toBe(uniqueSkus.length)
  })

  it('should be accessible as static file', () => {
    // Verify the file exists and can be served as static content
    const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent-store.json')
    expect(fs.existsSync(agentJsonPath)).toBe(true)
    
    // In production, this would be served by the web server
    // For testing, we verify the file structure and content
    expect(agentData).toBeDefined()
    expect(typeof agentData).toBe('object')
  })

  it('should have proper JSON schema structure for agents', () => {
    // Verify the structure follows common agent discovery patterns
    expect(agentData).toMatchObject({
      store: expect.any(String),
      currency: expect.any(String),
      categories: expect.arrayContaining([expect.any(String)]),
      products: expect.arrayContaining([
        expect.objectContaining({
          sku: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          description: expect.any(String),
          category: expect.any(String),
          color: expect.any(String),
          sizes: expect.any(Array)
        })
      ]),
      api: expect.objectContaining({
        endpoints: expect.objectContaining({
          search: expect.any(Object),
          product: expect.any(Object),
          buy: expect.any(Object)
        })
      })
    })
  })

  it('should have comprehensive API documentation', () => {
    const { endpoints } = agentData.api
    
    // Check search endpoint
    expect(endpoints.search).toMatchObject({
      path: expect.any(String),
      method: 'GET',
      description: expect.any(String),
      parameters: expect.any(Object),
      response: expect.any(Object),
      example: expect.any(String)
    })

    // Check product endpoint
    expect(endpoints.product).toMatchObject({
      path: expect.any(String),
      method: 'GET',
      description: expect.any(String),
      parameters: expect.any(Object),
      response: expect.any(Object),
      example: expect.any(String)
    })

    // Check buy endpoint
    expect(endpoints.buy).toMatchObject({
      path: expect.any(String),
      method: 'POST',
      description: expect.any(String),
      required_fields: expect.any(Object),
      optional_fields: expect.any(Object),
      response: expect.any(Object),
      example: expect.any(String)
    })
  })
})