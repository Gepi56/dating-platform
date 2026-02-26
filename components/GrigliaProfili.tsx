import { supabase } from '@/lib/supabaseClient';

export default async function GrigliaProfili() {
  const { data: professionals } = await supabase
    .from('professionals')
    .select('*')
    .limit(6);

  if (!professionals || professionals.length === 0) {
    return <p className="text-gray-500">Nessun profilo al momento.</p>;
  }

  // Funzione per determinare il badge in base ai campi
  const getBadge = (prof: any) => {
    if (prof.verification_status === 'verified') {
      return { text: '✅ Verificata', color: 'blue' };
    }
    if (prof.subscription_tier === 'premium') {
      return { text: '🔥 Premium', color: 'amber' };
    }
    // Se è un nuovo profilo (ad esempio, creato da meno di 7 giorni)
    const created = new Date(prof.created_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) {
      return { text: '🆕 Nuova', color: 'green' };
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {professionals.map((prof) => {
        const badge = getBadge(prof);
        return (
          <div
            key={prof.id}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            {/* Placeholder immagine (poi metteremo foto reali) */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-violet-100 relative">
              {badge && (
                <span
                  className={`absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-${badge.color}-700 text-xs font-semibold px-3 py-1 rounded-full border border-${badge.color}-200`}
                >
                  {badge.text}
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{prof.display_name}</h3>
                <span className="text-gray-600">{prof.age}</span>
              </div>
              <p className="text-blue-600 text-sm mt-1">📍 {prof.city || 'Città non specificata'}</p>
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">{prof.bio || ''}</p>
              {prof.tags && prof.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {prof.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-amber-500 font-medium">★★★★★ 5.0</span>
                <span className="text-blue-600 text-sm font-medium">0 recensioni</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}