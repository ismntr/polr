"use client";

import { useState } from "react";
import { Link2, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { shortenUrl } from "./actions";

export default function Home() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await shortenUrl(formData);

    if (res.error) {
      setError(res.error);
    } else if (res.shortUrl) {
      setResult(res.shortUrl);
    }
    setLoading(false);
  }

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl space-y-8 text-center">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Link2 className="h-10 w-10 text-blue-400" />
            <h1 className="text-5xl font-bold tracking-tight">Polr</h1>
          </div>
          <p className="text-slate-400">
            A modern, open-source URL shortener
          </p>
        </div>

        {/* Form */}
        <form action={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              name="url"
              required
              placeholder="https://example.com/very-long-url"
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 outline-none ring-blue-500 transition focus:ring-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "…" : "Shorten"}
            </button>
          </div>

          {/* Link Options Toggle */}
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
          >
            {showOptions ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Link Options
          </button>

          {/* Options Panel */}
          {showOptions && (
            <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
              <label className="block text-left text-sm text-slate-400">
                Custom ending (optional)
              </label>
              <input
                type="text"
                name="custom-ending"
                placeholder="my-custom-slug"
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-white placeholder-slate-500 outline-none ring-blue-500 transition focus:ring-2"
              />
            </div>
          )}
        </form>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-red-300">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="rounded-lg border border-green-800 bg-green-900/20 p-4">
            <p className="mb-2 text-sm text-green-400">Your shortened link:</p>
            <div className="flex items-center justify-center gap-2">
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-white underline decoration-green-500 underline-offset-4 transition hover:text-green-300"
              >
                {result}
              </a>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 transition hover:text-white"
                aria-label="Open link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <button
              onClick={handleCopy}
              className="mt-3 inline-flex items-center gap-1 rounded-md bg-slate-700 px-3 py-1.5 text-sm transition hover:bg-slate-600"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
