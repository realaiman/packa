import React, { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu, X, Search, Phone, Mail, MapPin, ChevronRight, ChevronLeft,
  ChevronDown, Star, ArrowUpRight, ArrowUp, Truck, Leaf, Ruler,
  PenTool, ShieldCheck, PackageCheck, Clock, Sparkles, Upload,
  CheckCircle2, Plus, Minus,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

/* Hero slideshow images — place these three files next to App.jsx
   (or update the paths below to wherever you keep them in your project). */
import heroImg1 from "./vertex-hero-1.png";
import heroImg2 from "./vertex-hero-2.png";
import heroImg3 from "./vertex-hero-3.png";

/* =========================================================================
   PACKCRAFT.CO — Premium Custom Packaging
   Design tokens
   Ink       #17140F   near-black, warm
   Paper     #FBFAF6   warm white
   Stone     #EEEAE2   soft gray
   Kraft     #C9A876   kraft paper tan (material accent)
   Ember     #D9480F   primary burnt-orange
   Ember Dk  #A8380B   hover / deep
   Display + body + utility type: "Geist Sans" (Vercel's Geist family),
   with "Geist Mono" for spec labels, numbering, die-line tags.
   Signature element: registration / crop marks + unfolding die-line box,
   used as a recurring motif (corners of cards, section markers, hero).
   ========================================================================= */

const COLORS = {
  ink: "#17140F",
  paper: "#FBFAF6",
  stone: "#EEEAE2",
  stone2: "#E4DFD4",
  kraft: "#C9A876",
  ember: "#D9480F",
  emberDk: "#A8380B",
  emberSoft: "#F3C7AE",
};

/* ---------------------------------------------------------------------- */
/* Fonts + global keyframes                                               */
/* ---------------------------------------------------------------------- */
const GlobalStyle = () => (
  <style>{`
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.1.1/index.css');
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.1.1/500.css');
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.1.1/600.css');
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.1.1/700.css');
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5.1.1/index.css');
    @import url('https://cdn.jsdelivr.net/npm/@fontsource/geist-mono@5.1.1/500.css');

    html { scroll-behavior: smooth; }
    * { font-family: 'Geist Sans', 'Inter', sans-serif; }
    .font-display { font-family: 'Geist Sans', sans-serif; font-weight: 600; letter-spacing: -0.02em; }
    .font-mono { font-family: 'Geist Mono', monospace; }

    ::selection { background: ${COLORS.ember}; color: ${COLORS.paper}; }

    body { background: ${COLORS.paper}; }

    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .animate-marquee { animation: marquee 32s linear infinite; }

    @keyframes floatY { 0%,100% { transform: translateY(0) rotate(var(--r,0deg)); } 50% { transform: translateY(-18px) rotate(var(--r,0deg)); } }
    .float-slow { animation: floatY 6s ease-in-out infinite; }
    .float-med { animation: floatY 4.5s ease-in-out infinite; }
    .float-fast { animation: floatY 3.2s ease-in-out infinite; }

    @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .spin-slow { animation: spinSlow 22s linear infinite; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
    .reveal { opacity: 0; }
    .reveal.is-visible { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) forwards; }

    @keyframes drawLine { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }

    @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(217,72,15,.35); } 100% { box-shadow: 0 0 0 14px rgba(217,72,15,0); } }
    .pulse-ring { animation: pulseRing 2.2s ease-out infinite; }

    @keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
    .skeleton { background: linear-gradient(90deg, #EEEAE2 0%, #F6F3EC 50%, #EEEAE2 100%); background-size: 800px 100%; animation: shimmer 1.6s linear infinite; }

    .crop::before, .crop::after { content: ''; position: absolute; width: 14px; height: 14px; border-color: ${COLORS.ink}; opacity: .35; }
    .crop::before { top: -1px; left: -1px; border-top: 1.5px solid; border-left: 1.5px solid; }
    .crop::after { bottom: -1px; right: -1px; border-bottom: 1.5px solid; border-right: 1.5px solid; }

    .grain { position: relative; }
    .grain::after {
      content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .045;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    input:focus, textarea:focus, select:focus, button:focus-visible, a:focus-visible {
      outline: 2px solid ${COLORS.ember}; outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-marquee, .float-slow, .float-med, .float-fast, .spin-slow, .pulse-ring { animation: none !important; }
      .reveal { opacity: 1 !important; animation: none !important; }
      html { scroll-behavior: auto; }
    }
  `}</style>
);

/* ---------------------------------------------------------------------- */
/* Reveal-on-scroll hook                                                  */
/* ---------------------------------------------------------------------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

const Reveal = ({ as: Tag = "div", delay = 0, className = "", children, ...rest }) => {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ animationDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
};

/* ---------------------------------------------------------------------- */
/* Signature graphic: die-line box mark                                   */
/* ---------------------------------------------------------------------- */
const BoxMark = ({ size = 48, color = COLORS.ink, dashed = true }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M8 20L32 8L56 20L32 32L8 20Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8 20V44L32 56V32" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M56 20V44L32 56" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    {dashed && <path d="M8 20L32 32L56 20" stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity=".5" />}
  </svg>
);

/* Lighten/darken a hex colour by a percentage — used to shade the isometric box faces. */
const shade = (hex, percent) => {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
};

/* ---------------------------------------------------------------------- */
/* Isometric product-box illustration — self-contained SVG, no external   */
/* images, so every category always renders (mailer / crate / bottle /    */
/* ribbon / window variants share the same base cube).                    */
/* ---------------------------------------------------------------------- */
const BoxArt = ({ hue, variant = "plain", className = "" }) => {
  const top = shade(hue, 60);
  const left = shade(hue, -8);
  const right = shade(hue, -42);
  const tape = "rgba(251,250,246,0.92)";
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="190" rx="72" ry="8" fill="#000" opacity="0.1" />
      {/* top face */}
      <polygon points="100,18 180,60 100,102 20,60" fill={top} />
      {/* left face */}
      <polygon points="20,60 100,102 100,182 20,140" fill={left} />
      {/* right face */}
      <polygon points="180,60 100,102 100,182 180,140" fill={right} />

      {variant === "crate" && (
        <>
          <line x1="24" y1="88" x2="96" y2="129" stroke={shade(hue, -60)} strokeWidth="2.5" opacity="0.35" />
          <line x1="24" y1="113" x2="96" y2="154" stroke={shade(hue, -60)} strokeWidth="2.5" opacity="0.35" />
          <line x1="176" y1="88" x2="104" y2="129" stroke={shade(hue, -70)} strokeWidth="2.5" opacity="0.35" />
          <line x1="176" y1="113" x2="104" y2="154" stroke={shade(hue, -70)} strokeWidth="2.5" opacity="0.35" />
          <rect x="14" y="96" width="172" height="6" fill={COLORS.kraft} opacity="0.55" transform="skewY(0)" />
        </>
      )}

      {variant === "bottle" && (
        <>
          <rect x="68" y="2" width="16" height="26" rx="4" fill={shade(hue, -25)} />
          <rect x="116" y="2" width="16" height="26" rx="4" fill={shade(hue, -25)} />
          <rect x="72" y="8" width="8" height="14" rx="2" fill={tape} opacity="0.5" />
          <rect x="120" y="8" width="8" height="14" rx="2" fill={tape} opacity="0.5" />
          <line x1="100" y1="24" x2="100" y2="98" stroke={shade(hue, -45)} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.55" />
        </>
      )}

      {variant === "ribbon" && (
        <>
          <polygon points="20,108 100,150 100,167 20,125" fill={COLORS.ember} opacity="0.95" />
          <polygon points="180,108 100,150 100,167 180,125" fill={COLORS.emberDk} opacity="0.95" />
          <circle cx="100" cy="150" r="11" fill={COLORS.emberDk} />
          <circle cx="100" cy="150" r="4.5" fill={COLORS.emberSoft} />
        </>
      )}

      {variant === "window" && (
        <rect x="34" y="112" width="52" height="42" rx="3" fill="rgba(251,250,246,0.55)" stroke="rgba(251,250,246,0.85)" strokeWidth="1.5" />
      )}

      {variant === "mailer" && (
        <polygon points="42,144 64,144 64,131 88,152 64,173 64,160 42,160" fill={tape} opacity="0.9" />
      )}

      {/* seam tape running down the front */}
      <rect x="94" y="60" width="12" height="122" fill={tape} opacity="0.85" />
      <polygon points="94,60 106,60 100,102" fill={tape} opacity="0.6" />
    </svg>
  );
};

