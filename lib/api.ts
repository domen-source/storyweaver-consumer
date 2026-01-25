const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

// Log API URL on module load
if (typeof window !== 'undefined') {
  console.log('[API] Initialized with URL:', API_URL)
  console.log('[API] Environment variable:', process.env.NEXT_PUBLIC_API_URL)
}

// Utility function to convert cents to dollar string
export function formatPrice(priceCents: number): string {
  return (priceCents / 100).toFixed(2)
}

// API Response Types
interface BooksResponse {
  books: Book[]
}

interface BookResponse {
  book: Book
}

export interface Book {
  id: string  // UUID from backend
  publication_code: string
  title: string
  subtitle: string
  description: string
  price_cents: number  // Price in cents (e.g., 3999 = $39.99)
  preview_image_url: string  // Main cover image
  detail_images: string[]  // Array of detail/preview images
  template_data: {
    characters: Array<{
      name: string
      display_name: string
      description: string
    }>  // May be empty - use pages.character_roles instead
    pages: Array<{
      character_roles?: string[]  // e.g., ["parent", "child"]
      [key: string]: any
    }>
  }
  is_active: boolean
}

export interface OrderCharacter {
  role: string
  stylized_avatar_url?: string
  avatar_url?: string
  original_photo_url?: string
}

export interface OrderCharactersMapEntry {
  stylized_avatar_url?: string
  avatar_url?: string
  original_photo_url?: string
}

export type OrderCharactersMap = Record<string, OrderCharactersMapEntry>

export interface Order {
  id: string | number  // UUID string from API, or number
  order_number: string
  book_id: string  // UUID
  bookCode?: string  // Publication code to fetch book details
  status: string
  characters_data?: Record<string, {
    stylized_avatar_url?: string
    avatar_url?: string
    original_photo_url?: string
    role?: string
  }> | null
  // Backend has returned multiple shapes over time; support both:
  // - array: [{ role, stylized_avatar_url, ... }]
  // - map:  { parent: { stylized_avatar_url, ... }, child: { ... } }
  characters?: OrderCharacter[] | OrderCharactersMap
  avatars_generated: boolean
  preview_generated: boolean
  pages_generated: number
  total_pages: number
  // Progress tracking (nested object)
  progress?: {
    pagesGenerated: number
    totalPages: number
  }
  bookComplete?: boolean
}

export interface OrderPage {
  pageNumber: number
  imageUrl: string
  createdAt: string | null
  isPreview?: boolean
}

// Fetch all books
export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(`${API_URL}/api/public/books`)
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to fetch books: ${response.status} ${errorText}`)
  }
  const data: BooksResponse = await response.json()
  // API returns { books: [...] } so we need to extract the array
  return data.books || []
}

// Fetch single book by publication code
export async function fetchBook(publicationCode: string): Promise<Book> {
  console.log('[fetchBook] Fetching book with code:', publicationCode)
  console.log('[fetchBook] API URL:', API_URL)
  console.log('[fetchBook] Full URL:', `${API_URL}/api/public/books/${publicationCode}`)
  
  const response = await fetch(`${API_URL}/api/public/books/${publicationCode}`)
  console.log('[fetchBook] Response status:', response.status, response.statusText)
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('[fetchBook] Error response:', errorText)
    throw new Error(`Failed to fetch book: ${response.status} ${errorText}`)
  }
  
  const data: BookResponse = await response.json()
  console.log('[fetchBook] Data received:', data)
  console.log('[fetchBook] Extracted book:', data.book)
  
  // API returns { book: {...} } so we need to extract the book object
  if (!data.book) {
    console.error('[fetchBook] No book property in response:', data)
    throw new Error('Invalid response format: missing book property')
  }
  
  return data.book
}

// Helper function to POST order creation
async function postCreateOrder(body: Record<string, unknown>): Promise<Order> {
  console.log('[createOrder] POST body:', body)

  const response = await fetch(`${API_URL}/api/public/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const text = await response.text()
  console.log('[createOrder] Response status:', response.status)
  console.log('[createOrder] Response body:', text)

  if (!response.ok) {
    // IMPORTANT: include backend message so we know what's wrong
    throw new Error(`Failed to create order: ${response.status} - ${text}`)
  }

  // API returns: { success: true, orderId: "uuid", status: "pending" }
  const data = text ? JSON.parse(text) : null
  console.log('[createOrder] Parsed response data:', data)

  if (!data || !data.orderId) {
    throw new Error('Invalid order response: missing orderId')
  }

  // Construct Order object from API response
  // API returns: { success: true, orderId: "uuid-string", status: "pending" }
  const order: Order = {
    id: data.orderId, // API returns UUID string
    order_number: data.orderId, // Use orderId as order_number
    book_id: body.bookCode as string || '', // Not returned by API, use from request
    status: data.status || 'pending',
    characters_data: null,
    avatars_generated: false,
    preview_generated: false,
    pages_generated: 0,
    total_pages: 0,
  }

  console.log('[createOrder] Created order object:', order)
  console.log('[createOrder] Order ID:', order.id)
  return order
}

