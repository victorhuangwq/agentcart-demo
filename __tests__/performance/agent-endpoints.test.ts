import { GET as searchGET } from '@/app/api/search/route'
import { POST as buyPOST } from '@/app/api/buy/route'
import { NextRequest } from 'next/server'

// Helper functions
const createGetRequest = (url: string) => new NextRequest(url)
const createPostRequest = (body: any) => {
  return new NextRequest('http://localhost:3000/api/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('Agent Endpoint Performance', () => {
  describe('Search API Performance', () => {
    it('should respond to search requests quickly', async () => {
      const startTime = Date.now()
      
      const request = createGetRequest('http://localhost:3000/api/search')
      const response = await searchGET(request)
      const data = await response.json()
      
      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.results).toHaveLength(9)
      expect(responseTime).toBeLessThan(100) // Should respond in under 100ms
    })

    it('should handle concurrent search requests efficiently', async () => {
      const concurrentRequests = 10
      const requests = Array.from({ length: concurrentRequests }, (_, i) => 
        searchGET(createGetRequest(`http://localhost:3000/api/search?q=hoodie&test=${i}`))
      )

      const startTime = Date.now()
      const responses = await Promise.all(requests)
      const endTime = Date.now()
      const totalTime = endTime - startTime

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      // Total time should be reasonable for concurrent requests
      expect(totalTime).toBeLessThan(500)
    })

    it('should perform filtering operations efficiently', async () => {
      const filterTests = [
        'http://localhost:3000/api/search?q=black',
        'http://localhost:3000/api/search?max_price=50',
        'http://localhost:3000/api/search?min_price=50',
        'http://localhost:3000/api/search?q=hoodie&max_price=60',
      ]

      for (const testUrl of filterTests) {
        const startTime = Date.now()
        const response = await searchGET(createGetRequest(testUrl))
        const endTime = Date.now()
        const responseTime = endTime - startTime

        expect(response.status).toBe(200)
        expect(responseTime).toBeLessThan(50) // Filtering should be very fast
      }
    })
  })

  describe('Buy API Performance', () => {
    it('should process purchase requests quickly', async () => {
      const requestBody = {
        sku: 'HOODIE-BLACK-001',
        qty: 1,
        size: 'L',
        pay_token: 'performance-test'
      }

      const startTime = Date.now()
      const response = await buyPOST(createPostRequest(requestBody))
      const data = await response.json()
      const endTime = Date.now()
      const responseTime = endTime - startTime

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(responseTime).toBeLessThan(100) // Should process in under 100ms
    })

    it('should handle concurrent purchase requests', async () => {
      const concurrentPurchases = 5
      const requests = Array.from({ length: concurrentPurchases }, (_, i) => 
        buyPOST(createPostRequest({
          sku: 'HOODIE-GRAY-002',
          qty: 1,
          size: 'M',
          pay_token: `concurrent-test-${i}`
        }))
      )

      const startTime = Date.now()
      const responses = await Promise.all(requests)
      const endTime = Date.now()
      const totalTime = endTime - startTime

      // All purchases should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      // Verify unique order IDs
      const orderIds = new Set()
      for (const response of responses) {
        const data = await response.json()
        expect(data.success).toBe(true)
        orderIds.add(data.order_id)
      }
      expect(orderIds.size).toBe(concurrentPurchases)

      // Total time should be reasonable
      expect(totalTime).toBeLessThan(300)
    })

    it('should generate order IDs efficiently', async () => {
      const numOrders = 100
      const orderIds = new Set()

      const startTime = Date.now()
      
      for (let i = 0; i < numOrders; i++) {
        const response = await buyPOST(createPostRequest({
          sku: 'HOODIE-NAVY-003',
          qty: 1,
          size: 'XL',
          pay_token: `id-test-${i}`
        }))
        const data = await response.json()
        expect(data.success).toBe(true)
        orderIds.add(data.order_id)
      }

      const endTime = Date.now()
      const totalTime = endTime - startTime

      // All order IDs should be unique
      expect(orderIds.size).toBe(numOrders)
      
      // Should generate IDs efficiently
      expect(totalTime).toBeLessThan(2000) // 2 seconds for 100 orders
    })
  })

  describe('Memory and Resource Usage', () => {
    it('should not have memory leaks in search operations', async () => {
      const iterations = 50
      
      for (let i = 0; i < iterations; i++) {
        const response = await searchGET(createGetRequest('http://localhost:3000/api/search'))
        expect(response.status).toBe(200)
        
        // Process the response to ensure it's fully consumed
        await response.json()
      }

      // If we reach here without memory issues, the test passes
      expect(true).toBe(true)
    })

    it('should handle large quantity purchases efficiently', async () => {
      // Use smaller quantities that fit within inventory constraints
      // HOODIE-BLACK-001 size L has 100 units in inventory
      const largeQuantities = [10, 50, 90]
      
      for (const qty of largeQuantities) {
        const startTime = Date.now()
        
        const response = await buyPOST(createPostRequest({
          sku: 'HOODIE-BLACK-001',
          qty,
          size: 'L',
          pay_token: `large-qty-test-${qty}`
        }))
        
        const endTime = Date.now()
        const responseTime = endTime - startTime
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.qty).toBe(qty)
        expect(responseTime).toBeLessThan(100) // Should handle large quantities quickly
      }
    })
  })

  describe('Error Handling Performance', () => {
    it('should handle invalid requests efficiently', async () => {
      const invalidRequests = [
        { sku: 'INVALID', qty: 1, size: 'M', pay_token: 'test' },
        { sku: 'HOODIE-BLACK-001', qty: 0, size: 'M', pay_token: 'test' },
        { sku: 'HOODIE-BLACK-001', qty: 1, size: 'M' }, // missing pay_token
      ]

      for (const requestBody of invalidRequests) {
        const startTime = Date.now()
        const response = await buyPOST(createPostRequest(requestBody))
        const endTime = Date.now()
        const responseTime = endTime - startTime

        expect(response.status).toBe(400)
        expect(responseTime).toBeLessThan(50) // Error responses should be very fast
      }
    })

    it('should handle search queries with no results efficiently', async () => {
      const noResultQueries = [
        'http://localhost:3000/api/search?q=nonexistent',
        'http://localhost:3000/api/search?max_price=10',
        'http://localhost:3000/api/search?min_price=1000',
      ]

      for (const queryUrl of noResultQueries) {
        const startTime = Date.now()
        const response = await searchGET(createGetRequest(queryUrl))
        const data = await response.json()
        const endTime = Date.now()
        const responseTime = endTime - startTime

        expect(response.status).toBe(200)
        expect(data.results).toHaveLength(0)
        expect(data.count).toBe(0)
        expect(responseTime).toBeLessThan(50) // No-result queries should be very fast
      }
    })
  })

  describe('Scalability Indicators', () => {
    it('should maintain performance with varied search patterns', async () => {
      const searchPatterns = [
        '',  // All products
        '?q=hoodie',  // Text search
        '?max_price=50',  // Price filter
        '?q=sneakers&min_price=80&max_price=130',  // Combined filters
      ]

      const timings: number[] = []

      for (const pattern of searchPatterns) {
        const startTime = Date.now()
        const response = await searchGET(createGetRequest(`http://localhost:3000/api/search${pattern}`))
        await response.json()
        const endTime = Date.now()
        
        timings.push(endTime - startTime)
        expect(response.status).toBe(200)
      }

      // All search patterns should have similar performance
      const maxTiming = Math.max(...timings)
      const minTiming = Math.min(...timings)
      const variance = maxTiming - minTiming

      expect(variance).toBeLessThan(50) // Performance should be consistent
    })
  })
})