/* Tries the real product photo first; if it 404s or fails to load, falls back
   to the illustrated BoxArt so a category card is never left broken. */
const SmartBoxImage = ({ img, hue, variant, alt, artSize = "w-28" }) => {
  const [broken, setBroken] = useState(false);
  if (img && !broken) {
    return (
      <img
        src={img}
        alt={alt}
        loading="lazy"
        onError={() => setBroken(true)}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-1/2 h-1/2 rounded-full opacity-20 pointer-events-none" style={{ background: hue, filter: "blur(28px)" }} />
      <BoxArt hue={hue} variant={variant} className={`relative ${artSize} drop-shadow-md transition-transform duration-500 group-hover:scale-110`} />
    </div>
  );
};

const SectionTag = ({ n, label }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="font-mono text-xs tracking-widest px-2 py-1 border" style={{ borderColor: COLORS.ink, color: COLORS.ember }}>
      {n}
    </span>
    <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: COLORS.ink, opacity: 0.55 }}>
      {label}
    </span>
    <span className="h-px flex-1" style={{ background: COLORS.ink, opacity: 0.15 }} />
  </div>
);

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Journal", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const CATEGORIES = [
  {
    id: "mailer", name: "Mailer Boxes", spec: "SHIP-02", hue: "#D9480F", variant: "mailer", img: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=800&q=80",
    blurb: "E-flute shippers built for overnight lanes — self-locking tabs, zero tape needed.",
    material: "E-flute corrugated, matte or gloss laminate", sizes: "6×4×4 in — 24×18×12 in, custom on request",
    finishes: "Self-seal tabs, tear strips, 1–4 colour offset print", idealFor: "DTC shipping, subscription boxes, overnight parcels",
  },
  {
    id: "rigid", name: "Rigid Boxes", spec: "LUX-14", hue: "#8A6A3F", variant: "ribbon", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5R3J2go5vWXcXBCkhltT52ZhLH-Eh0L-UiZP4Mhn5yo5284_JUUnt4Lw&s=10",
    blurb: "Two-piece, magnet-close and telescoping builds with the heft of a keepsake.",
    material: "1.5–2mm greyboard, wrapped in litho-laminated stock", sizes: "Fully custom to product mould",
    finishes: "Magnetic closure, ribbon pull, foil edge, soft-touch", idealFor: "Electronics, gift sets, premium unboxing",
  },
  {
    id: "cosmetic", name: "Cosmetic Boxes", spec: "BTY-07", hue: "#B25B8C", variant: "window", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    blurb: "Foiled edges and window cuts that hold up under retail-counter lighting.",
    material: "300–400gsm SBS art card", sizes: "Tuck, sleeve or hinge-lid, made-to-fit",
    finishes: "Spot UV, hot foil, PVC window patching", idealFor: "Skincare, fragrance, beauty counters",
  },
  {
    id: "cbd", name: "CBD Boxes", spec: "REG-31", hue: "#5C7A4A", variant: "plain", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80",
    blurb: "Compliance-ready panels with child-resistant options, built for tight regulation.",
    material: "350gsm kraft or SBS board", sizes: "Tincture, tin and pouch carton formats",
    finishes: "Matte lamination, child-resistant lock tabs, batch coding", idealFor: "Tinctures, edibles, regulated wellness products",
  },
  {
    id: "food", name: "Food Boxes", spec: "FSC-09", hue: "#C97A2B", variant: "window", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5R3J2go5vWXcXBCkhltT52ZhLH-Eh0L-UiZP4Mhn5yo5284_JUUnt4Lw&s=10",
    blurb: "Grease-resistant, food-safe stock that keeps its crease through delivery.",
    material: "FSC food-grade kraft, PE or grease-barrier coated", sizes: "Single-serve to full-meal carrier formats",
    finishes: "Vented lids, grease-proof lining, tamper seals", idealFor: "Takeaway, delivery kitchens, meal kits",
  },
  {
    id: "soap", name: "Soap Boxes", spec: "ART-18", hue: "#4E7B87", variant: "plain", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    blurb: "Sleeve and tray builds sized to the bar, not the other way around.",
    material: "250–300gsm art card, uncoated or matte", sizes: "Bar, sleeve and multi-pack formats",
    finishes: "Debossing, kraft wrap, vegetable-ink print", idealFor: "Handmade soap, bath and body brands",
  },
  {
    id: "candle", name: "Candle Boxes", spec: "GLO-22", hue: "#6E5A9E", variant: "window", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5R3J2go5vWXcXBCkhltT52ZhLH-Eh0L-UiZP4Mhn5yo5284_JUUnt4Lw&s=10",
    blurb: "Insulated corners and snug inserts so glass jars ship without a rattle.",
    material: "E-flute corrugated with die-cut foam or card insert", sizes: "Single-jar to 6-pack carrier formats",
    finishes: "Matte print, foil labelling, shock-absorb corners", idealFor: "Glass and tin candle brands, gift bundles",
  },
  {
    id: "bakery", name: "Bakery Boxes", spec: "FRS-05", hue: "#C9A876", variant: "window", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    blurb: "Vented, grease-proof kraft that keeps pastry crisp on the counter and in transit.",
    material: "Natural or bleached kraft, grease-resistant coating", sizes: "Single-slice to full-cake formats",
    finishes: "Steam vents, viewing windows, kraft twine tie", idealFor: "Bakeries, patisseries, cafés",
  },
  {
    id: "display", name: "Display Boxes", spec: "POS-11", hue: "#3E5C76", variant: "plain", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80",
    blurb: "Counter-ready POS units engineered to hold their shape through a full shift.",
    material: "C-flute corrugated with litho-laminated face", sizes: "Counter, floor-standing and pallet formats",
    finishes: "Full-colour offset, structural risers, easy-assemble", idealFor: "Retail launches, seasonal promotions",
  },
  {
    id: "corrugated", name: "Corrugated Boxes", spec: "IND-40", hue: "#7A5230", variant: "crate", img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80",
    blurb: "Export-grade crates rated for pallet loads and long freight lanes.",
    material: "B, C or E-flute, single to triple wall", sizes: "Up to full pallet-load export crates",
    finishes: "Stitch, glue or tape closure, stackable ECT rating", idealFor: "Freight, industrial goods, export shipments",
  },
  {
    id: "retail", name: "Retail Packaging", spec: "RTL-03", hue: "#A8380B", variant: "plain", img: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=800&q=80",
    blurb: "Shelf-ready cartons and shoppers built to do double duty as a billboard.",
    material: "SBS carton or corrugated shelf-ready case", sizes: "Aisle-standard and custom shelf formats",
    finishes: "Perforated tear panels, full-bleed branding", idealFor: "Big-box retail, grocery, shelf resets",
  },
  {
    id: "luxury", name: "Luxury Packaging", spec: "PRM-01", hue: "#17140F", variant: "ribbon", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5R3J2go5vWXcXBCkhltT52ZhLH-Eh0L-UiZP4Mhn5yo5284_JUUnt4Lw&s=10",
    blurb: "Soft-touch lamination, foil and emboss for a box that outclasses the unboxing video.",
    material: "Rigid board wrapped in specialty stock or fabric", sizes: "Fully bespoke, prototyped before production",
    finishes: "Foil, emboss/deboss, magnetic close, ribbon pull", idealFor: "Flagship products, VIP gifting, limited editions",
  },
  {
    id: "bottle", name: "Bottle Boxes", spec: "BTL-26", hue: "#2F6F5E", variant: "bottle", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5R3J2go5vWXcXBCkhltT52ZhLH-Eh0L-UiZP4Mhn5yo5284_JUUnt4Lw&s=10",
    blurb: "Divided cells and shock corners so bottles travel without a clink.",
    material: "Corrugated outer with die-cut card or foam dividers", sizes: "Single-bottle to 12-bottle case formats",
    finishes: "Cell inserts, carry handles, tamper-evident seals", idealFor: "Wine, spirits, oils and glass beverage bottles",
  },
];

