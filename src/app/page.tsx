import { categories } from "../catalog/categories";
import { CatalogHeader, CatalogSearch, CategoryGrid } from "./catalog-controls";

export default function Home() {
  return (
    <>
      <CatalogHeader />
      <main>
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:py-24">
            <p className="mb-4 text-sm font-semibold text-emerald-200">
              BRON KATALOGI
            </p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
              Nima bron qilish mumkin?
            </h1>
            <p className="mb-8 mt-4 max-w-2xl text-lg text-emerald-50">
              Sport maydonidan mehmonxonagacha, tadbir chiptasidan xizmat
              qabuligacha. Kerakli toifani toping.
            </p>
            <CatalogSearch />
          </div>
        </section>
        <section
          className="mx-auto max-w-6xl px-5 py-10"
          aria-labelledby="categories"
        >
          <h2 id="categories" className="mb-2 text-2xl font-bold">
            Barcha toifalar
          </h2>
          <p className="mb-6">Katalogda {categories.length} ta toifa bor.</p>
          <CategoryGrid items={categories} />
        </section>
      </main>
    </>
  );
}
