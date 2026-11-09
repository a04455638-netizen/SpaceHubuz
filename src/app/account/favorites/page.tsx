"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Trash2 } from "lucide-react";

export default function AccountFavoritesPage() {
  const [favorites, setFavorites] = useState([
    {
      id: "1",
      slug: "dev-sample-venue",
      name: "C-Space Mirabad",
      category: "Kovorking",
      city: "Toshkent",
      address: "Mirobod tumani, Nukus ko‘chasi, 29",
      price: "45 000 so‘m / soat",
      image: "/images/generated/demo-coworking-1.svg",
    },
    {
      id: "2",
      slug: "dev-sample-venue",
      name: "Milliy Futsal Arena",
      category: "Sport maydoni",
      city: "Toshkent",
      address: "Chilonzor tumani, Qatortol ko‘chasi, 18",
      price: "180 000 so‘m / soat",
      image: "/images/generated/demo-sports-1.svg",
    },
  ]);

  function removeFavorite(id: string) {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Sevimli joylarim ({favorites.length})
        </h1>
        <p className="text-xs text-ink-muted">
          Kelgusida tezda topish uchun saqlangan obyektlar
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-card p-12 text-center">
          <div className="relative h-28 w-28">
            <Image
              src="/images/generated/empty-favorites.svg"
              alt="Sevimlilar yo'q"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">
            Sevimli joylar ro‘yxati bo‘sh
          </h3>
          <p className="mt-1 max-w-sm text-xs text-ink-muted">
            Katalogdagi yurakcha belgisini bosib o‘zingizga yoqqan joylarni
            saqlang.
          </p>
          <Link
            href="/explore"
            className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white transition hover:bg-accent-hover shadow"
          >
            Joylar katalogi
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {favorites.map((fav) => (
            <div
              key={fav.id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-card transition hover:shadow-md"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-surface-muted">
                  <Image
                    src={fav.image}
                    alt={fav.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFavorite(fav.id)}
                    aria-label="O‘chirish"
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-status-danger backdrop-blur transition hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-accent">
                    {fav.category}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-ink">
                    {fav.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-ink-subtle">
                    <MapPin className="h-3 w-3 text-accent" />
                    {fav.city}, {fav.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border p-4 bg-surface-card">
                <span className="text-xs font-extrabold text-ink">
                  {fav.price}
                </span>
                <Link
                  href={`/venues/${fav.slug}`}
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent-hover"
                >
                  Bron qilish
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