const WHY_US = [
  { icon: ShieldCheck, title: "Archival-grade Print", copy: "Colour-managed offset & digital presses held to a tight Delta-E tolerance, run to run." },
  { icon: Clock, title: "9–12 Day Turnaround", copy: "Standard production clears in under two weeks, rush lanes available on request." },
  { icon: PackageCheck, title: "No Minimum Order", copy: "Prototype a single unit or commission a container load — same tooling, same care." },
  { icon: Leaf, title: "FSC-Certified Stock", copy: "Every board is traceable to responsibly managed forestry, PVC-free by default." },
  { icon: PenTool, title: "Complimentary Design", copy: "A structural engineer and a print designer review every file before it runs." },
  { icon: Truck, title: "Freight Included", copy: "Palletised delivery to sixty-one countries, duty-paid on enterprise accounts." },
];

const SERVICES = [
  "Offset Printing", "Digital Printing", "Structural Design", "Custom Sizing",
  "Embossing & Debossing", "Foil Stamping", "Spot UV Coating", "Window Patching",
  "Precision Die-Cutting", "Custom Inserts",
];

const PROCESS = [
  { n: "01", t: "Consultation", d: "A packaging engineer scopes volume, material and unit economics with you." },
  { n: "02", t: "Structural Design", d: "Die-lines are drafted to the millimetre and pressure-tested in CAD." },
  { n: "03", t: "Prototype", d: "A physical sample ships before any production run is scheduled." },
  { n: "04", t: "Printing", d: "Offset or digital plates are pulled once colour proofs are signed off." },
  { n: "05", t: "Finishing", d: "Foiling, UV, embossing and die-cutting are applied in sequence." },
  { n: "06", t: "Delivery", d: "Quality-checked cartons are palletised and freighted to your dock." },
];

