import GrigliaProfili from '@/components/GrigliaProfili';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Qui metteremo dopo l'header e l'hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Profili del momento</h1>
        <GrigliaProfili />
      </div>
    </main>
  );
}