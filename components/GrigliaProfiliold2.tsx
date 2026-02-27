'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

type Professional = {
  id: string
  display_name: string
  age: number
  city: string
  bio: string
  tags: string[]
  created_at: string
}

type Review = {
  to_id: string
  rating: number
}

export default function GrigliaProfili() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([])
  const [reviewsMap, setReviewsMap] = useState<Map<string, number[]>>(new Map())
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // 1. Carica i professionisti
      const { data: profs, error: profError } = await supabase
        .from('professionals')
        .select('id, display_name, age, city, bio, tags, created_at')

      if (profError) {
        console.error('Errore nel caricamento dei profili:', profError)
        setError(profError.message)
        setLoading(false)
        return
      }

      setProfessionals(profs || [])
      
      // 2. Estrai città uniche
      const uniqueCities = [...new Set(profs?.map(p => p.city).filter(Boolean))] as string[]
      setCities(uniqueCities)

      // 3. Carica tutte le recensioni
      const { data: reviews, error: revError } = await supabase
        .from('reviews')
        .select('to_id, rating')

      if (revError) {
        console.error('Errore nel caricamento delle recensioni:', revError)
      } else {
        // 4. Raggruppa le recensioni per professionista
        const map = new Map<string, number[]>()
        reviews?.forEach((rev: Review) => {
          const ratings = map.get(rev.to_id) || []
          ratings.push(rev.rating)
          map.set(rev.to_id, ratings)
        })
        setReviewsMap(map)
      }

      setFilteredProfessionals(profs || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  // Applica filtri e ordinamento
  useEffect(() => {
    let result = [...professionals]

    // Filtro città
    if (selectedCity) {
      result = result.filter(p => p.city === selectedCity)
    }

    // Ordinamento
    result.sort((a, b) => {
      if (sortBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      
      const ratingsA = reviewsMap.get(a.id) || []
      const ratingsB = reviewsMap.get(b.id) || []
      const avgA = ratingsA.length ? ratingsA.reduce((acc, r) => acc + r, 0) / ratingsA.length : 0
      const avgB = ratingsB.length ? ratingsB.reduce((acc, r) => acc + r, 0) / ratingsB.length : 0
      
      if (sortBy === 'rating') {
        return avgB - avgA
      }
      if (sortBy === 'reviews_count') {
        return ratingsB.length - ratingsA.length
      }
      return 0
    })

    setFilteredProfessionals(result)
  }, [selectedCity, sortBy, professionals, reviewsMap])

  if (loading) return <p className="text-center text-gray-500">Caricamento profili...</p>
  if (error) return <p className="text-center text-red-500">Errore: {error}</p>
  if (!professionals.length) return <p className="text-center text-gray-500">Nessun profilo disponibile</p>

  return (
    <div>
      {/* Barra filtri */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="">Tutte le città</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="created_at">Più recenti</option>
            <option value="rating">Miglior rating</option>
            <option value="reviews_count">Più recensioni</option>
          </select>
        </div>
        <p className="text-sm text-gray-500">
          {filteredProfessionals.length} profili trovati
        </p>
      </div>

      {/* Griglia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((prof) => {
          const ratings = reviewsMap.get(prof.id) || []
          const avgRating = ratings.length
            ? (ratings.reduce((acc, r) => acc + r, 0) / ratings.length).toFixed(1)
            : null
          const stars = avgRating ? Math.round(parseFloat(avgRating)) : 0

          return (
            <Link
              key={prof.id}
              href={`/profilo/${prof.id}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-6xl text-white font-bold">
                  {prof.display_name.charAt(0)}
                </span>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">{prof.display_name}</h3>
                  <span className="text-gray-600">{prof.age}</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">📍 {prof.city}</p>

                {avgRating ? (
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < stars ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <span className="text-sm font-medium ml-1">{avgRating}</span>
                    <span className="text-xs text-gray-500">({ratings.length})</span>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-gray-400">Ancora nessuna recensione</div>
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
    </div>
  )
}