const PORTFOLIO_ITEMS = [
  { id: 1, name: "Auric Skincare — Rigid Set", cat: "cosmetic", hue: "#B25B8C", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80" },
  { id: 2, name: "Northbound Coffee — Mailer", cat: "mailer", hue: "#D9480F", img: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=700&q=80" },
  { id: 3, name: "Verdant CBD — Tincture Case", cat: "cbd", hue: "#5C7A4A", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=80" },
  { id: 4, name: "Maison Pâtisserie — Bakery", cat: "bakery", hue: "#C9A876", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80" },
  { id: 5, name: "Ember & Wick — Candle Duo", cat: "candle", hue: "#6E5A9E", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80" },
  { id: 6, name: "Fielder Goods — Soap Tray", cat: "soap", hue: "#4E7B87", img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80" },
  { id: 7, name: "Halcyon Retail — Shopper", cat: "retail", hue: "#A8380B", img: "https://images.unsplash.com/photo-1607166452427-7e4477079cb9?auto=format&fit=crop&w=700&q=80" },
  { id: 8, name: "Atelier Noir — Luxury Case", cat: "luxury", hue: "#17140F", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80" },
  { id: 9, name: "Cascade Foods — Corrugate", cat: "corrugated", hue: "#7A5230", img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=700&q=80" },
  { id: 10, name: "Lumen Display — POS Unit", cat: "display", hue: "#3E5C76", img: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=700&q=80" },
  { id: 11, name: "Orchard Press — Food Box", cat: "food", hue: "#C97A2B", img: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=700&q=80" },
  { id: 12, name: "Solstice Beauty — Rigid", cat: "rigid", hue: "#8A6A3F", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80" },
];

const PORTFOLIO_FILTERS = ["all", "mailer", "rigid", "cosmetic", "cbd", "food", "candle"];

const TESTIMONIALS = [
  { name: "Priya Nandan", role: "Founder, Auric Skincare", quote: "PackCraft.co rebuilt our rigid box tooling twice at no charge until the magnetic close felt right. That kind of patience is rare from a manufacturer.", rating: 5 },
  { name: "Marcus Webb", role: "Ops Lead, Northbound Coffee", quote: "We moved eighty thousand mailers through them last quarter without a single warped panel. The QA reporting alone justified the switch.", rating: 5 },
  { name: "Elena Voss", role: "Creative Director, Atelier Noir", quote: "Their structural team caught a fold-strength issue our previous printer never flagged. It saved us a recall.", rating: 5 },
  { name: "Daniyal Raza", role: "Founder, Fielder Goods", quote: "No minimum order meant we could prototype three finishes before committing capital. Genuinely founder-friendly.", rating: 5 },
];

const BLOG_POSTS = [
  { id: 1, cat: "Materials", date: "Jun 02, 2026", title: "Reading a Board Grade: E-Flute vs B-Flute in Practice", author: "S. Okonkwo" },
  { id: 2, cat: "Sustainability", date: "May 21, 2026", title: "What FSC Chain-of-Custody Actually Guarantees You", author: "L. Marchetti" },
  { id: 3, cat: "Design", date: "May 09, 2026", title: "Designing a Die-Line That Survives Freight", author: "R. Chen" },
];

const FAQS = [
  { q: "What is the minimum order quantity?", a: "There is no enforced minimum. Prototype runs of a single unit use the same tooling and material specification as a production order of fifty thousand." },
  { q: "How long does a standard production run take?", a: "Nine to twelve business days from proof approval, including finishing. Rush production is available and quoted per job." },
  { q: "Can you match an existing Pantone or brand colour?", a: "Yes. Send a Pantone reference or a physical swatch and our press team will proof to a tight Delta-E tolerance before the full run." },
  { q: "Do you ship internationally?", a: "We freight to sixty-one countries. Palletised international shipments include duty handling for enterprise accounts." },
  { q: "What file formats do you accept for die-lines?", a: "Native Illustrator (.ai), press-ready PDF, or DXF. If you don't have a die-line yet, our structural team will draft one during consultation." },
];

const CLIENTS = ["NORTHBOUND", "AURIC", "ATELIER NOIR", "FIELDER GOODS", "VERDANT", "HALCYON", "CASCADE", "LUMEN"];

/* ---------------------------------------------------------------------- */
/* Small reusable UI                                                      */
/* ---------------------------------------------------------------------- */
const PrimaryButton = ({ children, className = "", ...rest }) => (
  <button
    className={`group relative inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm tracking-wide overflow-hidden transition-transform duration-300 active:scale-95 ${className}`}
    style={{ background: COLORS.ember, color: COLORS.paper }}
    {...rest}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    <span className="absolute inset-0 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" style={{ background: COLORS.emberDk }} />
  </button>
);

const GhostButton = ({ children, className = "", ...rest }) => (
  <button
    className={`inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm tracking-wide border transition-colors duration-300 hover:bg-black hover:text-white ${className}`}
    style={{ borderColor: COLORS.ink, color: COLORS.ink }}
    {...rest}
  >
    {children}
  </button>
);

const StatCounter = ({ target, suffix = "", label }) => {
  const ref = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const dur = 1400;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.floor(eased * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="reveal is-visible text-center md:text-left">
      <div className="font-display text-4xl md:text-5xl" style={{ color: COLORS.paper }}>
        {val.toLocaleString()}{suffix}
      </div>
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase mt-2 opacity-60" style={{ color: COLORS.paper }}>
        {label}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* Header                                                                  */
/* ---------------------------------------------------------------------- */
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="hidden md:block font-mono text-[11px] tracking-wide" style={{ background: COLORS.ink, color: COLORS.paper }}>
        <div className="max-w-[1400px] mx-auto px-6 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6 opacity-90">
            <span>FREE FREIGHT ON ORDERS OVER $500</span>
            <span className="opacity-40">/</span>
            <span>SUPPORT ONLINE 24/7</span>
            <span className="opacity-40">/</span>
            <span>9–12 DAY PRODUCTION</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+18005550142" className="flex items-center gap-1.5 hover:text-orange-400"><Phone size={12} /> +1 (800) 555-0142</a>
            <a href="mailto:hello@packcraft.co" className="flex items-center gap-1.5 hover:text-orange-400"><Mail size={12} /> hello@packcraft.co</a>
            <span className="flex items-center gap-3 pl-3 border-l border-white/20">
              <FaFacebookF size={13} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <FaInstagram size={13} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <FaLinkedinIn size={13} className="opacity-80 hover:opacity-100 cursor-pointer" />
              <FaXTwitter size={13} className="opacity-80 hover:opacity-100 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg backdrop-blur border-b" : "border-b border-transparent"}`}
        style={{ background: scrolled ? "rgba(251,250,246,0.92)" : COLORS.paper, borderColor: COLORS.stone2 }}
      >
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-20">
          <a href="#home" className="flex items-center gap-2.5">
            <BoxMark size={34} color={COLORS.ember} dashed={false} />
            <div className="leading-none">
              <div className="font-display text-2xl tracking-tight lowercase" style={{ color: COLORS.ink }}>packcraft<span style={{ color: COLORS.ember }}>.co</span></div>
              <div className="font-mono text-[9px] tracking-[0.3em] uppercase opacity-50">Custom Packaging</div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-9 font-medium text-[14px]" style={{ color: COLORS.ink }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="relative group py-2">
                {l.label}
                <span className="absolute left-0 -bottom-0.5 w-0 group-hover:w-full h-[1.5px] transition-all duration-300" style={{ background: COLORS.ember }} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen((s) => !s)} className="p-2.5 hover:bg-black/5 rounded-full transition-colors" aria-label="Search">
              <Search size={19} color={COLORS.ink} />
            </button>
            <a href="#quote" className="hidden md:block">
              <PrimaryButton className="!px-5 !py-2.5 text-[13px]">Get a Quote <ArrowUpRight size={15} /></PrimaryButton>
            </a>
            <button className="lg:hidden p-2.5" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={24} color={COLORS.ink} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t" style={{ borderColor: COLORS.stone2, background: COLORS.paper }}>
            <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center gap-3">
              <Search size={18} className="opacity-50" />
              <input
                autoFocus
                placeholder="Search rigid boxes, mailers, foil finishes…"
                className="flex-1 bg-transparent outline-none text-base font-display italic"
              />
              <button onClick={() => setSearchOpen(false)}><X size={18} /></button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
        <div className={`absolute right-0 top-0 h-full w-[82%] max-w-sm p-7 flex flex-col transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`} style={{ background: COLORS.paper }}>
          <div className="flex items-center justify-between mb-10">
            <BoxMark size={30} color={COLORS.ember} dashed={false} />
            <button onClick={() => setMobileOpen(false)}><X size={24} /></button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="font-display text-2xl py-3 border-b" style={{ borderColor: COLORS.stone2, color: COLORS.ink }}>
                {l.label}
              </a>
            ))}
          </nav>
          <a href="#quote" onClick={() => setMobileOpen(false)} className="mt-8">
            <PrimaryButton className="w-full justify-center">Get a Quote <ArrowUpRight size={16} /></PrimaryButton>
          </a>
          <div className="mt-auto pt-8 font-mono text-xs opacity-60 space-y-2">
            <div className="flex items-center gap-2"><Phone size={13} /> +1 (800) 555-0142</div>
            <div className="flex items-center gap-2"><Mail size={13} /> hello@packcraft.co</div>
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------------------------------------------------------------------- */
/* Hero image slideshow                                                   */
/* Fade + Ken Burns zoom · autoplay every 2s · pause on hover ·           */
/* arrows + dots · swipe on mobile · loops infinitely · no layout shift   */
/* ---------------------------------------------------------------------- */
const SLIDES = [
  { src: heroImg1, alt: "PackCraft.co custom crates — cream showcase" },
  { src: heroImg2, alt: "PackCraft.co custom crates — navy showcase" },
  { src: heroImg3, alt: "PackCraft.co custom crates — studio showcase" },
];

const AUTOPLAY_MS = 2000;

const HeroSlideshow = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const touchStartX = useRef(null);

  const goTo = useCallback((i) => {
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="PackCraft.co packaging showcase"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <motion.img
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            className="w-full h-full object-cover"
            initial={{ scale: 1 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: (AUTOPLAY_MS / 1000) + 0.9, ease: "linear" }}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* readability overlay so hero text stays legible over any slide */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(23,20,15,0.55) 0%, rgba(23,20,15,0.72) 55%, rgba(23,20,15,0.92) 100%)" }}
      />

      {/* nav arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/25 bg-black/25 backdrop-blur-sm hover:bg-black/45 transition-colors"
      >
        <ChevronLeft size={20} color={COLORS.paper} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/25 bg-black/25 backdrop-blur-sm hover:bg-black/45 transition-colors"
      >
        <ChevronRight size={20} color={COLORS.paper} />
      </button>

      {/* pagination dots */}
      <div className="absolute bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === index ? 26 : 8,
              background: i === index ? COLORS.ember : "rgba(251,250,246,0.45)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* Hero                                                                    */
/* ---------------------------------------------------------------------- */
const Hero = () => (
  <section id="home" className="relative overflow-hidden scroll-mt-24" style={{ background: COLORS.ink }}>
    <HeroSlideshow />
    <div className="grain" />
    {/* floating die-line marks */}
    <div className="absolute top-24 left-[6%] float-slow opacity-30 hidden md:block z-10" style={{ "--r": "-8deg" }}>
      <BoxMark size={70} color={COLORS.emberSoft} />
    </div>
    <div className="absolute bottom-28 left-[16%] float-med opacity-20 hidden lg:block z-10" style={{ "--r": "10deg" }}>
      <BoxMark size={44} color={COLORS.paper} />
    </div>
    <div className="absolute top-40 right-[10%] float-fast opacity-25 hidden md:block z-10" style={{ "--r": "6deg" }}>
      <BoxMark size={56} color={COLORS.kraft} />
    </div>
    <div className="absolute bottom-10 right-[20%] spin-slow opacity-10 hidden lg:block z-10">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <circle cx="60" cy="60" r="58" stroke={COLORS.paper} strokeWidth="0.5" strokeDasharray="3 5" />
      </svg>
    </div>

    <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36 relative z-10">
      <Reveal className="flex items-center gap-3 mb-8">
        <span className="pulse-ring inline-block w-2 h-2 rounded-full" style={{ background: COLORS.ember }} />
        <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: COLORS.emberSoft }}>
          Custom Packaging · Est. Since 2011
        </span>
      </Reveal>

      <Reveal delay={100} className="relative">
        {/* die-cut backdrop panel — an angled "unfolded flap" behind the headline so it
            stays legible over the slideshow instead of floating loose on busy photos */}
        <div
          aria-hidden="true"
          className="absolute -z-10 -left-6 -top-8 -bottom-8 right-[8%] md:right-[22%]"
          style={{
            background: "linear-gradient(115deg, rgba(23,20,15,0.92) 0%, rgba(23,20,15,0.78) 65%, rgba(23,20,15,0) 100%)",
            clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
          }}
        />
        <h1 className="relative font-display text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[6.2rem] max-w-5xl" style={{ color: COLORS.paper }}>
          Packaging built like it will{" "}
          <span className="relative inline-block whitespace-nowrap">
            {/* signature triangle mark, matching the die-line motif, seated behind the word */}
            <svg
              aria-hidden="true"
              className="absolute -z-10 pointer-events-none"
              style={{ left: "-6%", right: "-10%", top: "-18%", bottom: "-14%", width: "116%", height: "132%" }}
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <polygon points="0,100 100,0 200,100" fill={COLORS.ember} opacity="0.16" />
              <polygon points="0,100 100,0 200,100" fill="none" stroke={COLORS.ember} strokeWidth="1" opacity="0.5" />
            </svg>
            <span style={{ color: COLORS.ember }} className="italic">outlast</span>
          </span>{" "}
          the shelf.
        </h1>
      </Reveal>

      <Reveal delay={200} className="mt-8 max-w-xl">
        <p className="text-lg leading-relaxed" style={{ color: COLORS.stone2 }}>
          PackCraft.co designs, prints and finishes custom boxes for brands that treat the unboxing
          as seriously as the product inside. No minimums, no templates — every die-line is drawn for you.
        </p>
      </Reveal>

      <Reveal delay={300} className="mt-10 flex flex-col sm:flex-row gap-4">
        <a href="#quote"><PrimaryButton className="w-full sm:w-auto justify-center">Start Your Quote <ArrowUpRight size={16} /></PrimaryButton></a>
        <a href="#portfolio">
          <button className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-sm tracking-wide border transition-colors duration-300 w-full sm:w-auto justify-center hover:bg-white hover:text-black" style={{ borderColor: "rgba(251,250,246,0.35)", color: COLORS.paper }}>
            View Portfolio
          </button>
        </a>
      </Reveal>

      <Reveal delay={400} className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl">
        <StatCounter target={4200} suffix="+" label="Brands Served" />
        <StatCounter target={61} suffix="" label="Countries Shipped" />
        <StatCounter target={98} suffix="%" label="On-Time Rate" />
        <StatCounter target={12} suffix="d" label="Avg. Turnaround" />
      </Reveal>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* Trusted clients marquee                                                */
/* ---------------------------------------------------------------------- */
const ClientMarquee = () => (
  <div className="py-8 border-b overflow-hidden" style={{ borderColor: COLORS.stone2, background: COLORS.stone }}>
    <div className="flex w-max animate-marquee">
      {[...CLIENTS, ...CLIENTS].map((c, i) => (
        <span key={i} className="font-mono text-sm tracking-[0.2em] px-10 opacity-50 whitespace-nowrap" style={{ color: COLORS.ink }}>
          {c}
        </span>
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------------- */
/* Product categories                                                     */
/* ---------------------------------------------------------------------- */
const CategoryCard = ({ cat, i, onView }) => (
  <Reveal delay={(i % 4) * 80} className="crop group relative border flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl" style={{ borderColor: COLORS.stone2, background: COLORS.paper }}>
    <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.stone} 100%)` }}>
      <SmartBoxImage img={cat.img} hue={cat.hue} variant={cat.variant} alt={cat.name} artSize="w-24 sm:w-28 md:w-32" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(23,20,15,0) 55%, rgba(23,20,15,0.35) 100%)" }} />
      <span className="absolute top-3 left-3 font-mono text-[10px] tracking-widest px-2 py-1" style={{ background: COLORS.ink, color: COLORS.paper }}>
        {cat.spec}
      </span>
    </div>
    <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-2 flex-1">
      <h3 className="font-display text-lg sm:text-xl" style={{ color: COLORS.ink }}>{cat.name}</h3>
      <p className="text-sm opacity-65 leading-relaxed flex-1">{cat.blurb}</p>
      <button
        onClick={onView}
        className="inline-flex items-center gap-1.5 text-sm font-semibold mt-1 self-start"
        style={{ color: cat.hue }}
      >
        View Details <ChevronRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  </Reveal>
);

/* Popup that shows full spec details for a category without leaving the page. */
const CategoryModal = ({ cat, onClose }) => {
  useEffect(() => {
    if (!cat) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [cat, onClose]);

  if (!cat) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center p-4 sm:p-6 md:p-8" onClick={onClose}>
      <div
        className="crop relative w-full max-w-xl sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ background: COLORS.paper }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: COLORS.ink }}
        >
          <X size={18} color={COLORS.paper} />
        </button>

        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.stone} 100%)` }}>
          <SmartBoxImage img={cat.img} hue={cat.hue} variant={cat.variant} alt={cat.name} artSize="w-36 sm:w-44 md:w-48" />
          <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest px-2 py-1" style={{ background: COLORS.ink, color: COLORS.paper }}>
            {cat.spec}
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="font-display text-2xl sm:text-3xl mb-2" style={{ color: COLORS.ink }}>{cat.name}</h3>
          <p className="text-sm opacity-70 leading-relaxed mb-7">{cat.blurb}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-45">Material</span>
              <p className="text-sm opacity-80 mt-1 leading-relaxed">{cat.material}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-45">Standard Sizes</span>
              <p className="text-sm opacity-80 mt-1 leading-relaxed">{cat.sizes}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-45">Finishes</span>
              <p className="text-sm opacity-80 mt-1 leading-relaxed">{cat.finishes}</p>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-45">Ideal For</span>
              <p className="text-sm opacity-80 mt-1 leading-relaxed">{cat.idealFor}</p>
            </div>
          </div>

          <a href="#quote" onClick={onClose}>
            <PrimaryButton className="w-full sm:w-auto justify-center">Request a Quote <ArrowUpRight size={15} /></PrimaryButton>
          </a>
        </div>
      </div>
    </div>
  );
};

const ProductCategories = () => {
  const [active, setActive] = useState(null);
  return (
    <section id="products" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.paper }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionTag n="01" label="Product Range" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl max-w-xl" style={{ color: COLORS.ink }}>
              Thirteen categories, one <span className="italic" style={{ color: COLORS.ember }}>tooling standard.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-sm text-sm opacity-70">Every category below ships from the same climate-controlled facility, checked against the same structural tolerances.</p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard cat={cat} i={i} key={cat.id} onView={() => setActive(cat)} />
          ))}
        </div>
      </div>
      <CategoryModal cat={active} onClose={() => setActive(null)} />
    </section>
  );
};

/* ---------------------------------------------------------------------- */
/* Why choose us                                                          */
/* ---------------------------------------------------------------------- */
const WhyChooseUs = () => (
  <section id="industries" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.stone }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <SectionTag n="02" label="Why PackCraft" />
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl max-w-2xl mb-16" style={{ color: COLORS.ink }}>
          The parts of a packaging run most printers don't tell you about.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: COLORS.stone2 }}>
        {WHY_US.map((w, i) => (
          <Reveal delay={i * 60} key={w.title} className="p-9 flex flex-col gap-5" style={{ background: COLORS.paper }}>
            <w.icon size={26} style={{ color: COLORS.ember }} strokeWidth={1.6} />
            <h3 className="font-display text-xl" style={{ color: COLORS.ink }}>{w.title}</h3>
            <p className="text-sm leading-relaxed opacity-70">{w.copy}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* Services                                                                */
/* ---------------------------------------------------------------------- */
const Services = () => (
  <section className="py-24 md:py-32" style={{ background: COLORS.ink }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <SectionTag n="03" label="Capabilities" />
      <div className="flex flex-col lg:flex-row gap-14 lg:gap-24">
        <Reveal className="lg:w-1/3">
          <h2 className="font-display text-4xl md:text-5xl" style={{ color: COLORS.paper }}>
            Print &amp; finishing, <span className="italic" style={{ color: COLORS.ember }}>in-house.</span>
          </h2>
          <p className="mt-6 text-sm leading-relaxed opacity-60" style={{ color: COLORS.paper }}>
            Nothing is subcontracted. Every finish below runs on our own floor, under the same QA pass as the base print.
          </p>
        </Reveal>
        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-10">
          {SERVICES.map((s, i) => (
            <Reveal delay={i * 50} key={s} className="flex items-center justify-between py-5 border-b" style={{ borderColor: "rgba(251,250,246,0.15)" }}>
              <span className="font-display text-xl md:text-2xl" style={{ color: COLORS.paper }}>{s}</span>
              <span className="font-mono text-xs opacity-40" style={{ color: COLORS.paper }}>{String(i + 1).padStart(2, "0")}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* Process timeline                                                       */
/* ---------------------------------------------------------------------- */
const ProcessSection = () => (
  <section className="py-24 md:py-32" style={{ background: COLORS.paper }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <SectionTag n="04" label="Production Path" />
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl max-w-2xl mb-16" style={{ color: COLORS.ink }}>
          From consultation to your dock, in six checkpoints.
        </h2>
      </Reveal>
      <div className="relative">
        <div className="hidden lg:block absolute top-6 left-0 right-0 h-px" style={{ background: COLORS.stone2 }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-4">
          {PROCESS.map((p, i) => (
            <Reveal delay={i * 90} key={p.n} className="relative">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-mono text-xs mb-5 relative z-10" style={{ background: COLORS.ember, color: COLORS.paper }}>
                {p.n}
              </div>
              <h3 className="font-display text-lg mb-2" style={{ color: COLORS.ink }}>{p.t}</h3>
              <p className="text-sm opacity-65 leading-relaxed">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* Portfolio                                                              */
/* ---------------------------------------------------------------------- */
const PortfolioTile = ({ item, i, onOpen }) => {
  const meta = CATEGORIES.find((c) => c.id === item.cat) || {};
  return (
    <Reveal
      delay={(i % 4) * 70}
      onClick={onOpen}
      className="group relative h-72 overflow-hidden cursor-pointer crop"
      style={{ background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.stone} 100%)` }}
    >
      <SmartBoxImage img={item.img} hue={item.hue} variant={meta.variant || "plain"} alt={item.name} artSize="w-32" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(251,250,246,0) 40%, rgba(251,250,246,0.94) 100%)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <span className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: COLORS.ink, opacity: 0.55 }}>{item.cat}</span>
        <span className="font-display text-lg flex items-center gap-2" style={{ color: COLORS.ink }}>
          {item.name} <Search size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      </div>
    </Reveal>
  );
};

const Portfolio = () => {
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = PORTFOLIO_ITEMS.filter((p) => filter === "all" || p.cat === filter);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice(0, page * perPage);
  const lightboxItem = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => setLightboxIndex((idx) => (idx - 1 + filtered.length) % filtered.length), [filtered.length]);
  const showNext = useCallback(() => setLightboxIndex((idx) => (idx + 1) % filtered.length), [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  return (
    <section id="portfolio" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.stone }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center gap-2 text-xs font-mono opacity-50 mb-6">
          <a href="#home" className="hover:opacity-100">Home</a> <ChevronRight size={12} /> <span>Portfolio</span>
        </div>
        <SectionTag n="05" label="Selected Work" />
        <Reveal>
          <h2 className="font-display text-4xl md:text-5xl max-w-2xl mb-10" style={{ color: COLORS.ink }}>
            A gallery of what left the press floor.
          </h2>
        </Reveal>

        <div className="flex flex-wrap gap-2 mb-10">
          {PORTFOLIO_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border transition-colors"
              style={filter === f
                ? { background: COLORS.ink, color: COLORS.paper, borderColor: COLORS.ink }
                : { background: "transparent", color: COLORS.ink, borderColor: COLORS.stone2 }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {shown.map((item, i) => <PortfolioTile item={item} i={i} key={item.id} onOpen={() => setLightboxIndex(i)} />)}
        </div>

        {page < pageCount && (
          <div className="mt-12 flex justify-center">
            <GhostButton onClick={() => setPage((p) => p + 1)}>Load More Work</GhostButton>
          </div>
        )}
      </div>

      {lightboxItem && (
        <div className="fixed inset-0 z-[70] bg-black/85 flex items-center justify-center p-4 sm:p-6" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-white" onClick={closeLightbox} aria-label="Close"><X size={28} /></button>
          <div className="max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="h-72 sm:h-96 crop relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${COLORS.paper} 0%, ${COLORS.stone} 100%)` }}>
              <SmartBoxImage
                img={lightboxItem.img}
                hue={lightboxItem.hue}
                variant={(CATEGORIES.find((c) => c.id === lightboxItem.cat) || {}).variant || "plain"}
                alt={lightboxItem.name}
                artSize="w-48 sm:w-56"
              />
            </div>
            <div className="mt-5 flex items-center justify-between text-white">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60">{lightboxItem.cat}</div>
                <div className="font-display text-2xl">{lightboxItem.name}</div>
              </div>
              {filtered.length > 1 && (
                <div className="flex gap-3">
                  <button onClick={showPrev} aria-label="Previous item" className="p-2 border border-white/30 hover:bg-white/10 transition-colors"><ChevronLeft size={18} /></button>
                  <button onClick={showNext} aria-label="Next item" className="p-2 border border-white/30 hover:bg-white/10 transition-colors"><ChevronRight size={18} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* ---------------------------------------------------------------------- */
/* About                                                                   */
/* ---------------------------------------------------------------------- */
const About = () => (
  <section id="about" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.paper }}>
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <Reveal>
        <SectionTag n="06" label="About PackCraft" />
        <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ color: COLORS.ink }}>
          Started in a Karachi print shop. Still run by people who cut die-lines by hand.
        </h2>
        <p className="text-base leading-relaxed opacity-75 mb-6">
          PackCraft.co was founded in 2011 by a structural engineer and a print technician who
          believed most packaging suppliers optimised for their own press schedule, not the
          brand's shelf. We still hold to the same rule: no order runs until a physical
          prototype has been approved.
        </p>
        <p className="text-base leading-relaxed opacity-75 mb-10">
          Today the floor runs four offset presses, two digital lines and a finishing bay
          covering foil, embossing and spot UV — serving over four thousand brands across
          sixty-one countries.
        </p>
        <div className="grid grid-cols-3 gap-6 max-w-md">
          <div>
            <div className="font-display text-3xl" style={{ color: COLORS.ember }}>2011</div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mt-1">Founded</div>
          </div>
          <div>
            <div className="font-display text-3xl" style={{ color: COLORS.ember }}>140</div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mt-1">Employees</div>
          </div>
          <div>
            <div className="font-display text-3xl" style={{ color: COLORS.ember }}>6</div>
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mt-1">Certifications</div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={150} className="relative h-[420px] crop" style={{ background: COLORS.ink }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="float-slow"><BoxMark size={160} color={COLORS.emberSoft} /></div>
        </div>
        <div className="absolute bottom-6 left-6 right-6 flex justify-between font-mono text-[10px] uppercase tracking-widest" style={{ color: COLORS.paper, opacity: 0.5 }}>
          <span>FSC® · ISO 9001 · SOC 2</span>
          <span>EST. 2011</span>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* Testimonials                                                           */
/* ---------------------------------------------------------------------- */
const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);
  const cur = TESTIMONIALS[idx];

  return (
    <section className="py-24 md:py-32" style={{ background: COLORS.stone }}>
      <div className="max-w-[1400px] mx-auto px-6">
        <SectionTag n="07" label="Client Notes" />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal className="flex justify-center gap-1 mb-8">
            {Array.from({ length: cur.rating }).map((_, i) => <Star key={i} size={18} fill={COLORS.ember} color={COLORS.ember} />)}
          </Reveal>
          <p key={idx} className="reveal is-visible font-display text-2xl md:text-3xl leading-snug" style={{ color: COLORS.ink }}>
            "{cur.quote}"
          </p>
          <div className="mt-8 font-mono text-xs uppercase tracking-widest opacity-60">
            {cur.name} — {cur.role}
          </div>
          <div className="flex justify-center gap-3 mt-10">
            <button onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="p-2.5 border hover:bg-black hover:text-white transition-colors" style={{ borderColor: COLORS.ink }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)} className="p-2.5 border hover:bg-black hover:text-white transition-colors" style={{ borderColor: COLORS.ink }}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {TESTIMONIALS.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === idx ? COLORS.ember : COLORS.stone2, width: i === idx ? 20 : 8 }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------- */
/* Blog                                                                    */
/* ---------------------------------------------------------------------- */
const Blog = () => (
  <section id="blog" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.paper }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <SectionTag n="08" label="The Journal" />
          <Reveal><h2 className="font-display text-4xl md:text-5xl" style={{ color: COLORS.ink }}>Notes from the press floor.</h2></Reveal>
        </div>
        <Reveal delay={100}><GhostButton>All Articles <ArrowUpRight size={15} /></GhostButton></Reveal>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, i) => (
          <Reveal delay={i * 100} key={post.id} className="group cursor-pointer">
            <div className="h-56 crop relative overflow-hidden mb-5" style={{ background: i === 0 ? COLORS.ember : i === 1 ? COLORS.kraft : COLORS.ink }}>
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <BoxMark size={54} color="rgba(255,255,255,0.85)" />
              </div>
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3">
              <span>{post.cat}</span><span>·</span><span>{post.date}</span>
            </div>
            <h3 className="font-display text-xl leading-snug mb-3 group-hover:underline decoration-1 underline-offset-4" style={{ color: COLORS.ink }}>
              {post.title}
            </h3>
            <div className="flex items-center justify-between text-sm opacity-60">
              <span>By {post.author}</span>
              <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* FAQ                                                                     */
/* ---------------------------------------------------------------------- */
const FAQItem = ({ item, open, onClick }) => (
  <div className="border-b" style={{ borderColor: COLORS.stone2 }}>
    <button onClick={onClick} className="w-full py-6 flex items-center justify-between text-left gap-6">
      <span className="font-display text-lg md:text-xl" style={{ color: COLORS.ink }}>{item.q}</span>
      <span className="shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-transform duration-300" style={{ borderColor: COLORS.ink, transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
        <Plus size={15} />
      </span>
    </button>
    <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
      <div className="overflow-hidden">
        <p className="pb-6 pr-14 text-sm leading-relaxed opacity-70">{item.a}</p>
      </div>
    </div>
  </div>
);

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-24 md:py-32" style={{ background: COLORS.stone }}>
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-14">
        <div>
          <SectionTag n="09" label="FAQ" />
          <Reveal><h2 className="font-display text-4xl md:text-5xl" style={{ color: COLORS.ink }}>Questions we get before a first order.</h2></Reveal>
        </div>
        <div className="lg:col-span-2">
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} item={item} open={open === i} onClick={() => setOpen(open === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------- */
/* Multi-step quote form                                                  */
/* ---------------------------------------------------------------------- */
const QuoteForm = () => {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    product: "Mailer Boxes", quantity: "", length: "", width: "", height: "",
    name: "", company: "", phone: "", email: "", message: "", file: null,
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.quantity || Number(form.quantity) <= 0) e.quantity = "Enter a quantity greater than 0.";
    }
    if (s === 2) {
      if (!form.length) e.length = "Required";
      if (!form.width) e.width = "Required";
      if (!form.height) e.height = "Required";
    }
    if (s === 3) {
      if (!form.name.trim()) e.name = "Required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
      if (!form.phone.trim()) e.phone = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const back = () => setStep((s) => Math.max(1, s - 1));
  const submit = (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setDone(true);
  };

  const inputCls = "w-full px-4 py-3 bg-transparent border text-sm outline-none transition-colors";

  return (
    <section id="quote" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.ink }}>
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-14">
        <div className="lg:col-span-2">
          <SectionTag n="10" label="Request a Quote" />
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ color: COLORS.paper }}>
              Tell us the box. We'll tell you the price.
            </h2>
            <p className="text-sm leading-relaxed opacity-60" style={{ color: COLORS.paper }}>
              Three short steps — product, dimensions, contact details. A packaging
              engineer replies with pricing and a lead time within one business day.
            </p>
          </Reveal>

          {!done && (
            <div className="mt-12 flex gap-3">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(251,250,246,0.15)" }}>
                    <div className="h-full transition-all duration-500" style={{ width: s <= step ? "100%" : "0%", background: COLORS.ember }} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest mt-2 opacity-60" style={{ color: COLORS.paper }}>
                    Step {s} · {s === 1 ? "Product" : s === 2 ? "Dimensions" : "Contact"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 p-8 md:p-10 crop" style={{ background: COLORS.paper }}>
          {done ? (
            <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center">
              <CheckCircle2 size={54} style={{ color: COLORS.ember }} className="mb-5" />
              <h3 className="font-display text-3xl mb-3" style={{ color: COLORS.ink }}>Request received.</h3>
              <p className="text-sm opacity-65 max-w-sm mb-8">
                A packaging engineer will email your quote within one business day. Reference
                number <span className="font-mono">PC-{Math.floor(10000 + Math.random() * 89999)}</span>.
              </p>
              <GhostButton onClick={() => { setDone(false); setStep(1); }}>Submit Another Request</GhostButton>
            </div>
          ) : (
            <form onSubmit={submit}>
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">Product</label>
                    <select className={inputCls} style={{ borderColor: COLORS.stone2, color: COLORS.ink }} value={form.product} onChange={(e) => update("product", e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">Quantity</label>
                    <input type="number" min="1" placeholder="e.g. 2500" className={inputCls} style={{ borderColor: errors.quantity ? COLORS.ember : COLORS.stone2, color: COLORS.ink }} value={form.quantity} onChange={(e) => update("quantity", e.target.value)} />
                    {errors.quantity && <p className="text-xs mt-1.5" style={{ color: COLORS.ember }}>{errors.quantity}</p>}
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">Reference File (optional)</label>
                    <label className="flex items-center gap-3 px-4 py-3 border border-dashed cursor-pointer text-sm opacity-70" style={{ borderColor: COLORS.stone2 }}>
                      <Upload size={16} /> {form.file ? form.file : "Upload artwork or die-line"}
                      <input type="file" className="hidden" onChange={(e) => update("file", e.target.files?.[0]?.name || null)} />
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <label className="font-mono text-xs uppercase tracking-widest opacity-60 block -mb-2">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["length", "width", "height"].map((k) => (
                      <div key={k}>
                        <input placeholder={k[0].toUpperCase() + k.slice(1)} type="number" className={inputCls} style={{ borderColor: errors[k] ? COLORS.ember : COLORS.stone2, color: COLORS.ink }} value={form[k]} onChange={(e) => update(k, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest opacity-60 block mb-2">Notes / Special Finishing</label>
                    <textarea rows={4} placeholder="Foil stamping, spot UV, magnetic close…" className={inputCls} style={{ borderColor: COLORS.stone2, color: COLORS.ink }} value={form.message} onChange={(e) => update("message", e.target.value)} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <input placeholder="Full Name" className={inputCls} style={{ borderColor: errors.name ? COLORS.ember : COLORS.stone2, color: COLORS.ink }} value={form.name} onChange={(e) => update("name", e.target.value)} />
                      {errors.name && <p className="text-xs mt-1.5" style={{ color: COLORS.ember }}>{errors.name}</p>}
                    </div>
                    <div>
                      <input placeholder="Company" className={inputCls} style={{ borderColor: COLORS.stone2, color: COLORS.ink }} value={form.company} onChange={(e) => update("company", e.target.value)} />
                    </div>
                    <div>
                      <input placeholder="Phone" className={inputCls} style={{ borderColor: errors.phone ? COLORS.ember : COLORS.stone2, color: COLORS.ink }} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                      {errors.phone && <p className="text-xs mt-1.5" style={{ color: COLORS.ember }}>{errors.phone}</p>}
                    </div>
                    <div>
                      <input placeholder="Email" className={inputCls} style={{ borderColor: errors.email ? COLORS.ember : COLORS.stone2, color: COLORS.ink }} value={form.email} onChange={(e) => update("email", e.target.value)} />
                      {errors.email && <p className="text-xs mt-1.5" style={{ color: COLORS.ember }}>{errors.email}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-10">
                {step > 1 ? (
                  <button type="button" onClick={back} className="font-mono text-xs uppercase tracking-widest opacity-60 flex items-center gap-1.5">
                    <ChevronLeft size={14} /> Back
                  </button>
                ) : <span />}
                {step < 3 ? (
                  <PrimaryButton type="button" onClick={next}>Continue <ChevronRight size={15} /></PrimaryButton>
                ) : (
                  <PrimaryButton type="submit">Submit Request <ArrowUpRight size={15} /></PrimaryButton>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------- */
/* Contact                                                                 */
/* ---------------------------------------------------------------------- */
const Contact = () => (
  <section id="contact" className="scroll-mt-24 py-24 md:py-32" style={{ background: COLORS.paper }}>
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14">
      <Reveal>
        <SectionTag n="11" label="Visit / Contact" />
        <h2 className="font-display text-4xl md:text-5xl mb-8" style={{ color: COLORS.ink }}>Come see the press floor.</h2>
        <div className="space-y-6 mb-10">
          <div className="flex gap-4"><MapPin size={20} style={{ color: COLORS.ember }} className="shrink-0 mt-0.5" /><span className="text-sm opacity-80">Plot 14, Industrial Estate, Karachi 74900, Pakistan</span></div>
          <div className="flex gap-4"><Phone size={20} style={{ color: COLORS.ember }} className="shrink-0 mt-0.5" /><span className="text-sm opacity-80">+1 (800) 555-0142</span></div>
          <div className="flex gap-4"><Mail size={20} style={{ color: COLORS.ember }} className="shrink-0 mt-0.5" /><span className="text-sm opacity-80">hello@packcraft.co</span></div>
          <div className="flex gap-4"><Clock size={20} style={{ color: COLORS.ember }} className="shrink-0 mt-0.5" /><span className="text-sm opacity-80">Mon–Sat, 9:00 – 19:00 (PKT)</span></div>
        </div>
        <div className="h-64 crop relative overflow-hidden" style={{ background: COLORS.stone }}>
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(${COLORS.stone2} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.stone2} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={34} style={{ color: COLORS.ember }} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={120} className="p-8 md:p-10 border" style={{ borderColor: COLORS.stone2 }}>
        <h3 className="font-display text-2xl mb-6" style={{ color: COLORS.ink }}>Send a message</h3>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Name" className="w-full px-4 py-3 bg-transparent border text-sm outline-none" style={{ borderColor: COLORS.stone2 }} />
          <input placeholder="Email" className="w-full px-4 py-3 bg-transparent border text-sm outline-none" style={{ borderColor: COLORS.stone2 }} />
          <textarea rows={5} placeholder="How can we help?" className="w-full px-4 py-3 bg-transparent border text-sm outline-none" style={{ borderColor: COLORS.stone2 }} />
          <PrimaryButton className="w-full justify-center" type="submit">Send Message <ArrowUpRight size={15} /></PrimaryButton>
        </form>
      </Reveal>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/* Footer                                                                  */
/* ---------------------------------------------------------------------- */
const Footer = () => (
  <footer className="pt-20 pb-8" style={{ background: COLORS.ink }}>
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-14 border-b" style={{ borderColor: "rgba(251,250,246,0.12)" }}>
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <BoxMark size={30} color={COLORS.ember} dashed={false} />
            <span className="font-display text-2xl lowercase" style={{ color: COLORS.paper }}>packcraft<span style={{ color: COLORS.ember }}>.co</span></span>
          </div>
          <p className="text-sm opacity-55 max-w-xs leading-relaxed mb-6" style={{ color: COLORS.paper }}>
            Custom packaging designed, printed and finished under one roof. No minimums, no templates.
          </p>
          <div className="flex gap-3">
            {[FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter].map((Icon, i) => (
              <span key={i} className="w-9 h-9 rounded-full border flex items-center justify-center cursor-pointer hover:bg-white/10" style={{ borderColor: "rgba(251,250,246,0.2)" }}>
                <Icon size={15} color={COLORS.paper} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-5" style={{ color: COLORS.paper }}>Products</h4>
          <ul className="space-y-3 text-sm" style={{ color: COLORS.paper }}>
            {CATEGORIES.slice(0, 5).map((c) => <li key={c.id} className="opacity-65 hover:opacity-100 cursor-pointer">{c.name}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-5" style={{ color: COLORS.paper }}>Company</h4>
          <ul className="space-y-3 text-sm" style={{ color: COLORS.paper }}>
            {["About", "Portfolio", "Journal", "Careers", "Contact"].map((l) => <li key={l} className="opacity-65 hover:opacity-100 cursor-pointer">{l}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs uppercase tracking-widest opacity-50 mb-5" style={{ color: COLORS.paper }}>Newsletter</h4>
          <p className="text-sm opacity-55 mb-4" style={{ color: COLORS.paper }}>Material notes, once a month.</p>
          <div className="flex border-b" style={{ borderColor: "rgba(251,250,246,0.3)" }}>
            <input placeholder="Email address" className="flex-1 bg-transparent py-2 text-sm outline-none" style={{ color: COLORS.paper }} />
            <button><ArrowUpRight size={18} color={COLORS.ember} /></button>
          </div>
        </div>
      </div>
      <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] opacity-45" style={{ color: COLORS.paper }}>
        <span>© 2026 PackCraft.co. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="hover:opacity-100 cursor-pointer">Privacy Policy</span>
          <span className="hover:opacity-100 cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ---------------------------------------------------------------------- */
/* Scroll progress + back to top                                          */
/* ---------------------------------------------------------------------- */
const ScrollUtils = () => {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(pct || 0);
      setShowTop(h.scrollTop > 800);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 h-[3px] z-[100]" style={{ width: `${progress}%`, background: COLORS.ember, transition: "width .1s linear" }} />
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-7 right-7 z-[90] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        style={{ background: COLORS.ink, color: COLORS.paper }}
        aria-label="Back to top"
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
};

/* ---------------------------------------------------------------------- */
/* Page loader                                                            */
/* ---------------------------------------------------------------------- */
const PageLoader = () => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 850);
    const t2 = setTimeout(() => setVisible(false), 1150);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (!visible) return null;
  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
      style={{ background: COLORS.ink }}
    >
      <div className="relative mb-5">
        <BoxMark size={56} color={COLORS.ember} dashed={false} />
        <span className="absolute inset-0 rounded-full pulse-ring" />
      </div>
      <div className="font-display text-xl lowercase tracking-tight" style={{ color: COLORS.paper }}>
        packcraft<span style={{ color: COLORS.ember }}>.co</span>
      </div>
      <div className="mt-5 w-32 h-[2px] overflow-hidden rounded-full" style={{ background: "rgba(251,250,246,0.15)" }}>
        <div className="h-full w-full origin-left" style={{ background: COLORS.ember, animation: "loaderBar 0.9s ease-in-out forwards" }} />
      </div>
      <style>{`@keyframes loaderBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
};

/* ---------------------------------------------------------------------- */
/* App                                                                      */
/* ---------------------------------------------------------------------- */
export default function App() {
  return (
    <div style={{ background: COLORS.paper }}>
      <GlobalStyle />
      <PageLoader />
      <ScrollUtils />
      <Header />
      <Hero />
      <ClientMarquee />
      <ProductCategories />
      <WhyChooseUs />
      <Services />
      <ProcessSection />
      <Portfolio />
      <About />
      <Testimonials />
      <Blog />
      <FAQ />
      <QuoteForm />
      <Contact />
      <Footer />
    </div>
  );
}