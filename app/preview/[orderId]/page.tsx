'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import BackButton from '@/components/BackButton'
import PageViewer from '@/components/PageViewer'
import { getOrderPages, getOrderStatus, fetchBook, OrderPage, Order, Book } from '@/lib/api'

export default function PreviewPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const orderId = params.orderId as string
  const isUnlocked = searchParams.get('unlocked') === 'true'

  // Validate order ID (should be UUID string, not truncated number)
  console.log('[PreviewPage] Order ID:', orderId)
  console.log('[PreviewPage] Order ID length:', orderId?.length)
  
  if (!orderId || orderId.length < 30) {
    console.error('[PreviewPage] Invalid order ID:', orderId)
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Order ID</h1>
          <p className="text-gray-600 mb-6">The order ID is invalid or missing.</p>
          <BackButton />
        </div>
      </div>
    )
  }

  const [pages, setPages] = useState<OrderPage[]>([])
  const [order, setOrder] = useState<Order | null>(null)
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    loadPreview()
  }, [orderId])

  const loadPreview = async () => {
    try {
      setLoading(true)
      
      console.log('[PreviewPage] Loading preview for order:', orderId)
      
      // Fetch pages and status first
      const [pagesResponse, orderStatus] = await Promise.all([
        getOrderPages(orderId),
        getOrderStatus(orderId)
      ])
      
      console.log('[PreviewPage] Pages response:', pagesResponse)
      console.log('[PreviewPage] Order status:', orderStatus)
      
      // Handle different response formats
      let pagesArray: OrderPage[] = []
      
      if (Array.isArray(pagesResponse)) {
        // Direct array
        pagesArray = pagesResponse
      } else if (pagesResponse && typeof pagesResponse === 'object') {
        // Object with pages property
        const resp = pagesResponse as any
        pagesArray = resp.pages || resp.data || []
      }
      
      console.log('[PreviewPage] Extracted pages array:', pagesArray)
      
      // Fetch book data to get template images for locked pages
      let bookData: Book | null = null
      if (orderStatus.bookCode) {
        try {
          bookData = await fetchBook(orderStatus.bookCode)
          console.log('[PreviewPage] Book data:', bookData)
          setBook(bookData)
        } catch (bookErr) {
          console.warn('[PreviewPage] Could not fetch book data:', bookErr)
        }
      }
      
      // For preview, only show first 4 pages (3 unlocked + 1 locked)
      const previewPageCount = 4
      const viewerPages: OrderPage[] = []
      
      for (let i = 0; i < previewPageCount; i++) {
        const existingPage = pagesArray.find(p => p.pageNumber === i)
        
        if (existingPage) {
          // We have the personalized page
          // Mark first 3 pages as preview (unlocked), 4th as locked
          viewerPages.push({
            ...existingPage,
            isPreview: i < 3  // First 3 pages unlocked, 4th locked
          })
        } else if (bookData?.template_data?.pages?.[i]?.template_image_url) {
          // Use template image
          viewerPages.push({
            pageNumber: i,
            imageUrl: bookData.template_data.pages[i].template_image_url,
            createdAt: null,
            isPreview: i < 3  // First 3 pages unlocked, 4th locked
          })
        } else {
          // No template available, use placeholder
          viewerPages.push({
            pageNumber: i,
            imageUrl: '',
            createdAt: null,
            isPreview: i < 3
          })
        }
      }
      
      console.log('[PreviewPage] Viewer pages (4 total, 3 unlocked):', viewerPages)
      
      setPages(viewerPages)
      setOrder(orderStatus)
    } catch (err) {
      console.error('[PreviewPage] Error:', err)
      setError('Failed to load preview')
    } finally {
      setLoading(false)
    }
  }

  const handleStripeCheckout = async () => {
    try {
      setIsProcessingPayment(true)

      console.log('[PreviewPage] Creating Stripe checkout session...')

      const response = await fetch('/api/create-preview-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          bookTitle: book?.title || 'Personalized Storybook',
          bookCode: order?.bookCode || book?.publication_code,
          priceInCents: 4499,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()

      if (!url) {
        throw new Error('No checkout URL returned')
      }

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err) {
      console.error('[PreviewPage] Checkout error:', err)
      setIsProcessingPayment(false)
      alert('Failed to start checkout. Please try again.')
    }
  }

  // Book is considered "full" if unlocked via payment or if generation is complete
  const isFullBookGenerated =
    isUnlocked ||
    (!!order &&
      (order.bookComplete ||
        ((order.progress?.pagesGenerated ?? 0) >= (order.progress?.totalPages ?? Number.POSITIVE_INFINITY)) ||
        (order.pages_generated >= order.total_pages)))
  const viewerPages = pages || []

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <BackButton />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BackButton />

          <div className="text-center mt-6 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
              {isFullBookGenerated ? 'Your Complete Book' : 'Book Preview'}
            </h1>
            {!isFullBookGenerated && (
              <p className="text-lg text-gray-600 mb-6">
                Here's a preview of your personalized book. Get the full version to see all pages!
              </p>
            )}

            {isFullBookGenerated && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 inline-block mb-6">
                <p className="text-green-700 font-semibold">
                  ✓ Your book is ready! Download all pages below.
                </p>
              </div>
            )}
          </div>

          <PageViewer pages={viewerPages} isPreview={!isFullBookGenerated} />

          {!isFullBookGenerated && (
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-dark-blue mb-4">
                  This story is already theirs💛
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  The full story includes all <strong>26 beautifully illustrated pages</strong>, capturing playful moments, quiet routines, and loving connections they'll want to return to again and again.
                </p>
                {isProcessingPayment ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#B5C9A8] border-t-[#6B8F5E] rounded-full animate-spin"></div>
                    <p className="text-gray-600">Redirecting to secure checkout...</p>
                  </div>
                ) : (
                  <button
                    onClick={handleStripeCheckout}
                    className="bg-[#6B8F5E] hover:bg-[#5A7F4D] text-white font-bold py-4 px-12 rounded-lg text-xl transition-colors"
                  >
                    Get the Complete Personalized Book
                  </button>
                )}
                <div className="flex items-center justify-center gap-2 mt-4 mb-6">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-gray-500">
                    Secure payment powered by Stripe
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                  <span>★ Printed & bound in the USA</span>
                  <span>★ Made uniquely for your family</span>
                  <span>★ Loved by parents & kids</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

