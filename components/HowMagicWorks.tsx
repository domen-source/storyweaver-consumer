import Image from 'next/image'

const steps = [
  {
    title: 'Upload Photo & AI Illustration',
    description: 'Simply upload a photo of your child and other family members. Our AI will automatically detect faces and create illustrated versions of everyone.',
    imageUrl: 'https://pastel-book-maker.lovable.app/assets/photo-to-illustration-By5JwIeV.png',
    imageAlt: 'Photo to illustration transformation',
  },
  {
    title: 'Choose Story',
    description: 'Choose the story you would like to see in a book. Each story is designed in a fun and educational way.',
    imageUrl: 'https://pastel-book-maker.lovable.app/assets/step-child-book-BvucgGPI.png',
    imageAlt: 'Child reading a book',
  },
  {
    title: 'Enjoy Personalized Book',
    description: 'Enjoy this uniquely personalized book and let your imagination run wild!',
    imageUrl: 'https://pastel-book-maker.lovable.app/assets/step-family-reading-6DIKk2YZ.png',
    imageAlt: 'Family reading together',
  },
]

export default function HowMagicWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-blue mb-4">
            How Magic Works
          </h2>
          <p className="text-lg text-gray-600">
            Create a personalized book in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 relative h-48">
                <Image
                  src={step.imageUrl}
                  alt={step.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-dark-blue mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

