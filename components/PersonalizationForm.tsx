'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Character {
  label: string
  placeholder: string
  photoLabel: string
}

interface PersonalizationFormProps {
  characters: Character[]
  bookId: string
}

export default function PersonalizationForm({ characters, bookId }: PersonalizationFormProps) {
  const [formData, setFormData] = useState<Record<string, { name: string; photo: File | null }>>(
    characters.reduce((acc, char) => {
      acc[char.label] = { name: '', photo: null }
      return acc
    }, {} as Record<string, { name: string; photo: File | null }>)
  )

  const [photoPreviews, setPhotoPreviews] = useState<Record<string, string>>({})

  const handleNameChange = (label: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [label]: { ...prev[label], name: value },
    }))
  }

  const handlePhotoChange = (label: string, file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreviews(prev => ({
          ...prev,
          [label]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }

    setFormData(prev => ({
      ...prev,
      [label]: { ...prev[label], photo: file },
    }))
  }

  const isFormValid = () => {
    return characters.every(char => {
      const data = formData[char.label]
      return data.name.trim() !== '' && data.photo !== null
    })
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      // TODO: Connect to backend API
      console.log('Form submitted:', formData)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-dark-blue mb-6">Personalize Your Book</h2>

      <div className="space-y-8">
        {characters.map((character) => (
          <div key={character.label}>
            <h3 className="text-lg font-semibold text-dark-blue mb-4">{character.label}</h3>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {character.label.split("'")[0]} Name
              </label>
              <input
                type="text"
                placeholder={character.placeholder}
                value={formData[character.label]?.name || ''}
                onChange={(e) => handleNameChange(character.label, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {character.photoLabel}
              </label>
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(character.label, e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  {photoPreviews[character.label] ? (
                    <div className="relative w-32 h-32 mx-auto mb-2">
                      <Image
                        src={photoPreviews[character.label]}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-600 font-medium">Upload Photo</span>
                      <span className="text-gray-400 text-sm mt-1">Click to upload</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!isFormValid()}
        className={`w-full mt-8 py-4 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
          isFormValid()
            ? 'bg-pink-500 hover:bg-pink-600 cursor-pointer'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        <span>✨</span>
        <span>Create Avatars</span>
      </button>
    </div>
  )
}

