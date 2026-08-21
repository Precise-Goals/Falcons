import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./Feedback.css";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import toast from "react-hot-toast";

/* ── Star labels ─────────────────────────────────────────── */
const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

/* ── Helpers ─────────────────────────────────────────────── */
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const formatDate = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
};

/* ── Star Rating Input ───────────────────────────────────── */
const StarInput = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <>
      <div className="fb-stars" role="group" aria-label="Star rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`fb-star${active >= star ? " filled" : ""}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            role="button"
            aria-label={`${star} star`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onChange(star)}
          >
            ★
          </span>
        ))}
      </div>
      <p className="fb-star-label">{STAR_LABELS[active]}</p>
    </>
  );
};

/* ── Feedback Card ───────────────────────────────────────── */
const FeedbackCard = ({ item }) => (
  <div className="fb-card">
    <div className="fb-card-header">
      <div className="fb-avatar">{getInitials(item.name)}</div>
      <div className="fb-card-meta">
        <div className="fb-card-name">{item.name || "Anonymous"}</div>
        <div className="fb-card-date">{formatDate(item.createdAt)}</div>
      </div>
    </div>
    <div className="fb-card-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= item.rating ? "#f5c518" : "#333", fontSize: "14px" }}>
          ★
        </span>
      ))}
    </div>
    <p className="fb-card-comment">{item.comment}</p>
  </div>
);

/* ── Rate limiter (localStorage) ────────────────────────── */
const LIMIT_KEY = "fb_last_submit";
const LIMIT_MS = 24 * 60 * 60 * 1000; // 24h

const canSubmit = () => {
  const last = localStorage.getItem(LIMIT_KEY);
  if (!last) return true;
  return Date.now() - parseInt(last, 10) > LIMIT_MS;
};

const markSubmit = () => localStorage.setItem(LIMIT_KEY, Date.now().toString());

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export const FeedbackSection = () => {
  // Form state
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Carousel state
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(true);

  /* ── Load approved feedbacks for carousel ─────────────── */
  const loadApproved = useCallback(async () => {
    setLoadingCarousel(true);
    try {
      const q = query(
        collection(db, "feedbacks"),
        where("approved", "==", true),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setApprovedFeedbacks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      // Fallback: fetch without orderBy (index not yet created)
      try {
        const q2 = query(collection(db, "feedbacks"), where("approved", "==", true));
        const snap2 = await getDocs(q2);
        setApprovedFeedbacks(snap2.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {
        setApprovedFeedbacks([]);
      }
    } finally {
      setLoadingCarousel(false);
    }
  }, []);

  useEffect(() => {
    loadApproved();
  }, [loadApproved]);

  /* ── Submit ──────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!comment.trim() || comment.trim().length < 10) {
      toast.error("Comment must be at least 10 characters");
      return;
    }
    if (!canSubmit()) {
      toast.error("You can submit feedback once every 24 hours");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, "feedbacks"), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rating,
        comment: comment.trim(),
        approved: false,
        createdAt: serverTimestamp(),
      });
      markSubmit();
      setSubmitted(true);
      toast.success("Thank you for your feedback! 🎉");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="fb-section" id="feedback" aria-label="Community Feedback">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="fb-header">
        <p className="fb-eyebrow">Community Voice</p>
        <h2 className="fb-title">What Our Community Says</h2>
        <p className="fb-subtitle">
          Real feedback from real Falcons members
        </p>
      </div>

      {/* ── Body: Form + Carousel ─────────────────────────── */}
      <div className="fb-body">
        {/* ── Left: Submission Form ──────────────────────── */}
        <div className="fb-form-card">
          {submitted ? (
            <div className="fb-success">
              <div className="fb-success-check">✓</div>
              <h3>Feedback Received</h3>
              <p>
                Your response will appear in the community carousel after
                admin review. Thank you!
              </p>
            </div>
          ) : (
            <>
              <h3 className="fb-form-title">Share Your Experience</h3>
              <form onSubmit={handleSubmit} noValidate>
                <StarInput value={rating} onChange={setRating} />

                <div className="fb-row">
                  <div className="fb-field">
                    <label htmlFor="fb-name">Your Name</label>
                    <input
                      id="fb-name"
                      className="fb-input"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={60}
                      required
                    />
                  </div>
                  <div className="fb-field">
                    <label htmlFor="fb-email">Email Address</label>
                    <input
                      id="fb-email"
                      className="fb-input"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="fb-field">
                  <label htmlFor="fb-comment">Your Feedback</label>
                  <textarea
                    id="fb-comment"
                    className="fb-textarea"
                    placeholder="Tell us about your experience with Falcons..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="fb-submit-btn"
                  disabled={submitting}
                  id="fb-submit"
                >
                  {submitting ? "Submitting…" : "Submit Feedback"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* ── Right: Carousel ───────────────────────────── */}
        <div className="fb-carousel-side">
          <div>
            <div className="fb-carousel-label">Community Reviews</div>
            <p className="fb-carousel-sub">
              {approvedFeedbacks.length > 0
                ? `${approvedFeedbacks.length} verified review${approvedFeedbacks.length !== 1 ? "s" : ""}`
                : "Be the first to leave a review!"}
            </p>
          </div>

          {loadingCarousel ? (
            <div className="fb-empty">Loading reviews…</div>
          ) : approvedFeedbacks.length === 0 ? (
            <div className="fb-empty">
              No reviews yet — yours could be the first!
            </div>
          ) : (
            <Swiper
              className="fb-swiper"
              modules={[Autoplay, Pagination, A11y]}
              spaceBetween={16}
              slidesPerView={1}
              loop={approvedFeedbacks.length > 1}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{ clickable: true }}
              a11y={{ prevSlideMessage: "Previous review", nextSlideMessage: "Next review" }}
            >
              {approvedFeedbacks.map((item) => (
                <SwiperSlide key={item.id}>
                  <FeedbackCard item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};
