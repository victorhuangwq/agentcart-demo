import fs from 'fs'
import path from 'path'

describe('Agent Guidance and Discovery', () => {
  describe('Enhanced agent.json', () => {
    let agentData: any

    beforeAll(() => {
      const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent.json')
      const agentJsonContent = fs.readFileSync(agentJsonPath, 'utf8')
      agentData = JSON.parse(agentJsonContent)
    })

    it('should include clear instructions for agents', () => {
      expect(agentData).toHaveProperty('description')
      expect(agentData).toHaveProperty('instructions')
      expect(agentData.instructions).toHaveProperty('quick_start')
      expect(agentData.instructions).toHaveProperty('example')
    })

    it('should have detailed API documentation', () => {
      expect(agentData).toHaveProperty('api')
      expect(agentData.api).toHaveProperty('base_url')
      expect(agentData.api).toHaveProperty('endpoints')
      
      const endpoints = agentData.api.endpoints
      expect(endpoints).toHaveProperty('search')
      expect(endpoints).toHaveProperty('buy')
    })

    it('should specify HTTP methods clearly', () => {
      const searchEndpoint = agentData.api.endpoints.search
      const buyEndpoint = agentData.api.endpoints.buy
      
      expect(searchEndpoint.method).toBe('GET')
      expect(buyEndpoint.method).toBe('POST')
    })

    it('should include complete examples', () => {
      const searchEndpoint = agentData.api.endpoints.search
      const buyEndpoint = agentData.api.endpoints.buy
      
      expect(searchEndpoint).toHaveProperty('example')
      expect(buyEndpoint).toHaveProperty('example')
      
      expect(searchEndpoint.example).toContain('GET /search')
      expect(buyEndpoint.example).toContain('POST /buy')
      expect(buyEndpoint.example).toContain('pay_token')
    })

    it('should document required fields for purchase', () => {
      const buyEndpoint = agentData.api.endpoints.buy
      
      expect(buyEndpoint).toHaveProperty('required_fields')
      expect(buyEndpoint.required_fields).toHaveProperty('sku')
      expect(buyEndpoint.required_fields).toHaveProperty('qty')
      expect(buyEndpoint.required_fields).toHaveProperty('pay_token')
    })

    it('should include the base URL', () => {
      expect(agentData.api.base_url).toBe('https://agentcart-demo-site.vercel.app')
    })
  })

  describe('robots.txt agent instructions', () => {
    let robotsContent: string

    beforeAll(() => {
      const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')
      robotsContent = fs.readFileSync(robotsPath, 'utf8')
    })

    it('should include AI agent instructions', () => {
      expect(robotsContent).toContain('AI Agent Instructions')
      expect(robotsContent).toContain('Start here: /.well-known/agent.json')
    })

    it('should include example API calls', () => {
      expect(robotsContent).toContain('GET /api/search?q=')
      expect(robotsContent).toContain('POST /api/buy')
      expect(robotsContent).toContain('pay_token')
    })

    it('should list available SKUs', () => {
      expect(robotsContent).toContain('HOODIE-BLACK')
      expect(robotsContent).toContain('HOODIE-GRAY')
      expect(robotsContent).toContain('HOODIE-NAVY')
    })

    it('should allow agent endpoints', () => {
      expect(robotsContent).toContain('Allow: /.well-known/agent.json')
      expect(robotsContent).toContain('Allow: /api/search')
      expect(robotsContent).toContain('Allow: /api/buy')
    })
  })

  describe('API endpoint consistency', () => {
    let agentData: any

    beforeAll(() => {
      const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent.json')
      const agentJsonContent = fs.readFileSync(agentJsonPath, 'utf8')
      agentData = JSON.parse(agentJsonContent)
    })

    it('should have consistent product SKUs across documentation', () => {
      const products = agentData.products
      const skus = products.map((p: any) => p.sku)
      
      expect(skus).toContain('HOODIE-BLACK')
      expect(skus).toContain('HOODIE-GRAY')
      expect(skus).toContain('HOODIE-NAVY')
    })

    it('should have correct endpoint paths', () => {
      const searchPath = agentData.api.endpoints.search.path
      const buyPath = agentData.api.endpoints.buy.path
      
      expect(searchPath).toBe('/search')
      expect(buyPath).toBe('/buy')
    })

    it('should include parameter documentation for search', () => {
      const searchParams = agentData.api.endpoints.search.parameters
      
      expect(searchParams).toHaveProperty('q')
      expect(searchParams).toHaveProperty('max_price')
      expect(searchParams).toHaveProperty('min_price')
    })
  })

  describe('Agent instruction examples', () => {
    let agentData: any

    beforeAll(() => {
      const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent.json')
      const agentJsonContent = fs.readFileSync(agentJsonPath, 'utf8')
      agentData = JSON.parse(agentJsonContent)
    })

    it('should provide a valid purchase example', () => {
      const example = agentData.instructions.example
      
      expect(example).toContain('HOODIE-BLACK')
      expect(example).toContain('qty')
      expect(example).toContain('pay_token')
      expect(example).toContain('demo')
    })

    it('should provide valid search examples', () => {
      const searchExample = agentData.api.endpoints.search.example
      
      expect(searchExample).toContain('/search')
      expect(searchExample).toMatch(/\?q=\w+/)
    })

    it('should use consistent JSON format in examples', () => {
      const buyExample = agentData.api.endpoints.buy.example
      
      // Check that the example contains valid JSON structure
      expect(buyExample).toContain('{')
      expect(buyExample).toContain('}')
      expect(buyExample).toContain('"sku"')
      expect(buyExample).toContain('"qty"')
      expect(buyExample).toContain('"pay_token"')
    })
  })
})