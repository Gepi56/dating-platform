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
}

export default function GrigliaProfili() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfessionals = async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, display_name, age, city, bio, tags')
        .limit(6)

      if (error) {
        console.error('Errore nel caricamento dei profili:', error)
        setProfessionals([])
      } else {
        setProfessionals(data || [])
      }
      setLoading(false)
    }

    fetchProfessionals()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-500">Caricamento profili...</p>
  }

  if (!professionals.length) {
    return <p className="text-center text-gray-500">Nessun profilo disponibile</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals.map((prof) => (
        <Link
          key={prof.id}
          href={`/profilo/${prof.id}`}
          className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          {/* Placeholder colorato con iniziali */}
          <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-5xl text-white font-bold">
              {prof.display_name.charAt(0)}
            </span>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">{prof.display_name}</h3>
              <span className="text-gray-600">{prof.age}</span>
            </div>
            <p className="text-blue-600 text-sm mt-1">📍 {prof.city}</p>

            {/* Rating finto (da sostituire) */}
            <div className="mt-2 flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span className="text-sm font-medium">0.0</span>
              <span className="text-xs text-gray-500">(0)</span>
            </div>

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
      ))}
    </div>
  )
}