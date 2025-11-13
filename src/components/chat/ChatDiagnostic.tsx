"use client";

import { useState } from "react";

export default function ChatDiagnostic() {
  const [tagsResult, setTagsResult] = useState<any>(null);
  const [askResult, setAskResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testTags = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      setTagsResult({ status: response.status, data });
    } catch (error) {
      setTagsResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testAsk = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: 'Olá' })
      });
      const data = await response.json();
      setAskResult({ status: response.status, data });
    } catch (error) {
      setAskResult({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-32 left-6 z-50 bg-white p-4 rounded-lg shadow-xl max-w-md">
      <h3 className="font-bold mb-3">🔧 Diagnóstico Ally API</h3>
      
      <div className="space-y-2">
        <button
          onClick={testTags}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Testar /api/tags
        </button>
        
        <button
          onClick={testAsk}
          disabled={loading}
          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Testar /api/ask
        </button>
      </div>

      {tagsResult && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          <strong>Tags Result:</strong>
          <pre>{JSON.stringify(tagsResult, null, 2)}</pre>
        </div>
      )}

      {askResult && (
        <div className="mt-3 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-40">
          <strong>Ask Result:</strong>
          <pre>{JSON.stringify(askResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

