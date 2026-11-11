"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, CheckCircle2, User } from "lucide-react";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  author: {
    fullName: string;
  };
  createdAt: string;
}

interface VenueReviewsSectionProps {
  venueId: string;
  venueName: string;
  locale: "uz" | "ru" | "en";
}

export function VenueReviewsSection({
  venueId,
  venueName,
  locale,
}: VenueReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 1. Fetch existing approved reviews
    fetch(`/api/reviews?venueId=${encodeURIComponent(venueId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.reviews) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {});

    // 2. Pre-fill customer name if logged in
    const savedName = localStorage.getItem("spacehub_user_name");
    if (savedName) setName(savedName);
  }, [venueId]);

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          venueId,
          rating,
          comment: comment.trim(),
          customerName: name.trim() || "Mijoz",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Sharh yuborishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setComment("");
    } catch {
      setError("Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  }

  const t = {
    uz: {
      title: "Mijozlar sharhlari va baholari",
      writeReview: "Sharh qoldirish",
      ratingLabel: "Bahoingiz:",
      namePlaceholder: "Ismingiz (masalan: Ali)",
      commentPlaceholder: "Joy, tozalik, jihozlar va xizmat sifati haqida fikringizni yozing...",
      submitBtn: "Sharhni yuborish",
      submitting: "Yuborilmoqda...",
      successTitle: "Sharhingiz muvaffaqiyatli qabul qilindi!",
      successDesc: "Tez orada moderator tekshiruvidan so'ng e'lon qilinadi va admin botga xabar bordi.",
      noReviews: "Hozircha sharhlar yo'q. Birinchi bo'lib fikringizni qoldiring!",
    },
    ru: {
      title: "Отзывы и оценки клиентов",
      writeReview: "Оставить отзыв",
      ratingLabel: "Ваша оценка:",
      namePlaceholder: "Ваше имя (например: Али)",
      commentPlaceholder: "Опишите чистоту, удобства и качество сервиса...",
      submitBtn: "Отправить отзыв",
      submitting: "Отправка...",
      successTitle: "Ваш отзыв успешно принят!",
      successDesc: "После быстрой модерации он появится на сайте. Администратор уже получил уведомление.",
      noReviews: "Пока нет отзывов. Будьте первыми, кто оставит свой отзыв!",
    },
    en: {
      title: "Customer Reviews & Ratings",
      writeReview: "Leave a Review",
      ratingLabel: "Your Rating:",
      namePlaceholder: "Your name (e.g. Ali)",
      commentPlaceholder: "Describe cleanliness, amenities, and service quality...",
      submitBtn: "Submit Review",
      submitting: "Submitting...",
      successTitle: "Your review was submitted successfully!",
      successDesc: "It will be published after quick moderation. The admin has been notified.",
      noReviews: "No reviews yet. Be the first to share your experience!",
    },
  }[locale] || {
    title: "Mijozlar sharhlari",
    writeReview: "Sharh qoldirish",
    ratingLabel: "Bahoingiz:",
    namePlaceholder: "Ismingiz",
    commentPlaceholder: "Fikringizni yozing...",
    submitBtn: "Sharhni yuborish",
    submitting: "Yuborilmoqda...",
    successTitle: "Sharhingiz qabul qilindi!",
    successDesc: "Admin botga xabarnoma yuborildi.",
    noReviews: "Hozircha sharhlar yo'q.",
  };

  return (
    <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-bold text-ink">{t.title}</h2>
        </div>
        <span className="text-xs font-semibold text-ink-muted">
          {reviews.length} {locale === "ru" ? "отзывов" : locale === "en" ? "reviews" : "ta sharh"}
        </span>
      </div>

      {/* Review Submission Form */}
      {submitted ? (
        <div className="rounded-xl border border-status-success/30 bg-status-success-bg p-5 text-center space-y-2">
          <CheckCircle2 className="mx-auto h-8 w-8 text-status-success" />
          <h4 className="text-sm font-bold text-status-success">{t.successTitle}</h4>
          <p className="text-xs text-ink-muted">{t.successDesc}</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmitReview}
          className="rounded-xl border border-border bg-surface p-4 sm:p-5 space-y-4"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            {t.writeReview}
          </h3>

          {error && (
            <div className="rounded-lg bg-status-danger-bg p-2.5 text-xs font-semibold text-status-danger">
              {error}
            </div>
          )}

          {/* Star selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-ink">{t.ratingLabel}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-500 hover:scale-110 transition cursor-pointer"
                >
                  <Star
                    className={`h-5 w-5 ${
                      (hoverRating || rating) >= star
                        ? "fill-amber-500 text-amber-500"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-ink">({rating}/5)</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              className="rounded-xl border border-border bg-surface-card px-3.5 py-2 text-xs text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            placeholder={t.commentPlaceholder}
            className="w-full rounded-xl border border-border bg-surface-card p-3 text-xs text-ink focus:border-accent focus:outline-none"
          />

          <button
            type="submit"
            disabled={loading || !comment.trim()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{loading ? t.submitting : t.submitBtn}</span>
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-3 pt-2">
        {reviews.length === 0 ? (
          <p className="text-center text-xs text-ink-muted py-6">{t.noReviews}</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-border bg-surface p-4 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-accent text-xs font-bold">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-bold text-ink">
                    {r.author?.fullName || "Mijoz"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < r.rating ? "fill-amber-500 text-amber-500" : "text-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-ink leading-relaxed">{r.comment}</p>

              <p className="text-[10px] text-ink-muted">
                {new Date(r.createdAt).toLocaleDateString("uz-UZ", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
