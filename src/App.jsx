/* App.jsx – versie met Haagse winkelwagen & adres-checkout (11-11-2025) */
import React, { useMemo, useState, useRef } from "react";

/* ================== Helpers ================== */
function formatPrice(n) {
  return n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
}

// Subtiele haptic & beep feedback (mobiel + desktop)
function haptic(ms = 30) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(ms);
  }
}
function beep(duration = 120, frequency = 880, volume = 0.12) {
  if (typeof window === "undefined") return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, duration);
}

/* ================== Config ================== */
const HERO_BG = "/img/ado-sfeer.jpg";

// Betalen (zonder KvK)
const PAYMENT_MODE = "whatsapp"; // "whatsapp" | "paypalme" | "tikkie-api"
const WHATSAPP_NUMBER = "31624729671"; // <-- jouw nummer zonder +
const PAYPAL_ME_HANDLE = "JouwPayPalMeNaam";

// Socials
const INSTAGRAM_HANDLE = "070_stickershop";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const TIKTOK_HANDLE = "070_stickershop";
const TIKTOK_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;

// Filters
const CATEGORIES = [
  { id: "all", label: "Alles" },
  { id: "normaal", label: "Normaal" },
  { id: "xxl", label: "XXL A6" },
  { id: "a4", label: "A4" },
];

/* ---- KORTINGSCODES ----
   MATCHDAY10: alleen vandaag, 10% op A4, XXL en Accessoires (tape) */
const COUPONS = {
  MATCHDAY10: {
    type: "percent",
    value: 10,
    description: "10% korting op A4, XXL en Tape (alleen vandaag)",
    groups: ["a4", "xxl", "accessoires"],
    onlyToday: true,
  },
};

/* Kleine helpers voor ‘vandaag’ en eligibility */
function localISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isMatchdayToday() {
  // “Alleen vandaag” badge
  return true;
}
function isEligibleForMatchday(product) {
  return ["a4", "xxl", "accessoires"].includes(product.group);
}

