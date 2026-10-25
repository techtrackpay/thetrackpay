"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ModifiedClassicLoader } from "./loader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image: 
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
      PHYSICAL SKEUOMORPHIC MATERIALS (Restored 3D Depth)
  ---------------------------------------------------------------------- */
  
  /* OUTSIDE THE CARD: Theme-aware text */
  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow: 
          0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent), 
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent)) 
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }

  /* INSIDE THE CARD: Hardcoded Silver/White for the dark background, deep rich shadows */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter: 
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8)) 
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Trackpay Brand-accurate Deep Vibrant Blue-to-Purple Gradient Base Card */
  .premium-depth-card {
      background: linear-gradient(145deg, #092070 0%, #3b085c 50%, #050914 100%);
      box-shadow: 
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.08) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  /* Realistic iPhone Mockup Hardware */
  .iphone-bezel {
      background-color: #0b0f19;
      box-shadow: 
          inset 0 0 0 2px #3f3f46, 
          inset 0 0 0 7px #010409, 
          0 40px 80px -15px rgba(0,0,0,0.95),
          0 15px 25px -5px rgba(0,0,0,0.8);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow: 
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }
  
  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow: 
          0 10px 20px rgba(0,0,0,0.4),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px); 
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #18181B;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }

  .progress-ring-purple {
      transform: rotate(-130deg);
      transform-origin: center;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.1s linear;
  }
  .progress-ring-blue {
      transform: rotate(50deg);
      transform-origin: center;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.1s linear;
  }
  .progress-ring-yellow {
      transform: rotate(140deg);
      transform-origin: center;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.1s linear;
  }
  @media (min-width: 1024px) {
    .brand-overlap-adjust {
      transform: translateX(10%) !important;
    }
  }