// Create order - supports bookCode (backend expects this format)
export async function createOrder(opts: { 
  bookId?: string; 
  bookCode?: string;
  customerEmail?: string;
}): Promise<Order> {
  console.log('[createOrder] Options:', opts)

  // Backend expects "bookCode" with the publication code (e.g., "BOOK_1769178064160")
  const bookCodeToSend = opts.bookCode || opts.bookId
  
  if (!bookCodeToSend) {
    throw new Error('createOrder requires { bookCode } or { bookId }')
  }

  // Backend requires customerEmail - use placeholder if not provided
  const customerEmail = opts.customerEmail || 'demo@example.com'
  
  return await postCreateOrder({ 
    bookCode: bookCodeToSend,
    customerEmail: customerEmail
  })
}

// Upload photo
export async function uploadPhoto(
  orderId: string | number,
  characterName: string,
  file: File
): Promise<{ message: string; photo_url: string }> {
  const formData = new FormData()
  formData.append('photo', file)
  formData.append('role', characterName)

  const response = await fetch(`${API_URL}/api/public/orders/${orderId}/upload-photo`, {
    method: 'POST',
    body: formData,
  })
  if (!response.ok) throw new Error('Failed to upload photo')
  return response.json()
}

// Generate avatars
export async function generateAvatars(orderId: string | number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/public/orders/${orderId}/generate-avatars`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to generate avatars')
  return response.json()
}

// Generate preview
export async function generatePreview(orderId: string | number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/public/orders/${orderId}/generate-preview`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to generate preview')
  return response.json()
}

// Get order status
export async function getOrderStatus(orderId: string | number): Promise<Order> {
  const response = await fetch(`${API_URL}/api/public/orders/${orderId}/status`)
  if (!response.ok) throw new Error('Failed to fetch order status')
  return response.json()
}

// Get order pages
export async function getOrderPages(orderId: string | number): Promise<OrderPage[]> {
  const response = await fetch(`${API_URL}/api/public/orders/${orderId}/pages`)
  if (!response.ok) throw new Error('Failed to fetch pages')
  const data = await response.json()
  // Normalize response: handle { pages: [...] }, { data: [...] }, or direct array
  const rawPages: any[] = Array.isArray(data) ? data : (data?.pages || data?.data || [])

  if (!Array.isArray(rawPages)) return []

  // Normalize property names to match API (camelCase), with fallbacks for older shapes.
  return rawPages.map((p, idx): OrderPage => {
    const pageNumber = (p?.pageNumber ?? p?.page_number ?? idx) as number
    const imageUrl = (p?.imageUrl ?? p?.image_url ?? '') as string
    const createdAt = (p?.createdAt ?? p?.created_at ?? null) as string | null
    const isPreview = (p?.isPreview ?? p?.is_preview ?? undefined) as boolean | undefined

    return { pageNumber, imageUrl, createdAt, isPreview }
  })
}

// Generate full book
export async function generateFullBook(orderId: string | number): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/api/public/orders/${orderId}/generate-pages`, {
    method: 'POST',
  })
  if (!response.ok) throw new Error('Failed to generate full book')
  return response.json()
}

