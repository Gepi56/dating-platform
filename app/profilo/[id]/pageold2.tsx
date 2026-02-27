import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default async function ProfiloPage({ params }: PageProps) {
  const { id } = params

  // Recupera professionista con media e recensioni
  const { data: professional, error } = await supabase
    .from('professionals')
    .select(`
      *,
      media ( url, is_cover ),
      reviews ( rating, comment, created_at )
    `)
    .eq('id', id)
    .single()

  if (error || !professional) {
    notFound()
  }

  // Calcolo media recensioni
  const avgRating = professional.reviews?.length
    ? (professional.reviews.reduce((acc, r) => acc + r.rating, 0) / professional.reviews.length).toFixed(1)
    : null

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intestazione */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{professional.display_name}, {professional.age}</h1>
        <p className="text-xl text-gray-600">{professional.city}</p>
        {avgRating && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-amber-500 text-2xl">★</span>
            <span className="text-2xl font-semibold">{avgRating}</span>
            <span className="text-gray-500">({professional.reviews.length} recensioni)</span>
          </div>
        )}
      </div>

      {/* Galleria (placeholder) */}
      {professional.media && professional.media.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Galleria</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {professional.media.map((media, idx) => (
              <div key={idx} className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                <img src={media.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-12 aspect-[4/3] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
          📷 Nessuna foto
        </div>
      )}

      {/* Bio */}
      {professional.bio && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Chi sono</h2>
          <p className="text-gray-700 whitespace-pre-line">{professional.bio}</p>
        </div>
      )}

      {/* Tag */}
      {professional.tags && professional.tags.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Interessi</h2>
          <div className="flex flex-wrap gap-2">
            {professional.tags.map((tag) => (
              <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recensioni */}
      {professional.reviews && professional.reviews.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Recensioni</h2>
          <div className="space-y-4">
            {professional.reviews.map((review, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500">★ {review.rating}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.created_at).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottone chat (placeholder) */}
      <div className="fixed bottom-8 right-8">
        <Link
          href="#"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-full shadow-lg hover:scale-105 transition"
        >
          Chatta in anonimo
        </Link>
      </div>
    </main>
  )
}