`;

export interface CinematicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: React.ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  activeSection?: string;
}

export function CinematicHero({ 
  brandName = "Trackpay",
  tagline1 = "TrackPay | TheTrackPay,",
  tagline2 = "Track the flow of money.",
  cardHeading = "Intelligence in every scroll.",
  cardDescription = <>Watch your financial health in real-time. From spending alerts to bill insights, our UI is built to turn complex data into simple, actionable steps.</>,
  metricValue = 1219,
  metricLabel = "Total Spent",
  ctaHeading = "Control your movement.",
  ctaDescription = "Join the modern financial ecosystem built to track, analyze, and save automatically.",
  activeSection = "home",
  className, 
  ...props 
}: CinematicHeroProps) {
  
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("trackpay_waitlist_joined") === "true";
    } catch {
      return false;
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const handleSync = () => setIsSubmitted(true);
    window.addEventListener("trackpay_waitlist_joined", handleSync);
    return () => window.removeEventListener("trackpay_waitlist_joined", handleSync);
  }, []);

  // Gate the desktop-only extras (mouse parallax, film-grain, scroll blur) to
  // capable devices. The WebGL "tubes" cursor background has been removed
  // entirely in favour of a static image background. It was too laggy.
  const [enableHeavyFX] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cores = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
      return desktop && !reduced && cores >= 4;
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

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // The countdown only shows on the home CTA; don't tick (and re-render the
    // whole mounted-but-hidden hero) while the user is on other sections.
    if (activeSection !== "home") return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

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
              timestamp: timestampVal
            }
          ]
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
        alert("🎉 Success! You have been successfully added to the TrackPay waitlist.");
      } else {
        const errorText = await response.text();
        console.error("Submission failed response:", errorText);
        setSubmitError("Failed to submit. Please ensure your Google Sheet has 'Email' and 'Timestamp' columns in the first row.");
      }
    } catch (error) {
      console.error("Error submitting waitlist:", error);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const bgParallaxRef = useRef<HTMLImageElement>(null);

  // Subtle mouse-driven parallax on the background image (home only).
  // Self-contained, deliberately does not touch the GSAP scroll timeline.
  useEffect(() => {
    if (activeSection !== "home") return;
    const el = bgParallaxRef.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `scale(1.15) translate(${x * -26}px, ${y * -26}px)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [activeSection]);

  // Segment Radii and Circumferences for Dashboard Donut Chart Simulation
  const rOuter = 64;
  const cOuter = 2 * Math.PI * rOuter; // ~402.12

  // 1. Mouse Tracking Parallax and Glow Effects
  useEffect(() => {
    if (activeSection !== "home") return;
    if (!enableHeavyFX) return; // skip per-frame parallax on mobile / low-end
    if (!mockupRef.current) return;

    // Create the tilt interpolators ONCE. gsap.quickTo reuses a single tween
    // per property instead of spawning a new 1.2s tween on every mousemove
    // (the old approach), which is dramatically cheaper and smoother.
    const rotY = gsap.quickTo(mockupRef.current, "rotationY", { duration: 0.7, ease: "power3.out" });
    const rotX = gsap.quickTo(mockupRef.current, "rotationX", { duration: 0.7, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight * 2) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        if (mainCardRef.current) {
          const rect = mainCardRef.current.getBoundingClientRect();
          mainCardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          mainCardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        }

        const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
        const yVal = (e.clientY / window.innerHeight - 0.5) * 2;
        rotY(xVal * 10);
        rotX(-yVal * 10);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, [activeSection, enableHeavyFX]);

  // 2. Complex Cinematic Scroll Timeline with Custom Data Triggers
  useEffect(() => {
    if (activeSection !== "home") return;

    // Reset scroll BEFORE the ScrollTrigger below measures anything. The
    // component stays mounted (display toggled, not unmounted) between
    // sections, so a leftover scrollY from Team/Vision skews the "top top"
    // pin calculation and can make the scrubbed timeline initialize mid-way
    // through, snapping straight past the intro reveal instead of playing it.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });

    // Defensively kill any trigger still tied to this container - guards
    // against a stale instance lingering across the display-toggle cycle.
    ScrollTrigger.getAll().forEach((st) => {
      if (st.trigger === containerRef.current) st.kill();
    });

    const isMobile = window.innerWidth < 768;

    // Route touch/wheel scroll through GSAP's normalized scroller while this
    // pinned timeline is active. Without it, mobile browsers fight the pin
    // recalculation with momentum scroll and address-bar collapse/expand,
    // which is what shows up as jumpy/stuttery scrolling on phones.
    ScrollTrigger.config({ ignoreMobileResize: true });
    const normalizer = ScrollTrigger.normalizeScroll(true);

    const ctx = gsap.context(() => {
      const nirmaanBadge = document.querySelector(".global-nirmaan-badge");

      // Intial Hidden States
      if (nirmaanBadge) {
        gsap.set(nirmaanBadge, { 
          x: "calc(50vw - 50% - 24px)", 
          y: "calc(50vh - 140px - 24px)", 
          scale: 1.1, 
          autoAlpha: 0 
        });
      }
      gsap.set(".text-track", { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(".text-days", { autoAlpha: 1, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".main-card", { y: window.innerHeight + 200, autoAlpha: 1 });
      gsap.set([".card-left-text", ".card-right-text", ".mockup-scroll-wrapper", ".floating-badge", ".phone-widget"], { autoAlpha: 0 });
      gsap.set(".cta-wrapper", { autoAlpha: 0, scale: 0.8, filter: "blur(30px)" });

      // Initial Donut Paths Hidden (Stroke Dashoffset = Circumference)
      gsap.set(".ring-p", { strokeDasharray: cOuter, strokeDashoffset: cOuter });
      gsap.set(".ring-b", { strokeDasharray: cOuter, strokeDashoffset: cOuter });
      gsap.set(".ring-y", { strokeDasharray: cOuter, strokeDashoffset: cOuter });

      // Intro Animations
      const introTl = gsap.timeline({ delay: 0.3 });
      if (nirmaanBadge) {
        introTl.to(nirmaanBadge, { duration: 1.8, autoAlpha: 1, ease: "expo.out" }, 0);
      }
      introTl
        .to(".text-track", { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" }, 0.15)
        .to(".text-days", { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut" }, "-=1.0");

      // Main Pinning Scroll Timeline
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=7000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // NOTE: animating filter: blur() is very expensive to repaint every scroll
      // frame. Keeping the max blur small (6px) plus fading opacity gives the
      // same "recede" feel at a fraction of the paint cost.
      scrollTl.fromTo(".hero-text-wrapper",
        { scale: 1, filter: "blur(0px)", opacity: 1 },
        { scale: 1.15, filter: "blur(6px)", opacity: 0.2, ease: "power2.inOut", duration: 2 },
        0
      );
      scrollTl.fromTo(".bg-grid-theme",
        { scale: 1, filter: "blur(0px)", opacity: 0.5 },
        { scale: 1.15, filter: "blur(6px)", opacity: 0.2, ease: "power2.inOut", duration: 2 },
        0
      );
      scrollTl.to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0);

      if (nirmaanBadge) {
        scrollTl.to(nirmaanBadge, { x: 0, y: 0, scale: 1, ease: "power2.inOut", duration: 2 }, 0);
      }

      scrollTl.to(".main-card", { width: "100%", height: "100%", borderRadius: "0px", ease: "power3.inOut", duration: 1.5 });
        
      // Bring Phone Mockup Viewport into focus
      scrollTl.fromTo(".mockup-scroll-wrapper",
        { y: 300, z: -500, rotationX: 50, rotationY: -30, autoAlpha: 0, scale: 0.6 },
        { y: 0, z: 0, rotationX: 0, rotationY: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 2.5 }, "-=0.8"
      );
      scrollTl.fromTo(".phone-widget", { y: 40, autoAlpha: 0, scale: 0.95 }, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.15, ease: "power2.out", duration: 1.5 }, "-=1.5");
      
      // Counter Currency Incrementor Animation
      scrollTl.to(".counter-val", { 
        innerHTML: metricValue, 
        snap: { innerHTML: 1 }, 
        duration: 2.5, 
        ease: "none",
        onUpdate: function() {
          const el = document.querySelector(".counter-val");
          if(el) el.innerHTML = "₹" + Math.floor(Number(el.innerHTML)).toLocaleString("en-IN");
        }
      }, "-=1.8");

      // Interactive Donut Chart Multi-segment dynamic growth on scroll
      scrollTl.to(".ring-p", { strokeDashoffset: cOuter * 0.50, duration: 1.5, ease: "power2.out" }, "-=2.2");
      scrollTl.to(".ring-b", { strokeDashoffset: cOuter * 0.65, duration: 1.5, ease: "power2.out" }, "-=1.8");
      scrollTl.to(".ring-y", { strokeDashoffset: cOuter * 0.85, duration: 1.5, ease: "power2.out" }, "-=1.4");

      // Badges and description alignments
      scrollTl.fromTo(".floating-badge", { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 }, { y: 0, autoAlpha: 1, scale: 1, rotationZ: 0, ease: "back.out(1.2)", duration: 1.5, stagger: 0.2 }, "-=2.0");
      scrollTl.fromTo(".card-left-text", { x: -50, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 }, "-=1.5");
      scrollTl.fromTo(".card-right-text", { x: 50, autoAlpha: 0, scale: 0.8 }, { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 }, "<");
      
      scrollTl.to({}, { duration: 2.5 });
      scrollTl.set(".hero-text-wrapper", { autoAlpha: 0 });
      scrollTl.set(".cta-wrapper", { autoAlpha: 1 }); 
      scrollTl.to({}, { duration: 1.5 });
      scrollTl.to([".mockup-scroll-wrapper", ".floating-badge", ".card-left-text", ".card-right-text"], {
        scale: 0.9, y: -40, z: -200, autoAlpha: 0, ease: "power3.in", duration: 1.2, stagger: 0.05,
      });
      
      // Responsive card pullback out-animations
      scrollTl.to(".main-card", { 
        width: isMobile ? "92vw" : "85vw", 
        height: isMobile ? "92vh" : "85vh", 
        borderRadius: isMobile ? "32px" : "40px", 
        ease: "expo.inOut", 
        duration: 1.8 
      }, "pullback"); 
      scrollTl.to(".cta-wrapper", { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 }, "pullback");
      scrollTl.to(".main-card", { y: -window.innerHeight - 300, ease: "power3.in", duration: 1.5 });

    }, containerRef);

    // Recalculate trigger start/end now that scroll is at 0 and the section
    // is actually visible again, so the pin math matches reality instead of
    // whatever was measured while the container was still display:none.
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      normalizer?.kill();
    };
  }, [metricValue, cOuter, activeSection]);

  // 3. Force ScrollTrigger refresh on active section change to prevent blank screen issue
  useEffect(() => {
    if (activeSection === "home") {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
      
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [activeSection]); 

  return (
    <div
      ref={containerRef}
      className={cn("relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background text-foreground font-sans antialiased", className)}
      style={{ perspective: "1500px" }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />

      {/* PARALLAX BACKGROUND: subtle photographic depth behind the grid.
          Sits above the container's bg color but below the grid + content. */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <img
          ref={bgParallaxRef}
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80"
          alt=""
          className="h-full w-full object-cover opacity-50 will-change-transform"
          style={{ transform: "scale(1.15)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      {enableHeavyFX && <div className="film-grain" aria-hidden="true" />}
      <div
        className="bg-grid-theme absolute inset-0 z-0 pointer-events-none opacity-50"
        style={{ willChange: "filter, opacity, transform" }}
        aria-hidden="true"
      />

      {/* BACKGROUND LAYER: Hero Typography */}
      <div
        className="hero-text-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 transform-style-3d"
        style={{ willChange: "transform, filter, opacity" }}
      >
        <h1 className="text-track gsap-reveal text-3d-matte text-4xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tight mb-4 max-w-4xl leading-tight">
          {tagline1}
        </h1>
        <h1 className="text-days gsap-reveal text-silver-matte text-4xl md:text-6xl lg:text-[4.5rem] font-extrabold tracking-tighter max-w-5xl leading-none">
          {tagline2}
        </h1>
      </div>

      {/* CONCLUDING OUTRO LAYER: Functional Modern Call-To-Action App Targets */}
      <div className="cta-wrapper absolute z-10 flex flex-col items-center justify-center text-center w-screen px-4 gsap-reveal pointer-events-auto will-change-transform">
        <img 
          src="/image/Trackpay.jpg" 
          alt="Trackpay Logo" 
          className="w-36 h-36 md:w-48 md:h-48 object-contain rounded-[2rem] mb-6 shadow-[0_12px_40px_rgba(0,0,0,0.8)] border-2 border-white/10" 
        />
        <p className="text-muted-foreground text-lg md:text-xl mb-12 max-w-xl mx-auto font-light leading-relaxed">
          {ctaDescription}
        </p>
        <div className="relative z-10 w-[420px] backdrop-blur-xl bg-black/60 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {!isSubmitted ? (
            <>
              <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="flex-1 bg-black/40 border border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-1 focus:ring-white/20 h-12 px-4 rounded-xl backdrop-blur-sm outline-none text-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 text-sm whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmitting ? "Joining..." : "Join Waitlist"}
                  </button>
                </div>
              </form>

              {submitError && (
                <p className="text-red-400 text-xs font-semibold text-center mt-2 animate-pulse mb-4">
                  ⚠️ {submitError}
                </p>
              )}

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium">J</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium">A</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white/20 flex items-center justify-center text-white text-xs font-medium">M</div>
                </div>
                <span className="text-white/70 text-sm">~2k + People already joined</span>
              </div>

              <div className="flex items-center justify-center gap-6 text-center">
                <div>
                  <div className="text-2xl font-light text-white">{timeLeft.days}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">days</div>
                </div>
                <div className="text-white/40">|</div>
                <div>
                  <div className="text-2xl font-light text-white">{timeLeft.hours}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">hours</div>
                </div>
                <div className="text-white/40">|</div>
                <div>
                  <div className="text-2xl font-light text-white">{timeLeft.minutes}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">minutes</div>
                </div>
                <div className="text-white/40">|</div>
                <div>
                  <div className="text-2xl font-light text-white">{timeLeft.seconds}</div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">seconds</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-500/30 flex items-center justify-center border border-green-400/40">
                <svg className="w-8 h-8 text-green-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">You're on the list!</h3>
              <p className="text-white/90 text-sm drop-shadow-md">We'll notify you when we launch. Thanks for joining!</p>
            </div>
          )}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none" />
        </div>
      </div>

      {/* FOREGROUND LAYER: Brand Gradient Geometric Platform Card */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card relative overflow-hidden gsap-reveal flex items-center justify-center pointer-events-auto w-[92vw] md:w-[85vw] h-[92vh] md:h-[85vh] rounded-[32px] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          {/* DYNAMIC RESPONSIVE CONTENT MAPPING */}
          <div className="relative w-full h-full max-w-7xl mx-auto px-4 lg:px-12 flex flex-col justify-evenly lg:grid lg:grid-cols-3 items-center lg:gap-8 z-10 py-6 lg:py-0">
            
            {/* LEFT COLUMN: THE INTERACTIVE INSIGHT PLATFORM HEADING & MICRO-INTERACTION HOOK */}
            <div className="card-left-text gsap-reveal order-3 lg:order-1 flex flex-col justify-center text-center lg:text-left z-20 w-full lg:max-w-none px-4 lg:px-0">
              <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-5 tracking-tight leading-tight">
                {cardHeading}
              </h3>
              <p className="hidden md:block text-neutral-200/70 text-sm md:text-base lg:text-lg font-normal leading-relaxed mx-auto lg:mx-0 max-w-md lg:max-w-none mb-6">
                {cardDescription}
              </p>

            </div>

            {/* MIDDLE COLUMN: ENHANCED FINTECH APP SMARTPHONE SIMULATOR */}
            <div className="mockup-scroll-wrapper order-2 lg:order-2 relative w-full h-[400px] lg:h-[620px] flex items-center justify-center z-10" style={{ perspective: "1000px" }}>
              <div className="relative w-full h-full flex items-center justify-center transform scale-[0.7] md:scale-[0.88] lg:scale-100">
                
                {/* Hardware Bezel Chassis Frame */}
                <div
                  ref={mockupRef}
                  className="relative w-[300px] h-[600px] rounded-[3.25rem] iphone-bezel flex flex-col will-change-transform transform-style-3d"
                >
                  {/* Physical Hardware Elements */}
                  <div className="absolute top-[120px] -left-[3px] w-[3px] h-[25px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[160px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[220px] -left-[3px] w-[3px] h-[45px] hardware-btn rounded-l-md z-0" aria-hidden="true" />
                  <div className="absolute top-[170px] -right-[3px] w-[3px] h-[70px] hardware-btn rounded-r-md z-0 scale-x-[-1]" aria-hidden="true" />

                  {/* High Tech App Viewport Boundary Canvas */}
                  <div className="absolute inset-[8px] bg-[#02050d] rounded-[2.75rem] overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)] text-white z-10">
                    <div className="absolute inset-0 screen-glare z-40 pointer-events-none" aria-hidden="true" />

                    {/* Sensor Dynamic Enclave Housing */}
                    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-full z-50 flex items-center justify-end px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.15)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    </div>

                    {/* Native App Core Framework View Layer */}
                    <div className="relative w-full h-full pt-14 px-5 pb-8 flex flex-col justify-between overflow-hidden">
                      
                      {/* Section Head Nav */}
                      <div className="phone-widget flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold tracking-tight text-neutral-100">Payment History</span>
                        </div>
                        <div className="flex gap-1.5 items-center bg-white/5 border border-white/10 rounded-xl p-1.5 shadow-inner">
                          <div className="w-4 h-4 text-neutral-400 opacity-60">☰</div>
                          <div className="w-5 h-5 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center font-bold text-[10px] border border-blue-500/30">◑</div>
                        </div>
                      </div>

                      {/* Dynamic Spending Breakdowns Analytics Pod */}
                      <div className="phone-widget widget-depth rounded-[2rem] p-5 relative flex flex-col items-center justify-center my-auto bg-gradient-to-b from-white/[0.03] to-transparent">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-3">Spending Breakdown</span>
                        
                        {/* Interactive Segmented Multi-layer Ring Graph container */}
                        <div className="relative w-44 h-44 flex items-center justify-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                          <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
                            {/* Purple Donut Base Ring Segment (50%) */}
                            <circle className="progress-ring-purple ring-p" cx="88" cy="88" r={rOuter} fill="none" stroke="#b08bf8" strokeWidth="13" />
                            {/* Blue Donut Segment (35%) */}
                            <circle className="progress-ring-blue ring-b" cx="88" cy="88" r={rOuter} fill="none" stroke="#638df6" strokeWidth="13" />
                            {/* Yellow Donut Segment (15%) */}
                            <circle className="progress-ring-yellow ring-y" cx="88" cy="88" r={rOuter} fill="none" stroke="#f6c243" strokeWidth="13" />
                          </svg>
                          
                          {/* Central Value Indicators */}
                          <div className="text-center z-10 flex flex-col items-center">
                            <span className="text-[9px] text-neutral-400 font-medium tracking-wide mb-0.5">{metricLabel}</span>
                            <span className="counter-val text-3xl font-extrabold tracking-tight text-white">₹0</span>
                          </div>
                        </div>
                      </div>

                      {/* Realtime Alert Streams Modules Container */}
                      <div className="space-y-2.5">
                        {/* Alert Pod 1 */}
                        <div className="phone-widget rounded-xl p-3 bg-blue-950/20 border border-blue-500/10 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0 text-blue-400 text-xs">
                            ↗
                          </div>
                          <div>
                            <p className="text-neutral-200 font-bold text-xs">Spending Alert</p>
                            <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">You've spent <span className="text-blue-400 font-semibold">15% more</span> on Food compared to last month.</p>
                          </div>
                        </div>

                        {/* Alert Pod 2 */}
                        <div className="phone-widget rounded-xl p-3 bg-amber-950/20 border border-amber-500/10 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0 text-amber-400 text-xs">
                            ⚡
                          </div>
                          <div>
                            <p className="text-neutral-200 font-bold text-xs">Bill Insight</p>
                            <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">Your <span className="font-semibold text-white">Electricity Bill</span> is <span className="text-red-400 font-medium">15% higher</span> (₹1,650) than usual.</p>
                          </div>
                        </div>
                      </div>

                      {/* Home Platform System Indicator */}
                      <div className="w-[110px] h-[4px] bg-white/20 rounded-full mx-auto mt-4 shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Floating Glass Badges Contextual Layout Overlays */}
                <div className="floating-badge absolute flex top-12 left-[-15px] lg:left-[-70px] floating-ui-badge rounded-xl p-3 items-center gap-3 z-30">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-purple-500/20 to-purple-900/10 flex items-center justify-center border border-purple-400/30 shadow-inner text-base">
                    💳
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold tracking-tight">Subscriptions</p>
                    <p className="text-purple-300/60 text-[10px] font-medium">₹649 Tracked</p>
                  </div>
                </div>

                <div className="floating-badge absolute flex bottom-24 right-[-15px] lg:right-[-70px] floating-ui-badge rounded-xl p-3 items-center gap-3 z-30">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-900/10 flex items-center justify-center border border-emerald-400/30 shadow-inner text-base">
                    🛡️
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold tracking-tight">Auto Savings</p>
                    <p className="text-emerald-300/60 text-[10px] font-medium">Smart rule active</p>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: BRAND GRAPHICS EMBLEM */}
            <div className="card-right-text gsap-reveal order-1 lg:order-3 flex justify-center lg:justify-end z-20 w-full">
              <h2 className="text-5xl md:text-[5.5rem] lg:text-[7.5rem] font-black uppercase tracking-tighter text-card-silver-matte brand-overlap-adjust">
                {brandName}
              </h2>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
