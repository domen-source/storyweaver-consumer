import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

type CreateCheckoutBody = {
  bookTitle: string
  bookDescription?: string
  priceInCents: number
  bookId: string
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    const body = (await request.json()) as CreateCheckoutBody

    const bookTitle = (body.bookTitle || '').trim()
    const bookDescription = (body.bookDescription || '').trim()
    const priceInCents = Number(body.priceInCents)
    const bookId = (body.bookId || '').trim()

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Missing STRIPE_SECRET_KEY in environment variables.' },
        { status: 500 }
      )
    }

    if (!bookTitle) {
      return NextResponse.json({ error: 'Missing bookTitle.' }, { status: 400 })
    }

    if (!bookId) {
      return NextResponse.json({ error: 'Missing bookId.' }, { status: 400 })
    }

    if (!Number.isFinite(priceInCents) || priceInCents < 50) {
      return NextResponse.json(
        { error: 'Invalid priceInCents (must be a number in cents, e.g. 1999).' },
        { status: 400 }
      )
    }

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
              name: bookTitle,
              ...(bookDescription ? { description: bookDescription } : {}),
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],

      mode: 'payment',

      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,

      metadata: { bookId },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('❌ create-checkout-session error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to create Stripe Checkout session.' },
      { status: 500 }
    )
  }
}

