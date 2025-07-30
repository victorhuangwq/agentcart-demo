import { POST } from '@/app/api/buy/route'
import { NextRequest } from 'next/server'
import { PRODUCTS } from '@/app/lib/products'

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
  it('should successfully process a valid purchase with size', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK-001',
      qty: 1,
      size: 'L',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('success', true)
    expect(data).toHaveProperty('order_id')
    expect(data).toHaveProperty('sku', 'HOODIE-BLACK-001')
    expect(data).toHaveProperty('qty', 1)
    expect(data).toHaveProperty('size', 'L')
    expect(data).toHaveProperty('delivery_date')
    expect(data).toHaveProperty('total_price', 45)
    expect(data).toHaveProperty('message')
    
    expect(typeof data.order_id).toBe('string')
    expect(data.order_id).toMatch(/^ord_/)
  })

  it('should process purchases for all product types', async () => {
    const testCases = [
      { sku: 'HOODIE-BLACK-001', size: 'M' },
      { sku: 'HAT-BLACK-001', size: 'OS' },
      { sku: 'SHOES-BLACK-001', size: '10' }
    ]
    
    for (const testCase of testCases) {
      const requestBody = {
        sku: testCase.sku,
        qty: 1,
        size: testCase.size,
        pay_token: 'demo'
      }
      
      const request = createPostRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.sku).toBe(testCase.sku)
      expect(data.size).toBe(testCase.size)
    }
  })

  it('should handle SKU case insensitively', async () => {
    const requestBody = {
      sku: 'hoodie-black-001',
      qty: 1,
      size: 'L',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.sku).toBe('HOODIE-BLACK-001')
  })

  it('should require size for multi-sized products', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK-001',
      qty: 1,
      pay_token: 'demo'
      // missing size
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Size is required for this product')
    expect(data.available_sizes).toEqual(['S', 'M', 'L', 'XL', 'XXL'])
  })

  it('should auto-select size for one-size products', async () => {
    const requestBody = {
      sku: 'HAT-BLACK-001',
      qty: 1,
      pay_token: 'demo'
      // no size needed for hats
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.size).toBe('OS')
  })

  it('should reject invalid size', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK-001',
      qty: 1,
      size: 'XXXL', // not available
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Invalid size')
    expect(data.available_sizes).toEqual(['S', 'M', 'L', 'XL', 'XXL'])
  })

  it('should check inventory availability', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK-001',
      qty: 1000, // more than available
      size: 'L',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Insufficient inventory')
    expect(data).toHaveProperty('available_quantity')
  })

  it('should include email confirmation when provided', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK-001',
      qty: 1,
      size: 'L',
      pay_token: 'demo',
      email: 'customer@example.com'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.email_confirmation).toBe('Confirmation sent to customer@example.com')
  })

  it('should reject invalid SKU', async () => {
    const requestBody = {
      sku: 'INVALID-SKU',
      qty: 1,
      size: 'M',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Product not found')
  })

  it('should reject missing SKU', async () => {
    const requestBody = {
      qty: 1,
      size: 'M',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('SKU is required')
  })

  it('should reject invalid quantity', async () => {
    const quantities = [0, -1, null, undefined]
    
    for (const qty of quantities) {
      const requestBody = {
        sku: 'HOODIE-BLACK-001',
        qty,
        size: 'L',
        pay_token: 'demo'
      }
      
      const request = createPostRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid quantity')
    }
  })

  it('should reject missing payment token', async () => {
    const requestBody = {
      sku: 'HOODIE-BLACK-001',
      qty: 1,
      size: 'L'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Payment token required')
  })

  it('should calculate total price correctly', async () => {
    const requestBody = {
      sku: 'SHOES-WHITE-002',
      qty: 3,
      size: '9',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.unit_price).toBe(95)
    expect(data.total_price).toBe(285) // 95 * 3
  })

  it('should generate unique order IDs', async () => {
    const orderIds = new Set()
    const numRequests = 5
    
    for (let i = 0; i < numRequests; i++) {
      const requestBody = {
        sku: 'HAT-RED-002',
        qty: 1,
        pay_token: 'demo'
      }
      
      const request = createPostRequest(requestBody)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      
      orderIds.add(data.order_id)
    }
    
    // All order IDs should be unique
    expect(orderIds.size).toBe(numRequests)
  })

  it('should return proper response structure', async () => {
    const requestBody = {
      sku: 'HOODIE-NAVY-003',
      qty: 2,
      size: 'XL',
      pay_token: 'demo'
    }
    
    const request = createPostRequest(requestBody)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    
    // Verify all expected properties are present
    expect(data).toHaveProperty('success')
    expect(data).toHaveProperty('order_id')
    expect(data).toHaveProperty('sku')
    expect(data).toHaveProperty('product_name')
    expect(data).toHaveProperty('qty')
    expect(data).toHaveProperty('size')
    expect(data).toHaveProperty('unit_price')
    expect(data).toHaveProperty('total_price')
    expect(data).toHaveProperty('delivery_date')
    expect(data).toHaveProperty('email_confirmation')
    expect(data).toHaveProperty('message')
    
    // Verify property types
    expect(typeof data.success).toBe('boolean')
    expect(typeof data.order_id).toBe('string')
    expect(typeof data.sku).toBe('string')
    expect(typeof data.product_name).toBe('string')
    expect(typeof data.qty).toBe('number')
    expect(typeof data.size).toBe('string')
    expect(typeof data.unit_price).toBe('number')
    expect(typeof data.total_price).toBe('number')
    expect(typeof data.delivery_date).toBe('string')
    expect(typeof data.message).toBe('string')
  })

  it('should handle malformed JSON gracefully', async () => {
    const request = new NextRequest('http://localhost:3000/api/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    })
    
    // The function should handle the error and return 500
    const response = await POST(request)
    const data = await response.json()
    
    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Failed to process order')
  })
})