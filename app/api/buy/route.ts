import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { sku, qty, pay_token } = await req.json()

  const validSkus = ['HOODIE-BLACK', 'HOODIE-GRAY', 'HOODIE-NAVY']
  if (!validSkus.includes(sku))
    return NextResponse.json({ error: 'sku not found' }, { status: 400 })

  if (!qty || qty < 1)
    return NextResponse.json({ error: 'invalid quantity' }, { status: 400 })

  if (!pay_token)
    return NextResponse.json({ error: 'payment token required' }, { status: 400 })

  // Pretend we charged the card 😉
  const orderId = `ord_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`
  return NextResponse.json({ 
    status: 'success', 
    order_id: orderId,
    sku,
    qty,
    message: 'Order placed successfully!'
  })
}