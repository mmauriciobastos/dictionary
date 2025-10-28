'use client';

import { useState } from "react";
import type { DictionaryEntry } from "@/types/dictionary";

export default function Home() {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [definitions, setDefinitions] = useState<DictionaryEntry[] | null>(null);

  const searchWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;

    setLoading(true);
    setError(null);
    setDefinitions(null);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`
      );

      if (!response.ok) {
        throw new Error(response.status === 404 ? "Word not found" : "Failed to fetch definition");
      }

      const data = await response.json();
      setDefinitions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-12 px-6 bg-white dark:bg-black sm:px-8">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
          Dictionary
        </h1>

        <form onSubmit={searchWord} className="w-full max-w-xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="Enter a word..."
              className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-base focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !word.trim()}
              className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 dark:text-red-400">{error}</div>
        )}

        {definitions && (
          <div className="w-full max-w-xl space-y-6">
            {definitions.map((entry, index) => (
              <div key={index} className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {entry.word}
                  </h2>
                  {entry.phonetic && (
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {entry.phonetic}
                    </p>
                  )}
                </div>

                {entry.meanings.map((meaning, meaningIndex) => (
                  <div key={meaningIndex} className="space-y-2">
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
                      {meaning.partOfSpeech}
                    </h3>
                    <ul className="list-disc space-y-2 pl-5">
                      {meaning.definitions.map((def, defIndex) => (
                        <li key={defIndex} className="text-zinc-700 dark:text-zinc-300">
                          {def.definition}
                          {def.example && (
                            <p className="mt-1 text-zinc-600 dark:text-zinc-400 italic">
                              Example: {def.example}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
