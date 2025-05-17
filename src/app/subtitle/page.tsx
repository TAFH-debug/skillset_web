"use client";
import { useState } from 'react';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');

  const handleProcess = async () => {
    setLoading(true);
    setResultUrl('');

    const res = await fetch('/api/negotiations/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setResultUrl(data.url);
    } else {
      alert('Ошибка: ' + data.error);
    }
  };

  
  return (
    <div className="max-w-xl mx-auto p-4 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Добавить субтитры к видео</h2>

      <input
        type="text"
        value={audioUrl}
        onChange={(e) => setAudioUrl(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="https://..."
      />

      <button
        onClick={handleProcess}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Обработка...' : 'Начать'}
      </button>

      {resultUrl && (
        <div className="mt-4">
          <p>Готово <a className="text-blue-600 underline" href={resultUrl} download>Скачать видео</a></p>
        </div>
      )}
    </div>
  );
}