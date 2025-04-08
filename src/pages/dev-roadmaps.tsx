import { useEffect, useState } from 'react';
import { getRoadmaps } from '@/lib/backendApi';

export default function DevRoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRoadmaps()
      .then((data) => {
        console.log('🗺️ roadmaps:', data);
        setRoadmaps(data);
      })
      .catch((err) => {
        console.error('🚨 Failed to fetch roadmaps:', err.message);
        setError(err.message);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🧪 Roadmap Fetch Test</h1>
      {error && <p className="text-red-600">Error: {error}</p>}
      <ul className="list-disc ml-6">
        {roadmaps.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong> — {r.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
