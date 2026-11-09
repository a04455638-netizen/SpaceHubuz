import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Eye, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Mening obyektlarim | SpaceHub Owner",
};

export default function OwnerVenuesPage() {
  const venues = [
    {
      id: "v_1",
      slug: "c-space-mirabad",
      name: "C-Space Mirabad",
      city: "Toshkent",
      address: "Mirobod tumani, Nukus ko‘chasi, 29",
      resourcesCount: 4,
      status: "Tasdiqlangan",
      image: "/images/generated/demo-coworking-1.svg",
    },
    {
      id: "v_2",
      slug: "milliy-futsal-arena",
      name: "Milliy Futsal Arena",
      city: "Toshkent",
      address: "Chilonzor tumani, Qatortol ko‘chasi, 18",
      resourcesCount: 2,
      status: "Tasdiqlangan",
      image: "/images/generated/demo-sports-1.svg",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            Mening obyektlarim va resurslar ({venues.length})
          </h1>
          <p className="text-xs text-ink-muted">
            Tashkilotingizga biriktirilgan filiallar va bookable resurslar
          </p>
        </div>
        <Link
          href="/owner/venues/new"
          className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          <span>Yangi filial</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {venues.map((v) => (
          <div
            key={v.id}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-card transition hover:shadow-md"
          >
            <div>
              <div className="relative aspect-[16/9] w-full bg-surface-muted">
                <Image
                  src={v.image}
                  alt={v.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute right-3 top-3 rounded-full bg-status-success-bg px-2.5 py-0.5 text-xs font-bold text-status-success border border-status-success/30">
                  {v.status}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-ink">{v.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                  <MapPin className="h-3.5 w-3.5 text-accent" />
                  {v.city}, {v.address}
                </p>
                <div className="mt-3 rounded-lg bg-surface-muted p-2.5 text-xs text-ink">
                  Mavjud resurslar:{" "}
                  <strong>{v.resourcesCount} ta xona/kort</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border p-4 bg-surface-card">
              <Link
                href={`/venues/${v.slug}`}
                className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Mijoz ko‘rinishi</span>
              </Link>
              <Link
                href={`/owner/venues/${v.id}/edit`}
                className="flex items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-muted transition"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Tahrirlash</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
