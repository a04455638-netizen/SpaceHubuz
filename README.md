# SpaceHub UZ

O‘zbekistonda kovorking, sport maydonlari, konferensiya va majlis xonalari hamda tadbir joylarini kashf qilish va real vaqtda ishonchli bron qilish bo‘yicha ko‘p toifali, gibrid bozor platformasi.

---

## Asosiy texnologiyalar

- **Frontend**: Next.js App Router (React 19), TypeScript, Tailwind CSS v4, dizayn tokenlari (yorug‘ va qorong‘i mavzular).
- **Backend**: Next.js Route Handlers, modulli server xizmatlari, RBAC (Role-Based Access Control).
- **Ma’lumotlar bazasi**: PostgreSQL 16+ va Prisma ORM, `btree_gist` kengaytmasi asosida ikki tomonlama bandlik (double booking) oldini oluvchi GiST exclusion constraints.
- **Autentifikatsiya**: +998 telefon raqamlari orqali SMS OTP tekshiruvi, xavfsiz HttpOnly sessiyalar.
- **To‘lovlar**: O‘zbekiston to‘lov tizimlari (Click va Payme) uchun server-side adapterlar, vebxuk tekshiruvi va idempotentlik.
- **Xabarnomalar**: Joy egalari va adminlar uchun Telegram boti, SMS/email eslatmalar.

---

## Lokal muhitda ishga tushirish

Tizim uchun Node.js 24+ va npm talab qilinadi.

### 1. Bog‘liqliklarni o‘rnatish

```sh
npm install
```

### 2. Muhit parametrlarini sozlash

`.env.example` faylidan nusxa olib, `.env` faylini yarating:

```sh
cp .env.example .env
```

Zarur bo‘lsa, PostgreSQL ulanish manzilini (`DATABASE_URL`) kiriting.

### 3. Ma’lumotlar bazasi (PostgreSQL)

Agar lokal PostgreSQL bazangiz bo‘lsa:

```sh
npm run db:generate
npm run db:migrate
```

Lokal sinov ma’lumotlarini yuklash uchun `.env` da `SPACEHUB_DEV_SEED="1"` belgilang va bajaring:

```sh
npm run db:seed
```

### 4. Dasturni ishga tushirish

```sh
npm run dev
```

Brauzerda http://localhost:3000 manzilini oching.

---

## Sifat va test buyruqlari

Barcha kod uslubi, tiplar va testlar avtomatlashtirilgan:

```sh
# Kod formatini tekshirish
npm run format:check

# ESLint statik tahlili
npm run lint

# TypeScript tiplarini tekshirish
npm run typecheck

# Unit va integratsion testlar
npm test

# Production build yaratish
npm run build
```

---

## Hujjatlar

- [Tizim arxitekturasi va rollar](docs/architecture.md)
- [10 bosqichli rivojlanish holati](docs/phases.md)
- [Spetsifikatsiya](SpaceHub_UZ_Antigravity_MASTER_PROMPT.md)
