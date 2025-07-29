import { POST } from '@/app/api/buy/route'
import { NextRequest } from 'next/server'

// Helper function to create a POST request with JSON body
const createPostRequest = (body: any) => {
  return new NextRequest('http://localhost:3000/api/buy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

describe('/api/buy', () => {
  it('should successfully process a valid purchase', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      qty: 1,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('status', 'success')
    expect(data).toHaveProperty('order_id')
    expect(data).toHaveProperty('sku', 'HOODIE-BLACK')
    expect(data).toHaveProperty('qty', 1)
    expect(data).toHaveProperty('message')
    
    expect(typeof data.order_id).toBe('string')
    expect(data.order_id).toMatch(/^ord_/)
  })

  it('should process purchases for all valid SKUs', async () => {
    const validSkus = ['HOODIE-BLACK', 'HOODIE-GRAY', 'HOODIE-NAVY']
    
    for (const sku of validSkus) {
      const requestBody = {
        sku,
        qty: 1,
        pay_token: 'demo'
      }
      
      const request = createPostRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('success')
      expect(data.sku).toBe(sku)
    }
  })

  it('should reject invalid SKU', async () => {
    const requestBody = {
      sku: 'INVALID-SKU',
      qty: 1,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'sku not found')
  })

  it('should reject missing SKU', async () => {
    const requestBody = {
      qty: 1,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'sku not found')
  })

  it('should reject missing quantity', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'invalid quantity')
  })

  it('should reject zero quantity', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      qty: 0,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'invalid quantity')
  })

  it('should reject negative quantity', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      qty: -1,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'invalid quantity')
  })

  it('should reject missing payment token', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      qty: 1
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'payment token required')
  })

  it('should reject empty payment token', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      qty: 1,
      pay_token: ''
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'payment token required')
  })

  it('should handle multiple quantities', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK',
      qty: 5,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('success')
    expect(data.qty).toBe(5)
  })

  it('should accept any payment token (for demo purposes)', async () => {
    const paymentTokens = ['demo', 'test', 'mock', 'fake-token-123']
    
    for (const token of paymentTokens) {
      const requestBody = {
        sku: 'HOODIE-BLACK',
        qty: 1,
        pay_token: token
      }
      
      const request = createPostRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('success')
    }
  })

  it('should generate unique order IDs', async () => {
    const orderIds = new Set()
    const numRequests = 5
    
    for (let i = 0; i < numRequests; i++) {
      const requestBody = {
        sku: 'HOODIE-BLACK',
        qty: 1,
        pay_token: 'demo'
      }
      
      const request = createPostRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('success')
      
      orderIds.add(data.order_id)
    }
    
    // All order IDs should be unique
    expect(orderIds.size).toBe(numRequests)
  })

  it('should handle malformed JSON gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    })
    
    // This should throw an error when trying to parse JSON
    await expect(POST(request)).rejects.toThrow()
  })

  it('should validate case sensitivity of SKUs', async () => {
    const requestBody = {
      sku: 'hoodie-black', // lowercase
      qty: 1,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error', 'sku not found')
  })

  it('should return proper response structure', async () => {
    const requestBody = {
      sku: 'HOODIE-NAVY',
      qty: 2,
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    
    // Verify all expected properties are present
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('order_id')
    expect(data).toHaveProperty('sku')
    expect(data).toHaveProperty('qty')
    expect(data).toHaveProperty('message')
    
    // Verify property types
    expect(typeof data.status).toBe('string')
    expect(typeof data.order_id).toBe('string')
    expect(typeof data.sku).toBe('string')
    expect(typeof data.qty).toBe('number')
    expect(typeof data.message).toBe('string')
  })
})