import Link from "next/link";
import { categories, reservationModes } from "../catalog/categories";

export function CatalogHeader() {
  return (
    <header className="border-b border-ink/10">
      <nav
        aria-label="Asosiy menyu"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"
      >
        <Link href="/" className="text-xl font-bold text-accent">
          SpaceHub UZ
        </Link>
        <Link
          href="/explore"
          className="font-semibold underline-offset-4 hover:underline"
        >
          Katalog
        </Link>
      </nav>
    </header>
  );
}

export function CatalogSearch({ query = "", categoryId = "" }) {
  return (
    <form
      action="/explore"
      className="grid gap-3 rounded-2xl border border-ink/15 bg-white p-4 text-ink sm:grid-cols-[2fr_1fr_auto] sm:items-end"
    >
      <label className="grid gap-1 text-sm font-semibold">
        Nima bron qilmoqchisiz?
        <input
          type="search"
          name="q"
          defaultValue={query}
          maxLength={120}
          placeholder="Masalan, tennis yoki fotostudiya"
          className="min-w-0 rounded-lg border border-ink/30 px-3 py-2 font-normal"
        />
      </label>
      <label className="grid gap-1 text-sm font-semibold">
        Toifa
        <select
          name="category"
          defaultValue={categoryId}
          className="min-w-0 rounded-lg border border-ink/30 bg-white px-3 py-2 font-normal"
        >
          <option value="">Barcha toifalar</option>
          {categories.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <button className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-white hover:bg-ink">
        Qidirish
      </button>
    </form>
  );
}

export function CategoryGrid({ items }: { items: typeof categories }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => (
        <li
          key={category.id}
          className="rounded-2xl border border-ink/15 bg-white p-5"
        >
          <h3 className="text-lg font-bold">
            <Link
              href={`/explore?category=${category.id}`}
              className="text-accent underline-offset-4 hover:underline"
            >
              {category.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-6">
            {category.examples.join(" · ")}
          </p>
          <p className="mt-4 text-xs font-semibold text-accent">
            {reservationModes[category.mode]}
          </p>
        </li>
      ))}
    </ul>
  );
}
