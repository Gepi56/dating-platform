'use client'

import Link from 'next/link'

const mockProfessionals = [
  {
    id: 'c3dcd060-39f6-4e5b-b6b5-0374e3c4c54b',
    display_name: 'Sofia',
    age: 28,
    city: 'Milano',
    bio: 'Ciao, sono Sofia. Amo l\'arte e le buone conversazioni.',
    tags: ['madrelingua', 'arte', 'disponibile oggi'],
    media: [
      { url: 'https://picsum.photos/400/300?random=1', is_cover: true }
    ],
    reviews: [
      { rating: 5 },
      { rating: 5 },
      { rating: 4 }
    ]
  },
  {
    id: 'c3dcd060-39f6-4e5b-b6b5-0374e3c4c54c',
    display_name: 'Aurora',
    age: 31,
    city: 'Roma',
    bio: 'Sono Aurora, amo viaggiare e conoscere nuove persone.',
    tags: ['business', 'en/fr', 'serate'],
    media: [
      { url: 'https://picsum.photos/400/300?random=2', is_cover: true }
    ],
    reviews: [
      { rating: 5 },
      { rating: 4 }
    ]
  }
]

export default function GrigliaProfili() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockProfessionals.map((prof) => {
        const avgRating = prof.reviews?.length
          ? (prof.reviews.reduce((acc, r) => acc + r.rating, 0) / prof.reviews.length).toFixed(1)
          : null

        const coverImage = prof.media?.find((m) => m.is_cover)?.url || prof.media?.[0]?.url

        return (
          <Link
            key={prof.id}
            href={`/profilo/${prof.id}`}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {/* Contenitore immagine con sfondo grigio */}
            <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
              {coverImage ? (
                <img
                  src={coverImage}
                  alt={prof.display_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  📷 Nessuna foto
                </div>
              )}
            </div>

            {/* Contenuto testo */}
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">{prof.display_name}</h3>
                <span className="text-gray-600">{prof.age}</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">📍 {prof.city}</p>

              {avgRating && (
                <div className="mt-2 flex items-center gap-1">
                  <span className="text-amber-500">★</span>
                  <span className="text-sm font-medium">{avgRating}</span>
                  <span className="text-xs text-gray-500">({prof.reviews.length})</span>
                </div>
              )}

              {prof.bio && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{prof.bio}</p>
              )}

              {prof.tags && prof.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {prof.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700">
                      {tag}
                    </span>
                  ))}
                  {prof.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700">
                      +{prof.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}