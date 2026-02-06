import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const { orderId, bookTitle, bookCode, priceInCents } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing required field: orderId' },
        { status: 400 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      // ✅ Little Booky branding (new logo)
      branding_settings: {
        display_name: 'Little Booky',
        logo: {
          type: 'url',
          url: 'https://i.ibb.co/qMzpFQcL/Little-Booky-By-BB-logo-black.png',
        },
      },

      payment_method_types: ['card'],

      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: bookTitle || 'Personalized Storybook',
              description: 'Your complete personalized storybook with all pages',
            },
            unit_amount: priceInCents || 3999, // Default $39.99
          },
          quantity: 1,
        },
      ],

      mode: 'payment',

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${origin}/preview/${orderId}`,

      metadata: {
        orderId,
        bookCode: bookCode || '',
        flow: 'preview',
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (err) {
    console.error('❌ Error creating preview checkout session:', err)
    return NextResponse.json(
      { error: 'Error creating preview checkout session' },
      { status: 500 }
    )
  }
}

