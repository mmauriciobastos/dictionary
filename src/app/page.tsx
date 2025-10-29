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
    <div className="bg-white dark:bg-gray-900">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
        
        <div className="mx-auto max-w-3xl py-12 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Dictionary
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Look up any word to find its definition, pronunciation, and examples
            </p>
            
            <form onSubmit={searchWord} className="mt-10">
              <div className="flex gap-x-4 justify-center">
                <input
                  type="text"
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Enter a word..."
                  className="min-w-0 flex-auto rounded-xl border-0 bg-white/5 px-4 py-3 text-base text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  disabled={loading || !word.trim()}
                  className="flex-none rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-8 text-red-500 dark:text-red-400">{error}</div>
            )}
          </div>

          {definitions && (
            <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-10">
              {definitions.map((entry, index) => (
                <div key={index} className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {entry.word}
                    </h2>
                    {entry.phonetic && (
                      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                        {entry.phonetic}
                      </p>
                    )}
                  </div>

                  {entry.meanings.map((meaning, meaningIndex) => (
                    <div key={meaningIndex} className="mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {meaning.partOfSpeech}
                      </h3>
                      <ul className="mt-4 space-y-4">
                        {meaning.definitions.map((def, defIndex) => (
                          <li key={defIndex} className="text-gray-600 dark:text-gray-300">
                            <p>{def.definition}</p>
                            {def.example && (
                              <p className="mt-2 text-gray-500 dark:text-gray-400 italic">
                                "{def.example}"
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
        </div>

        <div className="inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  );
}