/* ------------------------------ DATA ------------------------------ */
const PRODUCTS = [
  /* ---------------- Normaal ---------------- */
  {
    id: "normal-den-haag-territory",
    title: "Den Haag Territory",
    img: "/img/den-haag-territory.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Populair",
    group: "normaal",
  },
  {
    id: "normal-generaties-heen",
    title: "Door De Generaties Heen",
    img: "/img/door-de-generaties.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Populair",
    group: "normaal",
  },
  {
    id: "normal-mijn-club",
    title: "Mijn Club FC Den Haag",
    img: "/img/mijn-club-fc-den-haag.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },
  {
    id: "normal-fuck-den-bosch",
    title: "Fuck Den Bosch",
    img: "/img/fuck-den-bosch.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },
  {
    id: "normal-den-haag-till",
    title: "Den Haag Till",
    img: "/img/den-haag-till.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },
  {
    id: "normal-green-yellow-army",
    title: "Green Yellow Army",
    img: "/img/green-yellow-army.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },
  {
    id: "normal-betreden-op-eigen-risico",
    title: "Betreden op eigen risico",
    img: "/img/betreden-op-eigen-risico.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },
  {
    id: "normal-coming-for-you",
    title: "Coming for you",
    img: "/img/coming-for-you.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },
  {
    id: "normal-fuck-espn",
    title: "F*ck ESPN",
    img: "/img/fuck-espn.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 3.5 },
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },

  /* Mix (vanaf 50) – zelfde pricing als 50+ normaal */
  {
    id: "normal-mix",
    title: "Normale stickers – Mix (vanaf 50)",
    img: "/img/mix.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "50", label: "50 stuks", price: 6.5 },
      { id: "100", label: "100 stuks", price: 11.0 },
      { id: "150", label: "150 stuks", price: 16.5 },
      { id: "200", label: "200 stuks", price: 22.0 },
    ],
    extra: "Mix van designs · 85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
  },

  /* ---------------- XXL (A6) ---------------- */
  {
    id: "xxl-zone",
    title: "XXL stickers A6 – Den Haag zone",
    img: "/img/den-haag-zone-a6.jpg",
    tags: ["A6", "xxl", "zone"],
    variants: [
      { id: "10", label: "10 stuks", price: 3.0 },
      { id: "25", label: "25 stuks", price: 7.5 },
      { id: "50", label: "50 stuks", price: 12.0 },
      { id: "75", label: "75 stuks", price: 16.5 },
      { id: "100", label: "100 stuks", price: 22.0 },
    ],
    extra: "A6 (105×148 mm) · Vinyl · UV- & waterbestendig",
    group: "xxl",
  },
  {
    id: "xxl-fcdh-legia",
    title: "XXL stickers A6 – FC Den Haag / Legia",
    img: "/img/fc-den-haag-legia-a6.jpg",
    tags: ["A6", "xxl", "denhaag", "legia"],
    variants: [
      { id: "10", label: "10 stuks", price: 3.0 },
      { id: "25", label: "25 stuks", price: 7.5 },
      { id: "50", label: "50 stuks", price: 12.0 },
      { id: "75", label: "75 stuks", price: 16.5 },
      { id: "100", label: "100 stuks", price: 22.0 },
    ],
    extra: "A6 (105×148 mm) · Vinyl · UV- & waterbestendig",
    group: "xxl",
  },

  /* ---------------- A4 ---------------- */
  {
    id: "a4-stickers",
    title: "A4 stickers – losse vellen",
    img: "/img/a4.jpg",
    tags: ["A4", "staffelkorting", "xxxl"],
    variants: [
      { id: "1", label: "1 vel", qty: 1 },
      { id: "2", label: "2 vellen", qty: 2 },
      { id: "3", label: "3 vellen", qty: 3 },
      { id: "4", label: "4 vellen", qty: 4 },
      { id: "5", label: "5 vellen", qty: 5 },
      { id: "10", label: "10 vellen", qty: 10 },
    ],
    variantPricing(qty) {
      const each = qty >= 5 ? 2.0 : 2.5;
      return qty * each;
    },
    extra: "A4 (210×297 mm) · Vinyl · UV- & waterbestendig",
    group: "a4",
  },

  /* ---------------- Accessoires (aparte sectie) ---------------- */
  {
    id: "tape-rol-groeten",
    title: "Tape rol Groeten Uit Den Haag",
    img: "/img/tape-rol-groeten.jpg",
    tags: ["tape", "accessoires", "50m", "awaydays"],
    variants: [
      { id: "1", label: "1 rol", price: 9.99 },
      { id: "2", label: "2 rollen", price: 19.99 },
      { id: "3", label: "3 rollen", price: 22.0 },
      { id: "5", label: "5 rollen", price: 30.0 },
    ],
    extra: "Ideaal om mee te nemen naar awaydays · 50 meter lang.",
    group: "accessoires",
  },
  {
    id: "tape-rol-on-tour",
    title: "Tape rol Den Haag On Tour",
    img: "/img/tape-rol-tour.jpg",
    tags: ["tape", "accessoires", "50m", "awaydays"],
    variants: [
      { id: "1", label: "1 rol", price: 9.99 },
      { id: "2", label: "2 rollen", price: 19.99 },
      { id: "3", label: "3 rollen", price: 22.0 },
      { id: "5", label: "5 rollen", price: 30.0 },
    ],
    extra: "Ideaal om mee te nemen naar awaydays · 50 meter lang.",
    group: "accessoires",
  },

  /* ---------------- Vlag ---------------- */
  {
    id: "fuck-dordrecht",
    title: "Fuck D*rdrecht Vlag",
    img: "/img/fuck-dordrecht.jpg",
    tags: ["vlag", "accessoires"],
    variants: [{ id: "1", label: "1 vlag", price: 15.0 }],
    extra: "100x50cm, hoogwaardige kwaliteit · Ideaal voor awaydays.",
    group: "accessoires",
  },
];

/* ================== App ================== */
export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [selected, setSelected] = useState(() => {
    const o = {};
    for (const p of PRODUCTS) o[p.id] = p.variants[0]?.id;
    return o;
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, type, value, groups, onlyToday, description, appliedOn }

  // Toast state
  const [toast, setToast] = useState({ open: false, title: "", img: "", variant: "" });
  const toastTimerRef = useRef(null);
  function showAddedToast({ title, img, variant }) {
    setToast({ open: true, title, img, variant });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 2200);
    haptic(25);
    beep(110, 920, 0.13);
  }

  // Checkout modals
  const [confirmOpen, setConfirmOpen] = useState(false); // stap 1 (bestaand)
  const [addressOpen, setAddressOpen] = useState(false); // stap 2 (nieuw)
  const [customer, setCustomer] = useState({ name: "", street: "", postalCity: "" });

  const [successMsg, setSuccessMsg] = useState("");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const visibleItems = useMemo(() => {
    return items.filter((p) => {
      if (category === "all") return true;
      if (category === "a4") return p.id === "a4-stickers";
      if (category === "xxl") return p.id.startsWith("xxl-");
      return p.id.startsWith("normal-") || p.group === "accessoires";
    });
  }, [items, category]);

  function resolveVariantPrice(product, variantId) {
    const v =
      product.variants.find((x) => x.id === variantId) || product.variants[0];
    if (product.id === "a4-stickers") {
      const qty = v.qty ?? (parseInt(v.id, 10) || 1);
      const price = product.variantPricing(qty);
      return { price, label: v.label };
    }
    return { price: v.price, label: v.label };
  }

  function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    const variantId = selected[productId] ?? product.variants[0].id;
    const { price, label } = resolveVariantPrice(product, variantId);

    setCart((prev) => {
      const idx = prev.findIndex(
        (x) => x.productId === productId && x.variantId === variantId
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [
        ...prev,
        {
          productId,
          title: product.title,
          variantId,
          variantLabel: label,
          price,
          img: product.img,
          qty: 1,
        },
      ];
    });

    showAddedToast({ title: product.title, img: product.img, variant: label });
  }

  function changeVariant(productId, variantId) {
    setSelected((s) => ({ ...s, [productId]: variantId }));
  }

  function removeFromCart(productId, variantId) {
    setCart((prev) =>
      prev.filter((x) => !(x.productId === productId && x.variantId === variantId))
    );
  }

  // ---- Coupon helpers ----
  function handleApplyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      alert("Voer een kortingscode in.");
      return;
    }
    const c = COUPONS[code];
    if (!c) {
      alert("Ongeldige kortingscode.");
      return;
    }
    setAppliedCoupon({ code, appliedOn: localISODate(), ...c });
    haptic(20);
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponInput("");
    haptic(15);
  }

  function computeDiscount(subtotal, cart) {
    if (!appliedCoupon) return 0;

    // Alleen vandaag geldig?
    if (appliedCoupon.onlyToday) {
      if (appliedCoupon.appliedOn !== localISODate()) {
        return 0;
      }
    }

    // Subtotaal van items die in de juiste groepen vallen
    let eligibleSubtotal = 0;
    if (appliedCoupon.groups?.length) {
      eligibleSubtotal = cart.reduce((sum, item) => {
        const product = PRODUCTS.find((p) => p.id === item.productId);
        if (product && appliedCoupon.groups.includes(product.group)) {
          return sum + item.price * item.qty;
        }
        return sum;
      }, 0);
    } else {
      eligibleSubtotal = subtotal;
    }

    let d = 0;
    if (appliedCoupon.type === "percent") {
      d = eligibleSubtotal * (appliedCoupon.value / 100);
    } else if (appliedCoupon.type === "fixed") {
      d = appliedCoupon.value;
    }
    return Math.min(d, subtotal);
  }

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);

  function computeShipping() {
    if (cart.length === 0) return 0;
    // Alleen 1 product in winkelwagen EN exact 25 stuks normaal
    if (
      cart.length === 1 &&
      cart[0].productId.startsWith("normal-") &&
      cart[0].variantId === "25" &&
      cart[0].qty === 1
    ) {
      return 3.0;
    }
    // Alles daarboven -> €4,50
    return 4.5;
  }

  const shipping = computeShipping();
  const discount = computeDiscount(subtotal, cart);
  const total = Math.max(0, subtotal - discount) + shipping;

  function buildOrderText() {
    const lines = cart.map(
      (i) =>
        `• ${i.title} – ${i.variantLabel} × ${i.qty} = ${formatPrice(
          i.price * i.qty
        )}`
    );

    const parts = [
      "Bestelling 070_stickershop",
      ...lines,
      `Subtotaal: ${formatPrice(subtotal)}`,
    ];

    if (discount > 0 && appliedCoupon?.code) {
      parts.push(`Korting (${appliedCoupon.code}): -${formatPrice(discount)}`);
    }

    parts.push(
      `Verzendkosten: ${formatPrice(shipping)}`,
      `Totaal: ${formatPrice(total)}`
    );

    // Adresblok (nieuw)
    parts.push(
      "",
      "Gegevens:",
      `Naam: ${customer.name || "-"}`,
      `Adres: ${customer.street || "-"}`,
      `Postcode + plaats: ${customer.postalCity || "-"}`
    );

    parts.push(
      "",
      "Graag bevestigen – ik stuur direct een betaalverzoek terug. Bedankt! 👊",
      "Bestelling geplaatst via 070StickerShop.nl 💚💛"
    );

    return parts.join("\n");
  }

  function handleCheckout() {
    if (cart.length === 0) {
      alert("Je winkelwagen is leeg.");
      return;
    }
    setConfirmOpen(true);
    haptic(20);
    beep(90, 700, 0.12);
  }

  // In stap 2 (adresmodal) wordt pas écht doorgestuurd
  function proceedCheckout() {
    const tekst = buildOrderText();

    if (PAYMENT_MODE === "whatsapp") {
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        tekst
      )}`;
      window.location.href = url;
      return;
    }
    if (PAYMENT_MODE === "paypalme") {
      const bedrag = (Math.round(total * 100) / 100).toFixed(2);
      const url = `https://www.paypal.me/${PAYPAL_ME_HANDLE}/${bedrag}`;
      window.open(url, "_blank");
      alert(
        "Noteer in PayPal bij de betaling: order via 070_stickershop. Dankjewel!"
      );
      return;
    }
  }

  // Quick apply knop in banner
  function applyMatchdayFromBanner() {
    setCouponInput("MATCHDAY10");
    const c = COUPONS.MATCHDAY10;
    if (c) setAppliedCoupon({ code: "MATCHDAY10", appliedOn: localISODate(), ...c });
    haptic(18);
  }

  return (
    <div className="min-h-screen text-neutral-900 bg-gradient-to-br from-[#0b6e4f] via-[#f2c200]/30 to-[#f2c200]/60">
      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur supports-backdrop-blur:bg-white/70 bg-white/60 border-b border-black/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/img/070-logo.jpeg"
              alt="070 Logo"
              className="h-10 w-auto object-contain drop-shadow"
            />
            <span className="font-extrabold tracking-tight text-xl">
              070_stickershop
            </span>
          </div>

          <nav className="ml-auto hidden md:flex items-center gap-6 text-sm">
            <a href="#collectie" className="hover:underline">Collectie</a>
            <a href="#info" className="hover:underline">Verzending</a>
            <a href="#contact" className="hover:underline">Contact</a>

            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm hover:shadow transition bg-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" strokeWidth="1.5"
                   className="h-4 w-4">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="0.5"></circle>
              </svg>
              Instagram
            </a>

            {/* TikTok */}
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm hover:shadow transition bg-white/90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                   className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M34.8 14.6c-3.2-1.7-5.4-4.5-6.2-8.2h-6.1v24.8c-.1 2.4-2.1 4.3-4.5 4.3-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c.6 0 1.1.1 1.6.3V20c-7.1-1.1-13.6 4.5-13.6 11.7 0 6.4 5.2 11.6 11.6 11.6 6.3 0 11.5-5.1 11.6-11.4V19.3c2.3 1.9 5.2 3.1 8.4 3.1v-7.8c-.9 0-1.8-.1-2.7-.4z"/>
              </svg>
              TikTok
            </a>
          </nav>
        </div>

        {/* MATCHDAY banner */}
        <div className="bg-black text-white">
          <div className="mx-auto max-w-6xl px-4 py-2 text-sm flex items-center gap-3">
            <span className="font-semibold">Alleen vandaag:</span>
            <span>MATCHDAY10 — 10% korting op A4, XXL en Tape</span>
            {!appliedCoupon ? (
              <button
                onClick={applyMatchdayFromBanner}
                className="ml-auto rounded-full bg-white text-black px-3 py-1 text-xs font-semibold hover:bg-white/90"
              >
                Code toepassen
              </button>
            ) : (
              <span className="ml-auto text-green-400 font-semibold">Code toegepast</span>
            )}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative isolate h-[420px] md:h-[650px] lg:h-[750px]">
        <img src={HERO_BG} alt="Ado sfeer" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/0" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 h-full flex items-center">
          <div className="grid md:grid-cols-2 gap-10 items-center w-full">
            <div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight text-white drop-shadow">
                #1 Stickershop in Den Haag sinds 2023
              </h1>
              <p className="mt-4 text-white/90 max-w-prose">
                Welkom bij 070_stickershop – hoogwaardige vinyl stickers in
                groen-geel. Water- & UV-bestendig.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#collectie" className="rounded-2xl bg-[#f2c200] px-5 py-2.5 font-semibold shadow hover:shadow-md transition">Shop nu</a>
                <a href="#info" className="rounded-2xl bg-white/90 px-5 py-2.5 font-semibold shadow hover:shadow-md transition">Verzending & betalen</a>
              </div>
            </div>

            {/* Rond logo */}
            <div className="hidden md:flex items-center justify-center">
              <div className="rounded-full p-2 bg-white/5 ring-1 ring-white/15 backdrop-blur-sm shadow-2xl">
                <img
                  src="/img/070-logo.jpeg"
                  alt="070_stickershop logo"
                  className="w-56 h-56 rounded-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collectie */}
      <section id="collectie" className="bg-white/80 border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">Collectie</h2>
            <div className="md:ml-auto w-full md:w-80">
              <label className="relative block">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b6e4f]"
                  placeholder="Zoeken op naam of tag…"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">⌘K</span>
              </label>
            </div>
          </div>

          {/* Categorie chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full border text-sm transition shadow-sm ${
                  category === c.id ? "bg-[#0b6e4f] text-white border-[#0b6e4f]" : "bg-white hover:bg-white/80"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((p) => {
              const variantId = selected[p.id] ?? p.variants[0]?.id;
              const { price, label } = resolveVariantPrice(p, variantId);
              const showMatchday = isMatchdayToday() && isEligibleForMatchday(p);
              return (
                <article key={p.id} className="group rounded-3xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-black/5 overflow-hidden">
                  {/* Afbeelding */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    {/* Linker badge */}
                    {p.badge && (
                      <span className="absolute left-3 top-3 z-10 rounded-xl bg-[#0b6e4f] px-2.5 py-1 text-xs font-bold text-white shadow">
                        {p.badge}
                      </span>
                    )}
                    {/* Rechter badge: MATCHDAY10 */}
                    {showMatchday && (
                      <span
                        className="absolute right-3 top-3 z-10 rounded-xl bg-green-500 px-2.5 py-1 text-xs font-bold text-white shadow"
                        title="Alleen vandaag op A4, XXL en Tape"
                      >
                        -10% met MATCHDAY10
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{p.tags.join(" · ")}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {p.id.startsWith("normal-")
                        ? "Formaat: 85×55mm"
                        : p.id.startsWith("xxl-")
                        ? "Formaat: A6 (105×148mm)"
                        : p.id === "a4-stickers"
                        ? "Formaat: A4 (210×297mm)"
                        : p.group === "accessoires"
                        ? "Accessoire"
                        : "-"}
                      {" · "}Vinyl · UV- & waterbestendig
                    </p>

                    {/* Variant selector */}
                    <div className="mt-3 flex items-center gap-2">
                      <label htmlFor={`variant-${p.id}`} className="text-sm text-neutral-700">Kies aantal:</label>
                      <select
                        id={`variant-${p.id}`}
                        className="rounded-xl border px-3 py-1.5 text-sm"
                        value={variantId}
                        onChange={(e) => changeVariant(p.id, e.target.value)}
                      >
                        {p.variants.map((v) => (
                          <option key={v.id} value={v.id}>{v.label}</option>
                        ))}
                      </select>
                    </div>

                    {p.variantNote && <p className="mt-2 text-xs text-neutral-500">{p.variantNote}</p>}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-extrabold tracking-tight">{formatPrice(price)}</span>
                      <button
                        onClick={() => addToCart(p.id)}
                        className="rounded-2xl border px-3 py-1.5 text-sm font-semibold hover:shadow transition bg-[#f2f8f6] hover:bg-white"
                      >
                        Voeg toe
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info */}
      <section id="info" className="bg-white/90">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl border p-6 shadow-sm">
            <h3 className="font-extrabold text-lg">Verzending</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Verzendkosten: <strong>€4,50</strong> standaard. <br />
              <em>Uitzondering:</em> bestellingen die uitsluitend bestaan uit <strong>25 stuks</strong> (Normaal) of <strong>10 stuks</strong> (XXL A6) verzenden voor <strong>€4,00</strong>.
            </p>
          </div>
          <div className="rounded-3xl border p-6 shadow-sm">
            <h3 className="font-extrabold text-lg">Betalen</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Betaling stemmen we na bestelling af via <strong>WhatsApp</strong> (we sturen direct een betaalverzoek, bijv. Tikkie).
            </p>
          </div>
          <div className="rounded-3xl border p-6 shadow-sm">
            <h3 className="font-extrabold text-lg">Kwaliteit</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Polymeer vinyl, outdoor-laminaat, krasvast. Met liefde gemaakt in 070.
            </p>
          </div>
        </div>
      </section>

      {/* Contact + Instagram/TikTok */}
      <footer id="contact" className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-black">Contact</h3>
            <p className="mt-2 text-white/80">Heb je een vraag of wil je samenwerken? Stuur een bericht!</p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 shadow-sm hover:shadow transition bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" strokeWidth="1.5"
                     className="h-4 w-4">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <circle cx="17.5" cy="6.5" r="0.5"></circle>
                </svg>
                Instagram
              </a>

              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 shadow-sm hover:shadow transition bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"
                     className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M34.8 14.6c-3.2-1.7-5.4-4.5-6.2-8.2h-6.1v24.8c-.1 2.4-2.1 4.3-4.5 4.3-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c.6 0 1.1.1 1.6.3V20c-7.1-1.1-13.6 4.5-13.6 11.7 0 6.4 5.2 11.6 11.6 11.6 6.3 0 11.5-5.1 11.6-11.4V19.3c2.3 1.9 5.2 3.1 8.4 3.1v-7.8c-.9 0-1.8-.1-2.7-.4z"/>
                </svg>
                TikTok
              </a>
            </div>

            <form className="mt-4 grid gap-3">
              <input className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#f2c200]" placeholder="E-mail" />
              <textarea className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#f2c200]" placeholder="Bericht" rows={4} />
              <button type="button" className="rounded-2xl bg-[#f2c200] px-5 py-2.5 font-bold text-neutral-900 shadow hover:shadow-md transition">Versturen</button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-black">Over 070_stickershop</h3>
            <p className="mt-2 text-white/80">
              Hoogwaardige vinyl stickers in groen-geel, ontworpen voor buitengebruik. UV- en waterbestendig,
              snel geleverd vanuit Den Haag. Vragen of maatwerk? Stuur ons gerust een bericht.
            </p>
            <ul className="mt-3 text-white/70 text-sm list-disc list-inside space-y-1">
              <li>Vinyl met outdoor-laminaat</li>
              <li>Scherpe prijzen & staffelkorting</li>
              <li>Snelle verzending binnen Nederland</li>
            </ul>
            <div className="mt-4 text-sm text-white/60">© {new Date().getFullYear()} 070_stickershop – Alle rechten voorbehouden</div>
          </div>
          {/* ---------------------------------- Reviews Sectie ---------------------------------- */}
<section className="max-w-5xl mx-auto px-4 py-12">
  <div className="text-center mb-8">
    <h2 className="text-2xl font-extrabold text-[#008C45]">Tevreden Klanten 💬</h2>
    <p className="text-neutral-700 mt-1">Gemiddeld <span className="font-bold text-[#FFD700]">4.7 / 5</span> gebaseerd op echte bestellingen</p>
  </div>

  <div className="grid sm:grid-cols-2 gap-6">
    {/* Review 1 */}
    <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <img src="/img/reviews/kevin.jpg" alt="Kevin" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-bold">Kevin</p>
          <p className="text-sm text-neutral-500">Kevin uit Den Haag</p>
        </div>
      </div>
      <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
      <p className="text-neutral-700 italic">
        “Topkwaliteit stickers, snel geleverd en goeie service. Echte klasse!”
      </p>
    </div>

    {/* Review 2 */}
    <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <img src="/img/reviews/Szymon.jpg" alt="Szymon" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-bold">Szymon</p>
          <p className="text-sm text-neutral-500">Szymon uit Warschau</p>
        </div>
      </div>
      <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
      <p className="text-neutral-700 italic">
        “Thank you very much friends from The Hague for this amazing stickers!”
      </p>
    </div>

    {/* Review 3 */}
    <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <img src="/img/reviews/daan.jpg" alt="Daan" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-bold">Daan</p>
          <p className="text-sm text-neutral-500">Daan uit Ypenburg</p>
        </div>
      </div>
      <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
      <p className="text-neutral-700 italic">
        “Helemaal top, Voorheen altijd via instagram maar de site werkt top!”
      </p>
    </div>

    {/* Review 4 */}
    <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <img src="/img/reviews/linda.jpg" alt="Linda" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-bold">Linda</p>
          <p className="text-sm text-neutral-500">Linda Uit Leidschendam</p>
        </div>
      </div>
      <div className="text-yellow-400 mb-2">⭐⭐⭐⭐</div>
      <p className="text-neutral-700 italic">
        “Snelle levering, netjes verpakt. Mijn jongens vonden ze geweldig!”
      </p>
    </div>

    {/* Review 5 */}
    <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <img src="/img/reviews/linda.jpg" alt="Linda" className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-bold">Mike</p>
          <p className="text-sm text-neutral-500">Mike Uit Leidschendam</p>
        </div>
      </div>
      <div className="text-yellow-400 mb-2">⭐⭐⭐⭐</div>
      <p className="text-neutral-700 italic">
        “Zeer tevreden met deze stickers!”
      </p>
    </div>
  </div>
</section>
        </div>
      </footer>

      {/* Cart Drawer (z-index boven toast) */}
      {openCart && (
        <div className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpenCart(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold">Winkelwagen</h3>
              <button onClick={() => setOpenCart(false)} className="rounded-xl border px-2 py-1 text-sm">Sluiten</button>
            </div>

            {/* items */}
            <div className="mt-4 flex-1 overflow-auto divide-y">
              {cart.length === 0 && <p className="text-sm text-neutral-600">Nog geen items. Voeg iets toe uit de collectie.</p>}
              {cart.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="py-3 flex items-center gap-3">
                  <img src={item.img} alt="" className="h-14 w-14 rounded-xl object-cover object-center" />
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-neutral-600">{item.variantLabel} – {formatPrice(item.price)}</div>
                    <div className="text-sm text-neutral-600">Aantal in wagen: {item.qty}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.productId, item.variantId)} className="text-sm rounded-xl border px-2 py-1">Verwijder</button>
                </div>
              ))}
            </div>

            {/* totals + checkout */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Subtotaal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {/* Kortingscode */}
              <div className="mt-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-green-50 border border-green-200 px-3 py-2">
                    <div className="text-sm">
                      <span className="font-semibold">Code toegepast:</span>{" "}
                      {appliedCoupon.code}{" "}
                      <span className="text-green-700">
                        ({appliedCoupon.description || "korting"})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Verwijderen
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Kortingscode"
                      className="flex-1 rounded-xl bg-white border border-black/10 px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="rounded-xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white text-sm font-semibold px-3 py-2"
                    >
                      Toepassen
                    </button>
                  </div>
                )}
              </div>

              {/* Korting regel (indien actief) */}
              {discount > 0 && (
                <div className="mt-2 flex items-center justify-between text-sm text-green-700">
                  <span>Korting</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="mt-1 flex items-center justify-between text-sm">
                <span>Verzendkosten</span>
                <span>{shipping === 0 ? "–" : formatPrice(shipping)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-lg font-extrabold">
                <span>Totaal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                onTouchStart={handleCheckout}
                onKeyDown={(e) => (e.key === "Enter" ? handleCheckout() : null)}
                className="relative z-10 mt-3 w-full rounded-2xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white font-semibold px-5 py-2.5 shadow hover:shadow-md transition"
                role="button"
                tabIndex={0}
              >
                Bestelling plaatsen
              </button>

              <p className="mt-2 text-xs text-neutral-500">
                Alle prijzen excl. verzendkosten. Verzendkosten worden automatisch berekend op basis van je keuze.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Add-to-cart toast (niet tonen als cart open is) */}
      {toast.open && !openCart && (
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-4 z-[40] flex justify-center transition-all duration-300 ${
            toast.open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          aria-live="polite"
        >
          <div className="pointer-events-auto mx-4 w-full max-w-md rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur p-3">
            <div className="flex items-center gap-3">
              {toast.img ? (
                <img
                  src={toast.img}
                  alt=""
                  className="h-10 w-10 rounded-lg object-cover object-center border border-black/10"
                />
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="text-sm">
                  <span className="font-semibold">{toast.title}</span>
                  {toast.variant ? <span className="text-neutral-600"> — {toast.variant}</span> : null}
                </div>
                <div className="text-xs text-neutral-600">Toegevoegd aan je winkelwagen</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOpenCart(true);
                    setToast((t) => ({ ...t, open: false }));
                  }}
                  className="rounded-xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white text-xs font-semibold px-3 py-1.5 shadow"
                >
                  Bekijk winkelwagen
                </button>
                <button
                  onClick={() => setToast((t) => ({ ...t, open: false }))}
                  className="rounded-xl border px-2 py-1 text-xs"
                  aria-label="Sluit melding"
                  title="Sluiten"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bevestigingsmodal vóór afrekenen (stap 1) */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[90]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-black/10 p-5">
              <h3 className="text-xl font-extrabold">Bestelling bevestigen</h3>

              <div className="mt-3 max-h-56 overflow-auto divide-y">
                {cart.map((i) => (
                  <div key={`${i.productId}-${i.variantId}`} className="py-2 flex items-center gap-3">
                    <img src={i.img} alt="" className="h-10 w-10 rounded-lg object-cover object-center border border-black/10" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{i.title}</div>
                      <div className="text-sm text-neutral-600">{i.variantLabel} × {i.qty}</div>
                    </div>
                    <div className="text-sm font-semibold">{formatPrice(i.price * i.qty)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Subtotaal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-green-700">
                    <span>Korting ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Verzendkosten</span>
                  <span>{shipping === 0 ? "–" : formatPrice(shipping)}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-extrabold">
                  <span>Totaal</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                {/* i.p.v. direct afrekenen -> ga naar adres-stap */}
                <button
                  onClick={() => {
                    haptic(15);
                    beep(80, 820, 0.12);
                    setConfirmOpen(false);
                    setAddressOpen(true);
                  }}
                  className="flex-1 rounded-2xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white font-semibold px-4 py-2.5 shadow"
                >
                  Doorgaan naar betaling
                </button>
                <button
                  onClick={() => {
                    setConfirmOpen(false);
                    haptic(10);
                  }}
                  className="rounded-2xl border px-4 py-2.5"
                >
                  Annuleren
                </button>
              </div>

              <p className="mt-2 text-xs text-neutral-500">
                Je gaat in de volgende stap je adres invullen en daarna word je doorgestuurd naar WhatsApp.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* /modal stap 1 */}

      {/* Adresgegevens modal – stap 2 */}
      {addressOpen && (
        <div className="fixed inset-0 z-[95]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setAddressOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-black/10 p-5">
              <h3 className="text-xl font-extrabold">Bezorgadres</h3>

              <div className="mt-3 grid gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Naam</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-black/10 px-3 py-2"
                    placeholder="Voor- en achternaam"
                    value={customer.name}
                    onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Straat + huisnummer</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-black/10 px-3 py-2"
                    placeholder="Bijv. Leyweg 123"
                    value={customer.street}
                    onChange={(e) => setCustomer((c) => ({ ...c, street: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Postcode + plaats</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-black/10 px-3 py-2"
                    placeholder="Bijv. 2545AA Den Haag"
                    value={customer.postalCity}
                    onChange={(e) => setCustomer((c) => ({ ...c, postalCity: e.target.value }))}
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  We gebruiken dit adres alleen om je bestelling te verzenden.
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!customer.name.trim() || !customer.street.trim() || !customer.postalCity.trim()) {
                      alert("Vul je naam en adres (straat + huisnr, postcode + plaats) in.");
                      return;
                    }
                    haptic(15);
                    beep(80, 820, 0.12);
                    const tekst = buildOrderText();
                    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(tekst)}`;
                    // kleine succesmelding
                    setSuccessMsg("✅ Bestelling wordt geopend in WhatsApp...");
                    setTimeout(() => {
                      window.location.href = url;
                    }, 800);
                  }}
                  className="flex-1 rounded-2xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white font-semibold px-4 py-2.5 shadow"
                >
                  Bestellen via WhatsApp
                </button>
                <button
                  onClick={() => {
                    setAddressOpen(false);
                    setConfirmOpen(true); // terug naar stap 1
                    haptic(10);
                  }}
                  className="rounded-2xl border px-4 py-2.5"
                >
                  Terug
                </button>
              </div>

              <p className="mt-2 text-xs text-neutral-500">
                We sturen je bestelling via WhatsApp door. Je ontvangt daarna een betaalverzoek.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* /modal stap 2 */}

      {/* Sticky Winkelwagen knop – Haagse stijl (altijd zichtbaar) */}
      <button
        onClick={() => setOpenCart(true)}
        className="fixed z-[95] bottom-5 right-5 rounded-full shadow-xl px-5 py-4 flex items-center gap-2"
        style={{ backgroundColor: "#008C45", color: "white", border: "3px solid #FFD700" }}
        aria-label="Open winkelwagen"
        title="Winkelwagen"
      >
        <span aria-hidden>🛒</span>
        {cart.length > 0 && (
          <span
            className="ml-1 text-sm font-extrabold min-w-6 h-6 rounded-full grid place-items-center"
            style={{ backgroundColor: "#FFD700", color: "#0b6e4f", padding: "0 8px" }}
          >
            {cart.reduce((n, x) => n + x.qty, 0)}
          </span>
        )}
      </button>

      {/* Success melding */}
      {successMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-black/10 px-4 py-2 rounded-2xl text-sm font-semibold text-[#0b6e4f] z-[96]">
          {successMsg}
        </div>
      )}
    </div>
  );
}
