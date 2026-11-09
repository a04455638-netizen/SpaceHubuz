export const reservationModes = {
  interval: "Vaqt oralig‘i",
  night: "Tunlar bo‘yicha",
  table: "Stol va mehmonlar soni",
  ticket: "Chipta",
  appointment: "Qabul vaqti",
  quantity: "Muddat va miqdor",
  seat: "Reys va o‘rindiq",
} as const;

type Category = {
  id: string;
  name: string;
  examples: readonly string[];
  mode: keyof typeof reservationModes;
};

export const categories: readonly Category[] = [
  {
    id: "work",
    name: "Ish va o‘qish",
    examples: ["Kovorking", "Ish stoli", "O‘quv xonasi", "Kutubxona joyi"],
    mode: "interval",
  },
  {
    id: "meetings",
    name: "Uchrashuv va trening",
    examples: [
      "Majlis xonasi",
      "Konferensiya zali",
      "Trening xonasi",
      "Sinf xonasi",
    ],
    mode: "interval",
  },
  {
    id: "sports",
    name: "Sport inshootlari",
    examples: [
      "Futbol maydoni",
      "Tennis korti",
      "Padel korti",
      "Basseyn yo‘lagi",
      "Sport zali",
    ],
    mode: "interval",
  },
  {
    id: "events",
    name: "Tadbir joylari",
    examples: [
      "To‘yxona",
      "Banket zali",
      "Ko‘rgazma maydoni",
      "Ochiq tadbir hududi",
    ],
    mode: "interval",
  },
  {
    id: "stays",
    name: "Turar joy",
    examples: ["Mehmonxona", "Apartament", "Hostel", "Dala hovli", "Kemping"],
    mode: "night",
  },
  {
    id: "dining",
    name: "Restoran va ovqatlanish",
    examples: ["Restoran stoli", "VIP xona", "Degustatsiya"],
    mode: "table",
  },
  {
    id: "tickets",
    name: "Tadbir chiptalari",
    examples: ["Konsert", "Teatr", "Kino", "Sport uchrashuvi", "Muzey"],
    mode: "ticket",
  },
  {
    id: "tours",
    name: "Sayohat va tajribalar",
    examples: [
      "Ekskursiya",
      "Gid",
      "Tog‘ sayri",
      "Qayiq sayri",
      "Master-klass",
    ],
    mode: "ticket",
  },
  {
    id: "beauty",
    name: "Go‘zallik va dam olish",
    examples: ["Sartarosh", "Manikyur", "Spa", "Massaj", "Hammom"],
    mode: "appointment",
  },
  {
    id: "lessons",
    name: "Darslar va mashg‘ulotlar",
    examples: ["Repetitor", "Til darsi", "Musiqa darsi", "Murabbiy", "Yoga"],
    mode: "appointment",
  },
  {
    id: "studios",
    name: "Ijodiy studiyalar",
    examples: [
      "Fotostudiya",
      "Videostudiya",
      "Ovoz yozish studiyasi",
      "Repetitsiya xonasi",
    ],
    mode: "interval",
  },
  {
    id: "vehicles",
    name: "Transport ijarasi",
    examples: ["Avtomobil", "Velosiped", "Motosikl", "Qayiq", "Avtodom"],
    mode: "quantity",
  },
  {
    id: "equipment",
    name: "Uskuna va buyumlar ijarasi",
    examples: [
      "Kamera",
      "Proyektor",
      "Ovoz uskunasi",
      "Asbob-uskunalar",
      "Sport anjomi",
    ],
    mode: "quantity",
  },
  {
    id: "parking",
    name: "Avtoturargoh va quvvatlash",
    examples: ["Avtoturargoh joyi", "Garaj", "Elektromobil quvvatlash joyi"],
    mode: "interval",
  },
  {
    id: "storage",
    name: "Saqlash joylari",
    examples: ["Ombor bo‘limi", "Bagaj shkafi", "Yuk saqlash joyi"],
    mode: "interval",
  },
  {
    id: "transport",
    name: "Safar va transfer",
    examples: ["Aeroport transferi", "Avtobus", "Poyezd", "Samolyot", "Parom"],
    mode: "seat",
  },
  {
    id: "home",
    name: "Uy xizmatlari",
    examples: [
      "Tozalash",
      "Santexnik",
      "Elektrik",
      "Texnika ta’miri",
      "Yuk tashish",
    ],
    mode: "appointment",
  },
  {
    id: "auto",
    name: "Avtomobil xizmatlari",
    examples: [
      "Avtoyuvish",
      "Texnik ko‘rik",
      "Shina almashtirish",
      "Avtoservis",
    ],
    mode: "appointment",
  },
  {
    id: "pets",
    name: "Uy hayvonlari xizmatlari",
    examples: ["Hayvonlar mehmonxonasi", "Gruming", "Sayr xizmati"],
    mode: "appointment",
  },
  {
    id: "professional",
    name: "Professional maslahat",
    examples: ["Tarjimon", "Buxgalter", "Huquqshunos", "Biznes maslahatchisi"],
    mode: "appointment",
  },
  {
    id: "health",
    name: "Tibbiy qabul",
    examples: ["Shifokor", "Stomatolog", "Diagnostika", "Veterinar"],
    mode: "appointment",
  },
  {
    id: "public",
    name: "Davlat xizmatlari",
    examples: ["Hujjat topshirish qabuli", "Konsullik qabuli"],
    mode: "appointment",
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/['‘’ʻʼ`]/g, "")
    .trim();
}

export function searchCategories(query: string, categoryId: string) {
  const terms = normalize(query).split(/\s+/u);
  return categories.filter((category) => {
    const searchable = normalize(
      [category.name, ...category.examples].join(" "),
    );
    return (
      (!categoryId || category.id === categoryId) &&
      terms.every((term) => searchable.includes(term))
    );
  });
}
