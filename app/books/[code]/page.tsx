'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import LoadingAnimation from '@/components/LoadingAnimation'
import { fetchBook, createOrder, uploadPhoto, generateAvatars, generatePreview, getOrderStatus, formatPrice, Book, Order } from '@/lib/api'

export default function BookPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string

  const [book, setBook] = useState<Book | null>(null)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Upload states
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, { file: File; url: string; uploaded: boolean }>>({})
  const [uploading, setUploading] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState<{ show: boolean; message: string; subtext?: string } | null>(null)
  
  // Character names state
  const [characterNames, setCharacterNames] = useState<Record<string, string>>({})
  
  // Avatar approval states
  const [avatars, setAvatars] = useState<Record<string, string> | null>(null)
  const [showAvatarApproval, setShowAvatarApproval] = useState(false)
  
  // Selected hero image state
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)

  useEffect(() => {
    loadBookAndCreateOrder()
  }, [code])

  const loadBookAndCreateOrder = async () => {
    try {
      console.log('[BookPage] Loading book with code:', code)
      setLoading(true)
      setError(null)
      
      console.log('[BookPage] Fetching book...')
      const bookData = await fetchBook(code)
      console.log('[BookPage] Book fetched successfully:', bookData.title)
      console.log('[BookPage] Book data:', JSON.stringify(bookData, null, 2))
      console.log('[BookPage] Preview image URL:', bookData.preview_image_url)
      console.log('[BookPage] Detail images:', bookData.detail_images)
      console.log('[BookPage] Template data:', bookData.template_data)
      console.log('[BookPage] Character roles from pages:', 
        [...new Set(bookData.template_data.pages.flatMap(p => p.character_roles || []))])
      setBook(bookData)

      // Create order
      console.log('[BookPage] Creating order for book:', { 
        id: bookData.id, 
        publication_code: bookData.publication_code 
      })
      // Backend expects "bookCode" with the publication code value
      const orderData = await createOrder({ 
        bookCode: bookData.publication_code
      })
      console.log('[BookPage] Order created:', orderData.order_number)
      setOrder(orderData)
      
      console.log('[BookPage] Book and order loaded successfully')
    } catch (err) {
      console.error('[BookPage] Error loading book:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to load book'
      console.error('[BookPage] Error message:', errorMessage)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoSelect = async (characterName: string, file: File) => {
    if (!order) return

    const url = URL.createObjectURL(file)
    setUploadedPhotos(prev => ({
      ...prev,
      [characterName]: { file, url, uploaded: false }
    }))

    // Upload immediately
    try {
      setUploading(characterName)
      await uploadPhoto(order.id, characterName, file)
      setUploadedPhotos(prev => ({
        ...prev,
        [characterName]: { ...prev[characterName], uploaded: true }
      }))
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload photo. Please try again.')
      setUploadedPhotos(prev => {
        const newState = { ...prev }
        delete newState[characterName]
        return newState
      })
    } finally {
      setUploading(null)
    }
  }

  const handleNameChange = (characterName: string, name: string) => {
    setCharacterNames(prev => ({
      ...prev,
      [characterName]: name
    }))
  }

  const allPhotosUploaded = () => {
    if (!book) return false
    const roles = [...new Set(
      book.template_data.pages.flatMap(p => p.character_roles || [])
    )]
    return roles.every(role => uploadedPhotos[role]?.uploaded)
  }

  const allNamesEntered = () => {
    if (!book) return false
    const roles = [...new Set(
      book.template_data.pages.flatMap(p => p.character_roles || [])
    )]
    return roles.every(role =>
      characterNames[role] && characterNames[role].trim().length > 0
    )
  }

  const canGenerateAvatars = () => {
    return allPhotosUploaded() && allNamesEntered()
  }

  const handleGenerateAvatars = async () => {
    if (!order) return

    try {
      setLoadingState({ show: true, message: 'Creating your characters...' })
      
      // Trigger avatar generation
      await generateAvatars(order.id)

      // Backend waits for completion before returning; fetch status immediately (no artificial delay)
      const orderStatus = await getOrderStatus(order.id)
      console.log('[BookPage] Order status after generation:', orderStatus)
      
      // Extract avatar URLs from order_characters
      const avatarUrls: Record<string, string> = {}

      // Format 0: characters object map (new status response shape)
      if (
        orderStatus.characters &&
        !Array.isArray(orderStatus.characters) &&
        typeof orderStatus.characters === 'object'
      ) {
        Object.entries(orderStatus.characters as Record<string, any>).forEach(([role, data]) => {
          const url = data?.stylized_avatar_url || data?.avatar_url
          if (url) {
            avatarUrls[role] = url
          }
        })
      }
      
      // Format 1: characters_data object
      if (orderStatus.characters_data) {
        Object.entries(orderStatus.characters_data).forEach(([role, data]: [string, any]) => {
          // Check for stylized_avatar_url first, then avatar_url
          const url = data?.stylized_avatar_url || data?.avatar_url
          if (url) {
            avatarUrls[role] = url
          }
        })
      }
      
      // Format 2: characters array (if API returns this)
      if (orderStatus.characters && Array.isArray(orderStatus.characters)) {
        orderStatus.characters.forEach((char) => {
          const url = char.stylized_avatar_url || char.avatar_url
          if (char.role && url) {
            avatarUrls[char.role] = url
          }
        })
      }
      
      console.log('[BookPage] Extracted avatars:', avatarUrls)
      
      if (Object.keys(avatarUrls).length > 0) {
        setAvatars(avatarUrls)
        setShowAvatarApproval(true)
        setLoadingState(null)
      } else {
        // If we can't get avatars, proceed anyway with empty avatars
        console.warn('[BookPage] No avatar URLs found, proceeding with approval screen')
        setAvatars({})
        setShowAvatarApproval(true)
        setLoadingState(null)
      }
    } catch (err) {
      console.error('Error generating avatars:', err)
      setLoadingState(null)
      alert('Failed to generate avatars. Please try again.')
    }
  }

  const handleApproveAvatars = async () => {
    if (!order) return

    try {
      setLoadingState({ 
        show: true, 
        message: 'Creating the pages of your book...', 
        subtext: "We're putting your characters in a book so you'll see how it would look ❤️. This process may take about 30 seconds, hang on tight!"
      })
      await generatePreview(order.id)

      // Backend waits for completion before returning; navigate immediately (no artificial delay)
      setLoadingState(null)
      // Use full UUID string for navigation
      router.push(`/preview/${order.id}`)
    } catch (err) {
      console.error('Error:', err)
      setLoadingState(null)
      alert('Failed to generate preview. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error || 'Book not found'}</p>
          <BackButton />
        </div>
      </div>
    )
  }

  return (
    <>
      {loadingState?.show && <LoadingAnimation message={loadingState.message} subtext={loadingState.subtext} />}
      
      <div className="min-h-screen bg-gradient-to-b from-pastel-blue to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BackButton />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-6">
            {/* Left Column - Book Preview */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-dark-blue mb-2">
                {book.title === "Father&Child w Cover" ? "Your Daddy loves you, Liam!" : book.title}
              </h1>
              {book.subtitle && (
                <p className="text-xl text-gray-600 mb-6">{book.subtitle}</p>
              )}

              {/* Hero Image - Large Book Cover */}
              <div className="relative mb-6 bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={selectedImageUrl || book.preview_image_url}
                  alt={book.title}
                  className="w-full h-auto object-contain rounded-lg"
                  style={{ maxHeight: '400px' }}
                  onError={(e) => {
                    console.error('[BookPage] Image failed to load:', selectedImageUrl || book.preview_image_url)
                    e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Book+Cover'
                    e.currentTarget.onerror = null // Prevent infinite loop
                  }}
                />
              </div>

              {/* Detail Images Carousel */}
              {(() => {
                // Combine cover image with detail images, avoiding duplicates
                const allImages = [book.preview_image_url, ...(book.detail_images || [])].filter(
                  (img, index, arr) => img && arr.indexOf(img) === index
                )
                if (allImages.length === 0) return null
                return (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-dark-blue mb-3">Book Preview</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {allImages.slice(0, 5).map((img, i) => {
                        const isSelected = selectedImageUrl === img || (!selectedImageUrl && i === 0)
                        return (
                          <div key={i} className="flex-shrink-0">
                            <img
                              src={img}
                              alt={`${book.title} preview ${i + 1}`}
                              className={`w-32 h-32 object-cover rounded-lg border-2 transition-colors cursor-pointer shadow-sm ${
                                isSelected ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onError={(e) => {
                                console.error('[BookPage] Preview image failed to load:', img)
                                e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Preview'
                                e.currentTarget.onerror = null
                              }}
                              onClick={() => setSelectedImageUrl(img)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}

              {/* Description */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-lg text-dark-blue mb-3">About This Book</h3>
                <p className="text-gray-700 mb-4">{book.description}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Appropriate for all ages</p>
                  <p>• 15 Pages</p>
                  <p>• Hard Binding</p>
                  <p>• Format: 12 in. x 12 in. square</p>
                </div>
              </div>
            </div>

            {/* Right Column - Upload Form */}
            <div>
              <div className="bg-white rounded-lg p-8 shadow-lg sticky top-8">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-600">
                    Price: ${formatPrice(book.price_cents)}
                  </p>
                </div>

                <h2 className="text-2xl font-bold text-dark-blue mb-6">Personalize Your Book</h2>

                {/* Avatar Approval Screen */}
                {showAvatarApproval && avatars !== null && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-dark-blue mb-2">Your Characters</h3>
                      <p className="text-gray-600">
                        Here are your personalized characters! Click continue to preview your book.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(avatars).length > 0 ? (
                        Object.entries(avatars).map(([role, avatarUrl]) => (
                          <div key={role} className="text-center">
                            <img 
                              src={avatarUrl} 
                              alt={role}
                              className="w-full h-48 object-cover rounded-lg border-2 border-blue-500 shadow-md"
                              onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/200x200?text=Avatar'
                                e.currentTarget.onerror = null
                              }}
                            />
                            <p className="mt-2 font-semibold capitalize text-dark-blue">{role}</p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-8">
                          <div className="inline-block p-4 bg-blue-50 rounded-lg">
                            <p className="text-gray-600 mb-2">✨ Your characters are ready!</p>
                            <p className="text-sm text-gray-500">Click below to preview your book</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleApproveAvatars}
                      className="w-full py-4 px-6 rounded-lg font-semibold bg-pink-500 hover:bg-pink-600 text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <span>✨</span>
                      <span>Looks Good! Generate Preview</span>
                    </button>
                  </div>
                )}

                {/* Upload Form (hidden when showing avatar approval) */}
                {!showAvatarApproval && (
                  <>
                    <div className="space-y-6">
                      {(() => {
                        // Extract unique character roles from pages
                        const roles = [...new Set(
                          book.template_data.pages.flatMap(p => p.character_roles || [])
                        )]
                        
                        return roles.map((role) => {
                          const displayName = role.charAt(0).toUpperCase() + role.slice(1)
                          const photoData = uploadedPhotos[role]
                          const isUploading = uploading === role
                          const characterName = characterNames[role] || ''

                          return (
                            <div key={role} className="border-2 border-gray-200 rounded-lg p-4">
                              <h3 className="font-semibold text-lg text-dark-blue mb-2">
                                {displayName}'s Details
                              </h3>

                              {/* Name Input */}
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {displayName}'s Name
                                </label>
                                <input
                                  type="text"
                                  value={characterName}
                                  onChange={(e) => handleNameChange(role, e.target.value)}
                                  placeholder={`Enter ${displayName.toLowerCase()}'s name`}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                              </div>

                              {/* Photo Upload */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {displayName}'s Photo
                                </label>
                                <label className="block cursor-pointer">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0]
                                      if (file) handlePhotoSelect(role, file)
                                    }}
                                    className="hidden"
                                    disabled={isUploading}
                                  />

                                  {photoData ? (
                                    <div className="relative inline-block">
                                      <div className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-green-500">
                                        <img
                                          src={photoData.url}
                                          alt={displayName}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      {photoData.uploaded && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                                      {isUploading ? (
                                        <div className="flex flex-col items-center">
                                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
                                          <span className="text-sm text-gray-600">Uploading...</span>
                                        </div>
                                      ) : (
                                        <>
                                          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                          </svg>
                                          <span className="text-sm text-gray-600">Click to upload photo</span>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </label>
                              </div>
                            </div>
                          )
                        })
                      })()}
                    </div>

                    <button
                      onClick={handleGenerateAvatars}
                      disabled={!canGenerateAvatars()}
                      className={`w-full mt-8 py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                        canGenerateAvatars()
                          ? 'bg-pink-500 hover:bg-pink-600 text-white cursor-pointer'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span>✨</span>
                      <span>Generate Avatars & Preview</span>
                    </button>

                    {!canGenerateAvatars() && (
                      <p className="text-sm text-center text-gray-500 mt-2">
                        {!allPhotosUploaded() && !allNamesEntered() 
                          ? 'Upload all photos and enter all names to continue'
                          : !allPhotosUploaded()
                          ? 'Upload all photos to continue'
                          : 'Enter all names to continue'
                        }
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

