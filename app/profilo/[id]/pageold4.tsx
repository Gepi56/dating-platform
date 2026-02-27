import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProfiloPage({ params }: Props) {
  const { id } = await params

  // Query principale
  const { data: professional, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !professional) {
    notFound()
  }

  // Recensioni
  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating, comment, created_at')
    .eq('to_id', id)

  const avgRating = reviews?.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Layout a due colonne su desktop, una su mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Colonna sinistra: immagine (più piccola) */}
        <div className="md:col-span-1">
          <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center sticky top-24">
            <span className="text-8xl text-white font-bold">
              {professional.display_name.charAt(0)}
            </span>
          </div>
        </div>

        {/* Colonna destra: informazioni */}
        <div className="md:col-span-2 space-y-6">
          {/* Intestazione con nome e città */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              {professional.display_name}, {professional.age}
            </h1>
            <p className="text-xl text-gray-600 mt-1">{professional.city}</p>
          </div>

          {/* Rating */}
          {avgRating && (
            <div className="flex items-center gap-2 bg-amber-50 p-4 rounded-xl border border-amber-200">
              <span className="text-amber-500 text-3xl">★</span>
              <div>
                <span className="text-2xl font-semibold text-gray-900">{avgRating}</span>
                <span className="text-gray-600 ml-2">({reviews.length} recensioni)</span>
              </div>
            </div>
          )}

          {/* Bio */}
          {professional.bio && (
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-2">Chi sono</h2>
              <p className="text-gray-700 whitespace-pre-line">{professional.bio}</p>
            </div>
          )}

          {/* Tag */}
          {professional.tags && professional.tags.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Interessi</h2>
              <div className="flex flex-wrap gap-2">
                {professional.tags.map((tag: string) => (
                  <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recensioni */}
          {reviews && reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Recensioni</h2>
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-5 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-amber-500 font-bold">★ {review.rating}</span>
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
        </div>
      </div>
    </main>
  )
}