import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Foydalanish shartlari | SpaceHub UZ",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
        Foydalanish shartlari
      </h1>
      <p className="mt-2 text-xs text-ink-muted">
        Oxirgi tahrir: 2026-yil 9-noyabr
      </p>

      <div className="mt-8 space-y-6 text-sm text-ink-muted leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-ink">1. Umumiy qoidalar</h2>
          <p className="mt-2">
            SpaceHub UZ orqali joylarni qidirish, taqqoslash va bron qilish
            ushbu shartlarga to‘liq rozilik bildirishni anglatadi. Xizmat
            O‘zbekiston Respublikasi qonunchiligiga to‘liq muvofiq faoliyat
            yuritadi.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">
            2. Bronlash va bekor qilish
          </h2>
          <p className="mt-2">
            Har bir joy egasi tomonidan belgilangan bekor qilish siyosati
            buyurtma sahifasida ochiq ko‘rsatiladi. Standart shartlarga ko‘ra,
            24 soat oldin bekor qilingan buyurtmalar to‘liq qaytariladi.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">
            3. Javobgarlik va intizom
          </h2>
          <p className="mt-2">
            Mijoz obyekt hududidagi ichki tartib-qoidalar, tozalik va xavfsizlik
            me’yorlariga rioya qilishga majburdir. Jihozlarga yetkazilgan zarar
            qonuniy tartibda qoplanadi.
          </p>
        </section>
      </div>
    </main>
  );
}
