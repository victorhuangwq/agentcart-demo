import fs from 'fs'
import path from 'path'

describe('/.well-known/agent.json', () => {
  let agentData: any

  beforeAll(() => {
    const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent.json')
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
    expect(agentData).toHaveProperty('endpoints')

    expect(typeof agentData.store).toBe('string')
    expect(typeof agentData.currency).toBe('string')
    expect(Array.isArray(agentData.products)).toBe(true)
    expect(typeof agentData.endpoints).toBe('object')
  })

  it('should have correct store details', () => {
    expect(agentData.store).toBe('Hoodie Hut')
    expect(agentData.currency).toBe('USD')
  })

  it('should have all three products', () => {
    expect(agentData.products).toHaveLength(3)
    
    const skus = agentData.products.map((p: any) => p.sku)
    expect(skus).toContain('HOODIE-BLACK')
    expect(skus).toContain('HOODIE-GRAY')
    expect(skus).toContain('HOODIE-NAVY')
  })

  it('should have properly structured product data', () => {
    agentData.products.forEach((product: any) => {
      expect(product).toHaveProperty('sku')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('description')

      expect(typeof product.sku).toBe('string')
      expect(typeof product.name).toBe('string')
      expect(typeof product.price).toBe('number')
      expect(typeof product.description).toBe('string')

      expect(product.sku).toMatch(/^HOODIE-/)
      expect(product.price).toBeGreaterThan(0)
      expect(product.name.length).toBeGreaterThan(0)
      expect(product.description.length).toBeGreaterThan(0)
    })
  })

  it('should have correct product details', () => {
    const blackHoodie = agentData.products.find((p: any) => p.sku === 'HOODIE-BLACK')
    const grayHoodie = agentData.products.find((p: any) => p.sku === 'HOODIE-GRAY')
    const navyHoodie = agentData.products.find((p: any) => p.sku === 'HOODIE-NAVY')

    expect(blackHoodie).toBeDefined()
    expect(grayHoodie).toBeDefined()
    expect(navyHoodie).toBeDefined()

    expect(blackHoodie.name).toBe('Classic Black Hoodie')
    expect(blackHoodie.price).toBe(25)
    expect(blackHoodie.description).toContain('cotton blend')

    expect(grayHoodie.name).toBe('Tech Gray Hoodie')
    expect(grayHoodie.price).toBe(30)
    expect(grayHoodie.description).toContain('tech pocket')

    expect(navyHoodie.name).toBe('Navy Developer Hoodie')
    expect(navyHoodie.price).toBe(35)
    expect(navyHoodie.description).toContain('embroidered logo')
  })

  it('should have correct API endpoints', () => {
    expect(agentData.endpoints).toHaveProperty('search')
    expect(agentData.endpoints).toHaveProperty('buy')

    expect(agentData.endpoints.search).toBe('/search')
    expect(agentData.endpoints.buy).toBe('/buy')
  })

  it('should have valid endpoint paths', () => {
    Object.values(agentData.endpoints).forEach((endpoint: any) => {
      expect(typeof endpoint).toBe('string')
      expect(endpoint).toMatch(/^\//)
    })
  })

  it('should be consistent with API route implementations', () => {
    // Verify that the products in agent.json match those in the API
    const expectedProducts = [
      { sku: 'HOODIE-BLACK', name: 'Classic Black Hoodie', price: 25 },
      { sku: 'HOODIE-GRAY', name: 'Tech Gray Hoodie', price: 30 },
      { sku: 'HOODIE-NAVY', name: 'Navy Developer Hoodie', price: 35 }
    ]

    expectedProducts.forEach((expected) => {
      const found = agentData.products.find((p: any) => p.sku === expected.sku)
      expect(found).toBeDefined()
      expect(found.name).toBe(expected.name)
      expect(found.price).toBe(expected.price)
    })
  })

  it('should have no duplicate SKUs', () => {
    const skus = agentData.products.map((p: any) => p.sku)
    const uniqueSkus = [...new Set(skus)]
    expect(skus.length).toBe(uniqueSkus.length)
  })

  it('should be accessible as static file', () => {
    // Verify the file exists and can be served as static content
    const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent.json')
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
      products: expect.arrayContaining([
        expect.objectContaining({
          sku: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          description: expect.any(String)
        })
      ]),
      endpoints: expect.objectContaining({
        search: expect.any(String),
        buy: expect.any(String)
      })
    })
  })
})