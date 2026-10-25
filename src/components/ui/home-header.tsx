"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Menu, X, Mail, Sparkles, Loader2 } from "lucide-react";

interface HomeHeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Team", id: "team" },
  { label: "Vision", id: "vision" },
  { label: "Survey", id: "survey" },
];

/**
 * Banner-style top navigation for the home page (adapted from
 * responsive-hero-banner): TrackPay logo on the left, a glassy pill of nav
 * links + an expandable "Join Waitlist" CTA on the right, and a mobile dropdown.
 * Wired to the app's SPA navigation, SheetDB waitlist backend, and synced confirmation.
 */
export function HomeHeader({ activeSection, setActiveSection }: HomeHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("trackpay_waitlist_joined") === "true";
    } catch {
      return false;
    }
  });

  const calculateTimeLeft = () => {
    const targetDate = new Date("2026-10-31T00:00:00+05:30");
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  // Sync submission state across components
  useEffect(() => {
    const handleSync = () => setIsSubmitted(true);
    window.addEventListener("trackpay_waitlist_joined", handleSync);
    return () => window.removeEventListener("trackpay_waitlist_joined", handleSync);
  }, []);

  // Update countdown timer while waitlist panel is open
  useEffect(() => {
    if (!isWaitlistOpen) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [isWaitlistOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isWaitlistOpen) {
        setIsWaitlistOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isWaitlistOpen]);

  const go = (id: string) => {
    setMobileMenuOpen(false);
    setIsWaitlistOpen(false);
    setActiveSection(id);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const timestampVal = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      const response = await fetch("https://sheetdb.io/api/v1/lflhlaw3h4ppo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            {
              Email: email,
              email: email,
              Timestamp: timestampVal,
              timestamp: timestampVal,
            },
          ],
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        try {
          localStorage.setItem("trackpay_waitlist_joined", "true");
          window.dispatchEvent(new Event("trackpay_waitlist_joined"));
        } catch (e) {
          console.warn("Could not save to localStorage", e);
        }
        setTimeout(() => {
          alert("🎉 Success! You have been successfully added to the TrackPay waitlist.");
        }, 100);
      } else {
        const errorText = await response.text();
        console.error("Submission failed response:", errorText);
        setSubmitError(
          "Failed to submit. Please ensure your Google Sheet has 'Email' and 'Timestamp' columns in the first row."
        );
      }
    } catch (error) {
      console.error("Error submitting waitlist:", error);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="mx-4 sm:mx-6">
        <div className="flex items-center justify-between pt-4">
          {/* Logo + Nirmaan chip */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button
              onClick={() => go("home")}
              className="inline-flex items-center gap-2.5"
              aria-label="TrackPay home"
            >
              <img
                src="/image/Trackpay.jpg"
                alt="TrackPay"
                className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/15"
              />
              <span className="text-white font-semibold tracking-tight text-lg">TrackPay</span>
            </button>
            <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1.5 ring-1 ring-white/10 backdrop-blur">
              <img src="/image/Nirmaan.png" alt="" className="h-4 w-4 object-contain" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80">
                Pre-Incub at Nirmaan IITM
              </span>
            </div>
          </div>

          {/* Desktop nav pill */}
          <nav className="pointer-events-auto hidden md:flex items-center">
            <div className="flex items-center gap-1 rounded-full bg-white/5 px-1 py-1 ring-1 ring-white/10 backdrop-blur">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => go(link.id)}
                    className={`px-3 py-2 text-sm font-medium font-sans transition-colors hover:text-white ${
                      isActive ? "text-white" : "text-white/70"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* Join Waitlist trigger button */}
              <button
                onClick={() => setIsWaitlistOpen((prev) => !prev)}
                aria-expanded={isWaitlistOpen}
                className={`ml-1 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium font-sans transition-all duration-300 ${
                  isWaitlistOpen
                    ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] ring-2 ring-indigo-400/50"
                    : "bg-white text-neutral-900 hover:bg-white/90"
                }`}
              >
                <span>{isWaitlistOpen ? "Close" : "Join Waitlist"}</span>
                {isWaitlistOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              if (isWaitlistOpen) setIsWaitlistOpen(false);
            }}
            className="pointer-events-auto md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur text-white/90"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto md:hidden mt-3 rounded-2xl bg-black/40 p-2 ring-1 ring-white/10 backdrop-blur-xl">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                className={`block w-full text-left rounded-xl px-4 py-3 text-sm font-medium font-sans transition-colors ${
                  activeSection === link.id ? "text-white bg-white/5" : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWaitlistOpen(true);
              }}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-3 text-sm font-medium text-white font-sans transition-colors shadow-[0_0_15px_rgba(99,102,241,0.35)]"
            >
              Join Waitlist
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Animated Expandable Top Bar Waitlist Section */}
        <AnimatePresence>
          {isWaitlistOpen && (
            <>
              {/* Dimmed backdrop overlay */}
              <motion.div
                key="waitlist-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsWaitlistOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm pointer-events-auto"
                aria-hidden="true"
              />

              {/* Expandable top bar card */}
              <motion.div
                key="waitlist-panel"
                initial={{ opacity: 0, y: -24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -24, scale: 0.96 }}
                transition={{ type: "spring", damping: 25, stiffness: 320 }}
                className="pointer-events-auto relative z-50 mt-4 mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-slate-950/90 p-6 sm:p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_45px_rgba(99,102,241,0.25)]"
              >
                {/* Decorative radial gradient highlight */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-purple-500/5 to-transparent pointer-events-none" />

                {/* Top card header */}
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-white tracking-tight">Join the Waitlist</h3>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Early Access
                        </span>
                      </div>
                      <p className="text-xs text-white/60">Be the first to experience TrackPay automated finance</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsWaitlistOpen(false)}
                    className="rounded-full p-1.5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close waitlist panel"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!isSubmitted ? (
                  <div className="relative z-10">
                    <form onSubmit={handleWaitlistSubmit} className="mb-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                          <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            disabled={isSubmitting}
                            className="w-full bg-black/50 border border-white/20 text-white placeholder:text-white/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 h-12 pl-10 pr-4 rounded-xl backdrop-blur-sm outline-none text-sm transition-all disabled:opacity-50"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 text-sm whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Joining...</span>
                            </>
                          ) : (
                            <>
                              <span>Join Waitlist</span>
                              <ArrowUpRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>

                    {submitError && (
                      <p className="text-red-400 text-xs font-semibold text-center mt-2 animate-pulse mb-3">
                        ⚠️ {submitError}
                      </p>
                    )}

                    {/* Social proof + Live countdown timer */}
                    <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
                      <div className="flex items-center gap-2.5">
                        <div className="flex -space-x-1.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border border-white/30 flex items-center justify-center text-[10px] text-white font-semibold">
                            J
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border border-white/30 flex items-center justify-center text-[10px] text-white font-semibold">
                            A
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border border-white/30 flex items-center justify-center text-[10px] text-white font-semibold">
                            M
                          </div>
                        </div>
                        <span>~2k + People already joined</span>
                      </div>

                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/60">
                        <span className="text-white font-semibold">{timeLeft.days}d</span>
                        <span>:</span>
                        <span className="text-white font-semibold">{timeLeft.hours}h</span>
                        <span>:</span>
                        <span className="text-white font-semibold">{timeLeft.minutes}m</span>
                        <span>:</span>
                        <span className="text-white font-semibold">{timeLeft.seconds}s</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Confirmation screen matching the last portion of the home page */
                  <div className="relative z-10 text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-500/30 flex items-center justify-center border border-green-400/40 shadow-[0_0_25px_rgba(52,211,153,0.35)]">
                      <svg
                        className="w-8 h-8 text-green-400 drop-shadow-lg"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">
                      You're on the list!
                    </h3>
                    <p className="text-white/90 text-sm drop-shadow-md mb-6 max-w-sm mx-auto">
                      We'll notify you when we launch. Thanks for joining!
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsWaitlistOpen(false)}
                        className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold tracking-wider uppercase transition-colors border border-white/10"
                      >
                        Done
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setEmail("");
                        }}
                        className="px-4 py-2 text-xs text-white/60 hover:text-white transition-colors underline underline-offset-4"
                      >
                        Enter another email
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default HomeHeader;

