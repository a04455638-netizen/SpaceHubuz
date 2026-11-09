import type { Metadata } from "next";
import { ShieldCheck, Target, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Biz haqimizda | SpaceHub UZ",
  description:
    "SpaceHub UZ — O‘zbekistonda joylarni qidirish va bron qilishning zamonaviy ekotizimi.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Bizning missiyamiz
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
          Har bir jamoa va inson uchun ideal makon
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-ink-muted leading-relaxed">
          SpaceHub UZ O‘zbekistondagi bo‘sh maydonlar, sport inshootlari,
          kovorkinglar va konferensiya zallarini bir nuqtada birlashtirib,
          ularni real vaqtda ishonchli band qilish imkonini beradi.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
            <Target className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">
            Aniq Vaqt va Kafolat
          </h3>
          <p className="mt-2 text-xs text-ink-muted leading-relaxed">
            Telefon orqali band qilib, joyga borganda boshqa kishi o‘tirgani
            muammosiga chek qo‘yamiz.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">
            Xavfsiz To‘lovlar
          </h3>
          <p className="mt-2 text-xs text-ink-muted leading-relaxed">
            Click va Payme orqali shaffof tranzaksiyalar, avtomatik elektron
            cheklar va bekor qilinganda 100% pul qaytarish.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-subtle text-accent">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">Hamkorlar Uchun</h3>
          <p className="mt-2 text-xs text-ink-muted leading-relaxed">
            Joy egalari o‘z bandlik taqvimini oson boshqaradi va daromadlarini
            real vaqtda ko‘rib boradi.
          </p>
        </div>
      </div>
    </main>
  );
}
