'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import PageViewer from '@/components/PageViewer'
import PaymentModal from '@/components/PaymentModal'
import LoadingAnimation from '@/components/LoadingAnimation'
import { getOrderPages, getOrderStatus, generateFullBook, fetchBook, OrderPage, Order, Book } from '@/lib/api'

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string

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
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [generatingBook, setGeneratingBook] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

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
      
      // Merge personalized pages with template placeholders
      const totalPages = orderStatus.progress?.totalPages || 4
      const viewerPages: OrderPage[] = []
      
      for (let i = 0; i < totalPages; i++) {
        const existingPage = pagesArray.find(p => p.pageNumber === i)
        
        if (existingPage) {
          // We have the personalized page
          viewerPages.push(existingPage)
        } else if (bookData?.template_data?.pages?.[i]?.template_image_url) {
          // Use template image for locked page
          viewerPages.push({
            pageNumber: i,
            imageUrl: bookData.template_data.pages[i].template_image_url,
            createdAt: null,
            isPreview: false  // Mark as locked
          })
        } else {
          // No template available, use placeholder
          viewerPages.push({
            pageNumber: i,
            imageUrl: '',
            createdAt: null,
            isPreview: false
          })
        }
      }
      
      console.log('[PreviewPage] Viewer pages with templates:', viewerPages)
      
      setPages(viewerPages)
      setOrder(orderStatus)
    } catch (err) {
      console.error('[PreviewPage] Error:', err)
      setError('Failed to load preview')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    try {
      setGeneratingBook(true)
      setGenerationProgress(0)
      setShowPaymentModal(false)

      console.log('[PreviewPage] Starting full book generation...')

      // Start generation (generation happens in background)
      await generateFullBook(orderId)

      // Poll for progress (faster interval) with timeout protection
      let pollCount = 0
      const maxPolls = 60 // 60 seconds max

      const pollOnce = async (pollInterval: ReturnType<typeof setInterval>) => {
        try {
          pollCount++

          const status = await getOrderStatus(orderId)
          console.log('[PreviewPage] Poll', pollCount, 'Status:', status.progress)

          const currentPages = status.progress?.pagesGenerated || 0
          const totalPages = status.progress?.totalPages || 1
          const progress = Math.round((currentPages / totalPages) * 100)

          setGenerationProgress(progress)

          // Check if complete
          if (status.bookComplete || currentPages >= totalPages) {
            console.log('[PreviewPage] ✅ Generation complete!')
            clearInterval(pollInterval)

            // Fetch all pages
            const allPagesResponse = await getOrderPages(orderId)
            let allPagesArray: OrderPage[] = []
            if (Array.isArray(allPagesResponse)) {
              allPagesArray = allPagesResponse
            } else if (allPagesResponse && typeof allPagesResponse === 'object') {
              allPagesArray = (allPagesResponse as any).pages || (allPagesResponse as any).data || []
            }

            setPages(allPagesArray)
            setOrder(status)
            setGeneratingBook(false)
            setGenerationProgress(0)

            // Celebrate!
            setShowCelebration(true)
            setTimeout(() => setShowCelebration(false), 3000)
            return
          }

          // Timeout protection
          if (pollCount >= maxPolls) {
            console.warn('[PreviewPage] ⚠️ Polling timeout after 60s')
            clearInterval(pollInterval)
            setGeneratingBook(false)
            alert('Generation is taking longer than expected. Please refresh the page.')
          }
        } catch (err) {
          console.error('[PreviewPage] Polling error:', err)
        }
      }

      // Start polling immediately (no initial delay)
      const pollInterval = setInterval(() => {
        void pollOnce(pollInterval)
      }, 1000)
      await pollOnce(pollInterval)
    } catch (err) {
      console.error('[PreviewPage] Payment error:', err)
      setGeneratingBook(false)
      alert('Failed to start generation. Please try again.')
    }
  }

  const isFullBookGenerated =
    !!order &&
    (order.bookComplete ||
      ((order.progress?.pagesGenerated ?? 0) >= (order.progress?.totalPages ?? Number.POSITIVE_INFINITY)) ||
      (order.pages_generated >= order.total_pages))
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
      {generatingBook && (
        <LoadingAnimation
          message="Generating your complete book..."
          progress={generationProgress}
        />
      )}

      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center max-w-md mx-4 animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-dark-blue mb-2">
              Your Book is Ready!
            </h2>
            <p className="text-gray-600">
              All pages have been personalized and are ready to download.
            </p>
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPayment={handlePayment}
        amount={39.99}
      />

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
                  Love what you see?
                </h2>
                <p className="text-gray-600 mb-6">
                  Get the complete personalized book with all {order?.total_pages || 15} pages beautifully printed and bound.
                </p>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-lg text-xl transition-colors inline-flex items-center gap-2"
                >
                  <span>Get Full Book - $39.99</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

