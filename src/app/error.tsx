"use client";

export default function RouteError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-bold">Sahifani yuklab bo‘lmadi</h1>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-lg bg-accent px-4 py-2 text-white"
      >
        Qayta urinish
      </button>
    </main>
  );
}
