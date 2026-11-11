"use client";

import { useState, useEffect } from "react";
import {
  Check,
  X,
  EyeOff,
  Star,
  Search,
  Filter,
  ShieldCheck,
  MessageSquare,
  Building,
  RefreshCw,
} from "lucide-react";

interface AdminReview {
  id: string;
  venueId: string;
  venueName: string;
  authorName: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  isPublished: boolean;
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  averageRating: string;
}

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<"reviews" | "venues">("reviews");

  // Review states
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    averageRating: "5.0",
  });
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [venueFilter, setVenueFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Venue submissions state
  const [submissions, setSubmissions] = useState([
    {
      id: "ven_mod_01",
      name: "Samarkand Coworking Hub",
      owner: "Farrux Zokirov (STIR: 309876543)",
      city: "Samarqand",
      address: "Rudakiy ko‘chasi, 15",
      resourcesCount: 3,
      submittedAt: "2026-11-09 10:20",
    },
    {
      id: "ven_mod_02",
      name: "Tashkent Padel Club",
      owner: "Padel Sport MCHJ (STIR: 301234567)",
      city: "Toshkent",
      address: "Shayxontohur t., Labzak, 4",
      resourcesCount: 2,
      submittedAt: "2026-11-08 18:45",
    },
  ]);

  async function fetchReviews() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (venueFilter !== "ALL") params.set("venue", venueFilter);
      if (searchQuery) params.set("q", searchQuery);
      if (sortBy) params.set("sort", sortBy);

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [statusFilter, venueFilter, sortBy]);

  async function handleReviewAction(
    reviewId: string,
    action: "APPROVE" | "REJECT" | "HIDE"
  ) {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action }),
      });

      if (res.ok) {
        const labelMap = {
          APPROVE: "Sharh tasdiqlandi va ommaviy ko'rsatiladi",
          REJECT: "Sharh rad etildi",
          HIDE: "Sharh yashirildi",
        };
        setMessage(labelMap[action]);
        setTimeout(() => setMessage(""), 3000);
        fetchReviews();
      }
    } catch {
      // ignore
    }
  }

  function handleVenueDecision(id: string, approved: boolean) {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    setMessage(
      approved
        ? `Obyekt tasdiqlandi va ommaviy katalogga chiqarildi.`
        : `Obyekt arizasi rad etildi va egasiga xabarnoma yuborildi.`
    );
    setTimeout(() => setMessage(""), 3000);
  }

  // Unique venue names for filtering dropdown
  const uniqueVenues = Array.from(new Set(reviews.map((r) => r.venueName)));

  return (
    <div className="space-y-6">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            Moderatsiya Markazi
          </h1>
          <p className="text-xs text-ink-muted">
            Mijozlar sharhlari va yangi joy e&apos;lonlarini tasdiqlash
          </p>
        </div>

        <div className="flex rounded-xl bg-surface-muted p-1 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === "reviews"
                ? "bg-surface-card text-accent shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Mijozlar sharhlari ({stats.totalReviews})</span>
            {stats.pendingCount > 0 && (
              <span className="rounded-full bg-status-warning-bg px-1.5 py-0.2 text-[10px] font-black text-status-warning">
                {stats.pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("venues")}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition ${
              activeTab === "venues"
                ? "bg-surface-card text-accent shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            <span>Joy arizalari ({submissions.length})</span>
          </button>
        </div>
      </div>

      {message && (
        <div className="rounded-xl bg-status-success-bg p-3.5 text-xs font-bold text-status-success shadow-sm">
          {message}
        </div>
      )}

      {/* TAB 1: REVIEWS MODERATION */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          {/* Review Statistics Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
              <p className="text-[11px] font-bold text-ink-muted">Jami sharhlar</p>
              <p className="mt-1 text-2xl font-black text-ink">{stats.totalReviews}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
              <p className="text-[11px] font-bold text-status-warning">Kutayotganlar</p>
              <p className="mt-1 text-2xl font-black text-status-warning">{stats.pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
              <p className="text-[11px] font-bold text-status-success">Tasdiqlangan</p>
              <p className="mt-1 text-2xl font-black text-status-success">{stats.approvedCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
              <p className="text-[11px] font-bold text-status-danger">Rad etilgan / Yashirin</p>
              <p className="mt-1 text-2xl font-black text-status-danger">{stats.rejectedCount}</p>
            </div>
            <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-[11px] font-bold text-amber-500">O&apos;rtacha reyting</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
                <span className="text-2xl font-black text-ink">{stats.averageRating}</span>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchReviews()}
                  placeholder="Mijoz ismi, sharh matni yoki joy nomi bo'yicha qidirish..."
                  className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-xs text-ink focus:border-accent focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={fetchReviews}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Qidirish</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                <Filter className="h-3.5 w-3.5" />
                <span>Holat:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="ALL">Barchasi</option>
                  <option value="PENDING">Kutayotgan (Pending)</option>
                  <option value="APPROVED">Tasdiqlangan (Approved)</option>
                  <option value="REJECTED">Rad etilgan</option>
                  <option value="HIDDEN">Yashirilgan</option>
                </select>
              </div>

              {/* Venue Filter */}
              {uniqueVenues.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span>Joy:</span>
                  <select
                    value={venueFilter}
                    onChange={(e) => setVenueFilter(e.target.value)}
                    className="max-w-[200px] truncate rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-ink focus:outline-none"
                  >
                    <option value="ALL">Barcha joylar</option>
                    {uniqueVenues.map((vName) => (
                      <option key={vName} value={vName}>
                        {vName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort By */}
              <div className="flex items-center gap-1.5 text-xs text-ink-muted ml-auto">
                <span>Saralash:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-bold text-ink focus:outline-none"
                >
                  <option value="date_desc">Eng yangi birinchi</option>
                  <option value="rating_desc">Reyting (Yuqoridan pastga)</option>
                  <option value="rating_asc">Reyting (Pastdan yuqoriga)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <div className="p-8 text-center text-xs text-ink-muted flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-accent" />
              <span>Sharhlar yuklanmoqda...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-card p-12 text-center text-xs text-ink-muted">
              Tanlangan filtrlar bo&apos;yicha sharhlar topilmadi.
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r) => {
                const statusStyles = {
                  PENDING: "bg-status-warning-bg text-status-warning border-status-warning/30",
                  APPROVED: "bg-status-success-bg text-status-success border-status-success/30",
                  REJECTED: "bg-status-danger-bg text-status-danger border-status-danger/30",
                  HIDDEN: "bg-surface-muted text-ink-muted border-border",
                };

                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm space-y-3 hover:border-accent/40 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-extrabold ${statusStyles[r.status]}`}
                        >
                          {r.status}
                        </span>
                        <h4 className="text-sm font-black text-ink">{r.venueName}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < r.rating ? "fill-amber-500" : "text-border"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-ink">{r.rating}/5</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink leading-relaxed bg-surface p-3 rounded-xl border border-border">
                      &ldquo;{r.comment}&rdquo;
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-ink-muted pt-1">
                      <div>
                        Muallif: <strong className="text-ink">{r.authorName}</strong> &middot;{" "}
                        {new Date(r.createdAt).toLocaleString("uz-UZ", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        {r.status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() => handleReviewAction(r.id, "APPROVE")}
                            className="inline-flex items-center gap-1 rounded-xl bg-status-success px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Tasdiqlash</span>
                          </button>
                        )}

                        {r.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() => handleReviewAction(r.id, "REJECT")}
                            className="inline-flex items-center gap-1 rounded-xl border border-status-danger bg-status-danger-bg px-3 py-1.5 text-xs font-bold text-status-danger hover:opacity-90 transition cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Rad etish</span>
                          </button>
                        )}

                        {r.status !== "HIDDEN" && (
                          <button
                            type="button"
                            onClick={() => handleReviewAction(r.id, "HIDE")}
                            className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-muted px-3 py-1.5 text-xs font-bold text-ink-muted hover:text-ink transition cursor-pointer"
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>Yashirish</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VENUES MODERATION */}
      {activeTab === "venues" && (
        <div className="space-y-4">
          {submissions.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-card p-12 text-center text-xs text-ink-muted">
              Hozirda moderatsiya kutayotgan joy arizalari mavjud emas. Barcha obyektlar
              ko‘rib chiqilgan.
            </div>
          ) : (
            submissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-status-warning-bg px-2 py-0.5 text-[10px] font-bold text-status-warning">
                        KUTMOQDA
                      </span>
                      <span className="text-[11px] text-ink-subtle">
                        Topshirildi: {sub.submittedAt}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-ink">{sub.name}</h3>
                    <p className="text-xs text-ink-muted">
                      Egasi: <strong>{sub.owner}</strong>
                    </p>
                    <p className="text-xs text-ink-subtle">
                      {sub.city}, {sub.address} &middot; {sub.resourcesCount} ta resurs
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleVenueDecision(sub.id, true)}
                      className="flex items-center gap-1 rounded-xl bg-status-success px-4 py-2 text-xs font-bold text-white shadow hover:opacity-90 cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Tasdiqlash
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVenueDecision(sub.id, false)}
                      className="flex items-center gap-1 rounded-xl border border-status-danger bg-status-danger-bg px-4 py-2 text-xs font-bold text-status-danger hover:opacity-90 cursor-pointer"
                    >
                      <X className="h-4 w-4" /> Rad etish
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
