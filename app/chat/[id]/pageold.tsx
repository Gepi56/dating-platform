'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'

type Message = {
  id: string
  sender_type: 'professional' | 'client'
  content: string
  created_at: string
}

export default function ConversationPage() {
  const { id } = useParams() as { id: string }
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)

  // Carica i messaggi iniziali
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Errore nel caricamento dei messaggi:', error)
      } else {
        setMessages(data || [])
      }
      setLoading(false)
    }

    fetchMessages()
  }, [id])

  // Sottoscrizione realtime per i nuovi messaggi
  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    // Per test, assumiamo che il mittente sia il professionista (poi da rendere dinamico)
    const { error } = await supabase.from('messages').insert({
      conversation_id: id,
      sender_type: 'professional',
      content: newMessage,
    })

    if (!error) {
      setNewMessage('')
    } else {
      console.error('Errore invio messaggio:', error)
    }
  }

  if (loading) return <p className="text-center text-gray-500">Caricamento messaggi...</p>

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-xl p-6 h-[70vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_type === 'professional' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender_type === 'professional'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString('it-IT')}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Scrivi un messaggio..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Invia
          </button>
        </div>
      </div>
    </main>
  )
}