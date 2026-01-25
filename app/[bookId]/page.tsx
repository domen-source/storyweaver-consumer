import { notFound } from 'next/navigation'
import BookDetail from '@/components/BookDetail'
import BackButton from '@/components/BackButton'

const bookData: Record<string, any> = {
  'worlds-greatest-dad': {
    title: "The World's Greatest Dad",
    subtitle: 'A Day of Adventures',
    badge: "#1 Book in the US for Dads",
    description: "Design the avatars of your little one and your partner, and let them embark on an amazing adventure through everyday life together! This is the book for the best dad in the world!",
    price: '$39.99',
    features: [
      '⭐ Perfect Personalized Gift for Him',
      '⭐ Create the Book in Minutes, We\'ll Deliver it Within Days. Made in the USA.',
    ],
    details: [
      '• Appropriate for all ages',
      '• 15 Pages',
      '• Hard Binding',
      '• Format: 12 in. x 12 in. square',
    ],
    coverImage: 'https://pastel-book-maker.lovable.app/assets/daddy-loves-you-liam-QTFP0S6g.png',
    previewImages: [
      'https://pastel-book-maker.lovable.app/assets/daddy-loves-you-liam-QTFP0S6g.png',
      'https://pastel-book-maker.lovable.app/assets/daddy-loves-you-liam-QTFP0S6g.png',
      'https://pastel-book-maker.lovable.app/assets/daddy-loves-you-liam-QTFP0S6g.png',
      'https://pastel-book-maker.lovable.app/assets/daddy-loves-you-liam-QTFP0S6g.png',
    ],
    characters: [
      { label: "Dad's Name", placeholder: "Enter dad's name", photoLabel: "Dad's Photo" },
      { label: "Child's Name", placeholder: "Enter child's name", photoLabel: "Child's Photo" },
    ],
  },
  'two-goodest-pups': {
    title: 'Your Two Goodest Pups',
    subtitle: 'Double the Love',
    badge: "#1 Book in the US for Pets",
    description: 'Celebrate your furry best friends with a personalized storybook featuring your adorable pets.',
    price: '$39.99',
    features: [
      '⭐ Perfect Personalized Gift for Siblings',
      '⭐ Create the Book in Minutes, We\'ll Deliver it Within Days. Made in the USA.',
    ],
    details: [
      '• Appropriate for all ages',
      '• 15 Pages',
      '• Hard Binding',
      '• Format: 12 in. x 12 in. square',
    ],
    coverImage: 'https://pastel-book-maker.lovable.app/assets/wonderful-day-zoo-CWjRnShn.png',
    previewImages: [],
    characters: [
      { label: "Pet 1's Name", placeholder: "Enter pet's name", photoLabel: "Pet 1's Photo" },
      { label: "Pet 2's Name", placeholder: "Enter pet's name", photoLabel: "Pet 2's Photo" },
    ],
  },
  'family-story': {
    title: 'Our Family Story',
    subtitle: 'Celebrate Your Family',
    badge: "#1 Book in the US for Families",
    description: 'Create a heartwarming family storybook that captures your special moments together.',
    price: '$39.99',
    features: [
      '⭐ Perfect Personalized Gift for Grandparents',
      '⭐ Create the Book in Minutes, We\'ll Deliver it Within Days. Made in the USA.',
    ],
    details: [
      '• Appropriate for all ages',
      '• 15 Pages',
      '• Hard Binding',
      '• Format: 12 in. x 12 in. square',
    ],
    coverImage: 'https://pastel-book-maker.lovable.app/assets/basketball-superstar-CTTyUI_w.png',
    previewImages: [],
    characters: [
      { label: "Parent's Name", placeholder: "Enter parent's name", photoLabel: "Parent's Photo" },
      { label: "Child's Name", placeholder: "Enter child's name", photoLabel: "Child's Photo" },
    ],
  },
}

export default function BookPage({ params }: { params: { bookId: string } }) {
  const book = bookData[params.bookId]

  if (!book) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pastel-blue to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />
        <BookDetail book={book} bookId={params.bookId} />
      </div>
    </main>
  )
}

