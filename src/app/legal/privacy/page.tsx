import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maxfiylik siyosati | SpaceHub UZ",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
        Maxfiylik siyosati
      </h1>
      <p className="mt-2 text-xs text-ink-muted">
        Oxirgi tahrir: 2026-yil 9-noyabr
      </p>

      <div className="mt-8 space-y-6 text-sm text-ink-muted leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-ink">
            1. Ma’lumotlarni yig‘ish va ulardan foydalanish
          </h2>
          <p className="mt-2">
            SpaceHub UZ foydalanuvchilarning telefon raqami (+998 formati),
            ism-familiyasi va bronlash tarixini faqat buyurtmalarni bajarish,
            xavfsiz SMS OTP yuborish va xizmat sifatini oshirish maqsadida
            saqlaydi.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">
            2. To‘lov xavfsizligi
          </h2>
          <p className="mt-2">
            Platforma foydalanuvchilarning bank karta ma’lumotlarini (PAN, CVV)
            o‘z serverlarida aslo saqlamaydi. Barcha to‘lovlar O‘zbekiston
            Markaziy Banki litsenziyasiga ega bo‘lgan Click va Payme to‘lov
            shlyuzlari orqali shifrlangan protokollar (TLS/SSL) asosida amalga
            oshiriladi.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-ink">
            3. Ma’lumotlarni uchinchi shaxslarga bermaslik
          </h2>
          <p className="mt-2">
            Mijozning shaxsiy ma’lumotlari boshqa mijozlarga yoki begona
            uchinchi shaxslarga berilmaydi. Joy egasiga faqat buyurtmani kutib
            olish uchun zarur bo‘lgan qisqa ma’lumotlar taqdim etiladi.
          </p>
        </section>
      </div>
    </main>
  );
}
