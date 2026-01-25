'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import PageViewer from '@/components/PageViewer'
import PaymentModal from '@/components/PaymentModal'
import LoadingAnimation from '@/components/LoadingAnimation'
import { getOrderPages, getOrderStatus, generateFullBook, OrderPage, Order } from '@/lib/api'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [generatingBook, setGeneratingBook] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  useEffect(() => {
    loadPreview()
  }, [orderId])

  const loadPreview = async () => {
    try {
      setLoading(true)
      
      console.log('[PreviewPage] Loading preview for order:', orderId)
      
      // Fetch pages and status
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
      
      setPages(pagesArray)
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

      // Start full book generation
      await generateFullBook(orderId)

      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const status = await getOrderStatus(orderId)
          
          console.log('[PreviewPage] Polling status:', status)
          console.log('[PreviewPage] Progress:', status.progress)
          
          // CORRECT: Access nested progress object
          const currentPages = status.progress?.pagesGenerated || 0
          const totalPages = status.progress?.totalPages || 1
          const progress = (currentPages / totalPages) * 100
          
          console.log('[PreviewPage] Progress calculation:', currentPages, '/', totalPages, '=', progress + '%')
          setGenerationProgress(Math.round(progress))

          // CORRECT: Check if complete using nested properties OR status flag
          if (status.bookComplete || currentPages >= totalPages) {
            console.log('[PreviewPage] Book generation complete! Fetching all pages...')
            clearInterval(pollInterval)
            
            // Refetch ALL pages (including the newly generated one)
            const allPagesResponse = await getOrderPages(orderId)
            console.log('[PreviewPage] All pages response after completion:', allPagesResponse)
            
            let allPagesArray: OrderPage[] = []
            if (Array.isArray(allPagesResponse)) {
              allPagesArray = allPagesResponse
            } else if (allPagesResponse && typeof allPagesResponse === 'object') {
              const resp = allPagesResponse as any
              allPagesArray = resp.pages || resp.data || []
            }
            
            console.log('[PreviewPage] Setting pages to:', allPagesArray.length, 'pages')
            setPages(allPagesArray)
            setOrder(status)  // Update order state too
            setGeneratingBook(false)
            setGenerationProgress(0)
          }
        } catch (err) {
          console.error('[PreviewPage] Error polling status:', err)
        }
      }, 2000)

      // Safety timeout after 60 seconds
      setTimeout(() => {
        clearInterval(pollInterval)
        if (generatingBook) {
          setGeneratingBook(false)
          alert('Generation is taking longer than expected. Please refresh the page.')
        }
      }, 60000)
    } catch (err) {
      console.error('Error:', err)
      setGeneratingBook(false)
      alert('Failed to generate full book. Please try again.')
    }
  }

  const isFullBookGenerated = order && order.pages_generated >= order.total_pages
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

