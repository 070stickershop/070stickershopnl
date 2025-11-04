import React, { useMemo, useState, useRef } from "react";

/* ================== Helpers ================== */
function formatPrice(n) {
  return n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
}

function haptic(ms = 30) {
  if (navigator.vibrate) navigator.vibrate(ms);
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
const WHATSAPP_NUMBER = "31624729671";
const INSTAGRAM_URL = "https://www.instagram.com/070_stickershop/";
const TIKTOK_URL = "https://www.tiktok.com/@070_stickershop";
const CATEGORIES = [
  { id: "all", label: "Alles" },
  { id: "normaal", label: "Normaal" },
  { id: "xxl", label: "XXL A6" },
  { id: "a4", label: "A4" },
  { id: "accessoires", label: "Accessoires" },
];

/* ================== Dynamic product import ================== */
// eslint-disable-next-line import/no-webpack-loader-syntax
const productsModules = import.meta.glob("./data/products/*.json", { eager: true });
const PRODUCTS = Object.values(productsModules).map((m) => m.default || m);

/* ================== App ================== */
export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [toast, setToast] = useState({ open: false, title: "", img: "", variant: "" });
  const toastTimerRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function showAddedToast({ title, img, variant }) {
    setToast({ open: true, title, img, variant });
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ open: false }), 2200);
    haptic(25);
    beep(110, 920, 0.13);
  }

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const visibleItems = useMemo(() => {
    if (category === "all") return items;
    return items.filter((p) => p.group === category);
  }, [items, category]);

  function addToCart(product) {
    const { id, title, img } = product;
    const variant = product.variants?.[0] || { id: "1", label: "1 stuks", price: 0 };
    setCart((prev) => {
      const existing = prev.find((x) => x.productId === id);
      if (existing) {
        return prev.map((x) =>
          x.productId === id ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [
        ...prev,
        {
          productId: id,
          title,
          variantId: variant.id,
          variantLabel: variant.label,
          price: variant.price,
          img,
          qty: 1,
        },
      ];
    });
    showAddedToast({ title, img, variant: variant.label });
  }

  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const shipping = cart.length > 0 ? 4.5 : 0;
  const total = subtotal + shipping;

  function buildOrderText() {
    const lines = cart.map(
      (i) =>
        `• ${i.title} – ${i.variantLabel} × ${i.qty} = ${formatPrice(
          i.price * i.qty
        )}`
    );
    return [
      "Bestelling 070stickershop.nl",
      ...lines,
      `Totaal: ${formatPrice(total)}`,
      "",
      "Vul hieronder je adres en naam in:",
      "Naam:",
      "Adres:",
      "Postcode + Woonplaats:",
      "",
      "We sturen daarna direct een betaalverzoek terug via WhatsApp 👊",
    ].join("\n");
  }

  function proceedCheckout() {
    if (cart.length === 0) {
      alert("Je winkelwagen is leeg.");
      return;
    }
    const tekst = buildOrderText();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(tekst)}`;
    window.location.href = url;
  }

  /* ================== UI ================== */
  return (
    <div className="min-h-screen text-neutral-900 bg-gradient-to-br from-[#0b6e4f] via-[#f2c200]/30 to-[#f2c200]/60">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-black/5">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <img src="/img/070-logo.jpeg" alt="Logo" className="h-10 w-auto" />
            <span className="font-extrabold tracking-tight text-xl">
              070_stickershop
            </span>
          </div>
          <button
            onClick={() => setOpenCart(true)}
            className="ml-auto relative p-2 rounded-full border shadow-sm hover:shadow bg-white/90"
          >
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate h-[400px] md:h-[600px]">
        <img
          src={HERO_BG}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white">
          <div>
            <h1 className="text-4xl font-black mb-4">070 Stickershop</h1>
            <p className="text-lg">Hoogwaardige vinyl stickers – Groen & Geel trots</p>
            <a
              href="#collectie"
              className="inline-block mt-6 bg-[#f2c200] text-black px-5 py-2 rounded-2xl font-bold"
            >
              Shop nu
            </a>
          </div>
        </div>
      </section>

      {/* Collectie */}
      <section id="collectie" className="bg-white/80 border-t border-black/5">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-black mb-4">Collectie</h2>

          <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  category === c.id
                    ? "bg-[#0b6e4f] text-white"
                    : "bg-white hover:bg-white/90"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* No products fallback */}
          {PRODUCTS.length === 0 ? (
            <p className="text-center text-neutral-600">
              Nog geen producten toegevoegd via CMS.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleItems.map((p) => (
                <article
                  key={p.id}
                  className="rounded-3xl bg-white shadow hover:shadow-lg transition overflow-hidden border border-black/5"
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {p.badge && (
                      <span className="absolute left-3 top-3 bg-[#0b6e4f] text-white text-xs px-2 py-1 rounded-xl">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-neutral-600">
                      {p.extra || "Sticker"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-extrabold">
                        {p.variants?.[0]
                          ? formatPrice(p.variants[0].price)
                          : "€0,00"}
                      </span>
                      <button
                        onClick={() => addToCart(p)}
                        className="rounded-2xl border px-3 py-1.5 text-sm font-semibold hover:shadow bg-[#f2f8f6] hover:bg-white"
                      >
                        Voeg toe
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Winkelwagen Drawer */}
      {openCart && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenCart(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold">Winkelwagen</h3>
              <button onClick={() => setOpenCart(false)}>✕</button>
            </div>
            <div className="flex-1 overflow-auto divide-y">
              {cart.length === 0 ? (
                <p className="text-sm text-neutral-600">
                  Nog geen items toegevoegd.
                </p>
              ) : (
                cart.map((i) => (
                  <div
                    key={i.productId}
                    className="py-3 flex items-center gap-3"
                  >
                    <img
                      src={i.img}
                      alt=""
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{i.title}</div>
                      <div className="text-sm text-neutral-600">
                        {i.variantLabel} – {formatPrice(i.price)}
                      </div>
                      <div className="text-sm text-neutral-600">
                        Aantal: {i.qty}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t mt-4 pt-4 space-y-1">
              <div className="flex justify-between">
                <span>Subtotaal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Verzendkosten</span>
                <span>{formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Totaal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <button
                onClick={proceedCheckout}
                className="w-full mt-4 rounded-2xl bg-[#0b6e4f] text-white py-2 font-semibold shadow"
              >
                Bestelling plaatsen via WhatsApp
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
