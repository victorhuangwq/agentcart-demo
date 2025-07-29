import { GET as searchGET } from '@/app/api/search/route'
import { POST as buyPOST } from '@/app/api/buy/route'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

// Helper function to create requests
const createGetRequest = (url: string) => new NextRequest(url)
const createPostRequest = (body: any) => {
  return new NextRequest('http://localhost:3000/api/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('Agent Integration Workflows', () => {
  let agentData: any

  beforeAll(() => {
    const agentJsonPath = path.join(process.cwd(), 'public', '.well-known', 'agent.json')
    const agentJsonContent = fs.readFileSync(agentJsonPath, 'utf8')
    agentData = JSON.parse(agentJsonContent)
  })

  describe('Complete Purchase Workflow', () => {
    it('should complete a full purchase workflow: discover → search → buy', async () => {
      // Step 1: Agent discovers available products
      expect(agentData.products).toHaveLength(3)
      expect(agentData.api.endpoints).toHaveProperty('search')
      expect(agentData.api.endpoints).toHaveProperty('buy')

      // Step 2: Agent searches for a specific product
      const searchRequest = createGetRequest('http://localhost:3000/api/search?q=black')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      expect(searchResponse.status).toBe(200)
      expect(searchData.results).toHaveLength(1)
      const selectedProduct = searchData.results[0]
      expect(selectedProduct.sku).toBe('HOODIE-BLACK')

      // Step 3: Agent purchases the product
      const buyRequest = createPostRequest({
        sku: selectedProduct.sku,
        qty: 1,
        pay_token: 'demo'
      })
      const buyResponse = await buyPOST(buyRequest)
      const buyData = await buyResponse.json()

      expect(buyResponse.status).toBe(200)
      expect(buyData.status).toBe('success')
      expect(buyData.sku).toBe(selectedProduct.sku)
      expect(buyData).toHaveProperty('order_id')
    })

    it('should handle agent searching with price filters', async () => {
      // Agent looks for hoodies under $35
      const searchRequest = createGetRequest('http://localhost:3000/api/search?max_price=34')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      expect(searchResponse.status).toBe(200)
      expect(searchData.results).toHaveLength(2) // Black ($25) and Gray ($30)

      // Agent selects the most expensive one within budget
      const expensiveOption = searchData.results.reduce((prev: any, current: any) => 
        (prev.price > current.price) ? prev : current
      )
      expect(expensiveOption.sku).toBe('HOODIE-GRAY')
      expect(expensiveOption.price).toBe(30)

      // Agent purchases it
      const buyRequest = createPostRequest({
        sku: expensiveOption.sku,
        qty: 1,
        pay_token: 'agent-token-123'
      })
      const buyResponse = await buyPOST(buyRequest)
      const buyData = await buyResponse.json()

      expect(buyResponse.status).toBe(200)
      expect(buyData.status).toBe('success')
      expect(buyData.sku).toBe('HOODIE-GRAY')
    })

    it('should handle agent searching by description keywords', async () => {
      // Agent searches for hoodies with specific features
      const searchRequest = createGetRequest('http://localhost:3000/api/search?q=embroidered')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      expect(searchResponse.status).toBe(200)
      expect(searchData.results).toHaveLength(1)
      expect(searchData.results[0].sku).toBe('HOODIE-NAVY')
      expect(searchData.results[0].description).toContain('embroidered logo')

      // Agent purchases based on feature match
      const buyRequest = createPostRequest({
        sku: searchData.results[0].sku,
        qty: 2,
        pay_token: 'feature-search-token'
      })
      const buyResponse = await buyPOST(buyRequest)
      const buyData = await buyResponse.json()

      expect(buyResponse.status).toBe(200)
      expect(buyData.qty).toBe(2)
    })
  })

  describe('Agent Error Handling', () => {
    it('should handle agent trying to buy unavailable product', async () => {
      // Agent tries to buy a product not in the catalog
      const buyRequest = createPostRequest({
        sku: 'HOODIE-PURPLE',
        qty: 1,
        pay_token: 'demo'
      })
      const buyResponse = await buyPOST(buyRequest)
      const buyData = await buyResponse.json()

      expect(buyResponse.status).toBe(400)
      expect(buyData.error).toBe('sku not found')

      // Agent should be able to recover by searching for available products
      const searchRequest = createGetRequest('http://localhost:3000/api/search')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      expect(searchResponse.status).toBe(200)
      expect(searchData.results).toHaveLength(3)
    })

    it('should handle agent with insufficient search results', async () => {
      // Agent searches for something that doesn't exist
      const searchRequest = createGetRequest('http://localhost:3000/api/search?q=tshirt')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      expect(searchResponse.status).toBe(200)
      expect(searchData.results).toHaveLength(0)
      expect(searchData.count).toBe(0)

      // Agent should be able to broaden search
      const broaderSearchRequest = createGetRequest('http://localhost:3000/api/search?q=hoodie')
      const broaderSearchResponse = await searchGET(broaderSearchRequest)
      const broaderSearchData = await broaderSearchResponse.json()

      expect(broaderSearchResponse.status).toBe(200)
      expect(broaderSearchData.results).toHaveLength(3)
    })

    it('should handle agent with invalid purchase parameters', async () => {
      // Agent tries invalid quantity
      const invalidQtyRequest = createPostRequest({
        sku: 'HOODIE-BLACK',
        qty: -1,
        pay_token: 'demo'
      })
      const invalidQtyResponse = await buyPOST(invalidQtyRequest)
      const invalidQtyData = await invalidQtyResponse.json()

      expect(invalidQtyResponse.status).toBe(400)
      expect(invalidQtyData.error).toBe('invalid quantity')

      // Agent tries missing payment token
      const noTokenRequest = createPostRequest({
        sku: 'HOODIE-BLACK',  
        qty: 1
      })
      const noTokenResponse = await buyPOST(noTokenRequest)
      const noTokenData = await noTokenResponse.json()

      expect(noTokenResponse.status).toBe(400)
      expect(noTokenData.error).toBe('payment token required')
    })
  })

  describe('Agent Behavioral Patterns', () => {
    it('should support agent comparison shopping', async () => {
      // Agent gets all products to compare
      const searchRequest = createGetRequest('http://localhost:3000/api/search')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      expect(searchResponse.status).toBe(200)
      const products = searchData.results

      // Agent analyzes price range
      const prices = products.map((p: any) => p.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      expect(minPrice).toBe(25) // HOODIE-BLACK
      expect(maxPrice).toBe(35) // HOODIE-NAVY

      // Agent searches for budget option
      const budgetSearchRequest = createGetRequest(`http://localhost:3000/api/search?max_price=${minPrice}`)
      const budgetSearchResponse = await searchGET(budgetSearchRequest)
      const budgetSearchData = await budgetSearchResponse.json()

      expect(budgetSearchResponse.status).toBe(200)
      expect(budgetSearchData.results).toHaveLength(1)
      expect(budgetSearchData.results[0].price).toBe(minPrice)
    })

    it('should support agent bulk purchasing', async () => {
      // Agent buys multiple items of the same product
      const buyRequest = createPostRequest({
        sku: 'HOODIE-GRAY',
        qty: 10,
        pay_token: 'bulk-purchase-token'
      })
      const buyResponse = await buyPOST(buyRequest)
      const buyData = await buyResponse.json()

      expect(buyResponse.status).toBe(200)
      expect(buyData.status).toBe('success')
      expect(buyData.qty).toBe(10)
      expect(buyData.sku).toBe('HOODIE-GRAY')
    })

    it('should support agent filtering by price range', async () => {
      // Agent looks for mid-range products
      const midRangeRequest = createGetRequest('http://localhost:3000/api/search?min_price=26&max_price=34')
      const midRangeResponse = await searchGET(midRangeRequest)
      const midRangeData = await midRangeResponse.json()

      expect(midRangeResponse.status).toBe(200)
      expect(midRangeData.results).toHaveLength(1)
      expect(midRangeData.results[0].sku).toBe('HOODIE-GRAY')
      expect(midRangeData.results[0].price).toBe(30)

      // Agent purchases the mid-range option
      const buyRequest = createPostRequest({
        sku: midRangeData.results[0].sku,
        qty: 1,
        pay_token: 'mid-range-token'
      })
      const buyResponse = await buyPOST(buyRequest)

      expect(buyResponse.status).toBe(200)
    })
  })

  describe('Data Consistency', () => {
    it('should maintain consistency between agent.json and API responses', async () => {
      // Get products from search API
      const searchRequest = createGetRequest('http://localhost:3000/api/search')
      const searchResponse = await searchGET(searchRequest)
      const searchData = await searchResponse.json()

      // Compare with agent.json
      expect(searchData.results).toHaveLength(agentData.products.length)

      agentData.products.forEach((agentProduct: any) => {
        const apiProduct = searchData.results.find((p: any) => p.sku === agentProduct.sku)
        expect(apiProduct).toBeDefined()
        expect(apiProduct.name).toBe(agentProduct.name)
        expect(apiProduct.price).toBe(agentProduct.price)
        expect(apiProduct.description).toBe(agentProduct.description)
      })
    })

    it('should validate all SKUs from agent.json work in buy API', async () => {
      // Test each SKU from agent.json
      for (const product of agentData.products) {
        const buyRequest = createPostRequest({
          sku: product.sku,
          qty: 1,
          pay_token: `test-${product.sku}`
        })
        const buyResponse = await buyPOST(buyRequest)
        const buyData = await buyResponse.json()

        expect(buyResponse.status).toBe(200)
        expect(buyData.status).toBe('success')
        expect(buyData.sku).toBe(product.sku)
      }
    })
  })
})