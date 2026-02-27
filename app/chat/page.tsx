import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

// Per test, usiamo un ID professionista fisso (Sofia)
const PROFESSIONAL_ID = '5a9fa17f-aa35-4cd9-ad47-94cb131b70dc'

export default async function ChatPage() {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      id,
      client_anonymous_id,
      client_color,
      client_reputation_level,
      last_message_at,
      created_at
    `)
    .eq('professional_id', PROFESSIONAL_ID)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('Errore nel caricamento delle conversazioni:', error)
    return <p className="text-center text-red-500">Errore nel caricamento delle conversazioni</p>
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Le tue conversazioni</h1>
      {conversations.length === 0 ? (
        <p className="text-gray-500">Nessuna conversazione attiva</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/chat/${conv.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold">
                    Cliente {conv.client_color} • Livello {conv.client_reputation_level}
                  </p>
                  <p className="text-sm text-gray-500">ID anonimo: {conv.client_anonymous_id}</p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(conv.last_message_at).toLocaleDateString('it-IT')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}