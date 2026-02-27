import { supabase } from '@/lib/supabaseClient'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProfiloPage({ params }: Props) {
  const { id } = await params

  const { data: professional, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !professional) {
    notFound()
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">
        {professional.display_name}, {professional.age}
      </h1>
      <p className="text-xl text-gray-600">{professional.city}</p>
      {professional.bio && (
        <p className="mt-4 text-gray-700">{professional.bio}</p>
      )}
    </main>
  )
}