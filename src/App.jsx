/* App.jsx – versie met Haagse winkelwagen & adres-checkout (Matchday versie) */
import React, { useMemo, useState, useRef, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Admin from "./Admin";

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
function beep() {
  const audio = new Audio("/sounds/add.mp3");
  audio.volume = 0.4;
  audio.play();
}

/* ================== Config ================== */
const HERO_BG = "/img/ado-sfeer.jpg";

// Betalen 
const PAYMENT_MODE = "whatsapp"; // "whatsapp" | "paypalme" | "tikkie-api"
const WHATSAPP_NUMBER = "31624729671"; // <-- jouw nummer zonder +
const PAYPAL_ME_HANDLE = "JouwPayPalMeNaam";

// Socials
const INSTAGRAM_HANDLE = "070_stickershop";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const TIKTOK_HANDLE = "070_stickershop";
const TIKTOK_URL = `https://www.tiktok.com/@${TIKTOK_HANDLE}`;

const CATEGORIES = [
  { id: "all", label: "Alles" },
  { id: "normaal", label: "Normaal Formaat" },
  { id: "xxl", label: "XXL A6 Formaat" },
  { id: "a4", label: "A4 Formaat" },
  { id: "meter", label: "1 Meter Stickers" },
  { id: "accessoires", label: "Accessoires" },
  { id: "kleding", label: "Kleding" }
];

/* ---- KORTINGSCODES ----
   MATCHDAY10: alleen op wedstrijddagen, 10% op A4, XXL en Accessoires (tape/vlag) */
const COUPONS = {
  MATCHDAY10: {
    type: "percent",
    value: 10,
    description: "10% korting op A4, XXL en Tape/Vlag (alleen matchdays)",
    groups: ["a4", "xxl", "accessoires"],
    onlyToday: true,
  },
  WELCOME10: {
  type: "percent",
  value: 10,
  description: "10% korting op je eerste bestelling",
},
ANTIDB20: {
    type: "percent",
    value: 20,
    description: "20% korting op Goodnight m-s*de stickers",
    productIds: ["normal-goodnight"], // 👈 jouw product ID
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

// Lijst met wedstrijddagen (YYYY-MM-DD)
const MATCH_DAYS = [
  "2025-12-12",
  "2025-12-19",
  "2026-01-09",
  "2026-01-16",
  "2026-01-23",
  "2026-01-26",
  "2026-01-30",
  "2026-02-13",
  "2026-02-20",
  "2026-02-27",
  "2026-03-07",
  "2026-03-13",
  "2026-03-17",
  "2026-03-22",
  "2026-04-03",
  "2026-04-06",
  "2026-04-12",
  "2026-04-17",
  "2026-04-24",
  // vul hier zelf jouw wedstrijddagen toe
];

function isMatchdayToday() {
  // alleen true op wedstrijddagen
  return MATCH_DAYS.includes(localISODate());
}

function isEligibleForMatchday(product) {
  // A4, XXL en accessoires (tape/vlag)
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
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
    soldOut: true,
  },
   {
    id: "normal-your-city",
    title: "Your City Our Rules",
    img: "/img/your-city.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
  },
  {
    id: "mooie-stad-achter-duinen",
    title: "Mooie stad Achter De Duinen",
    img: "/img/mooie-stad.jpg",
    tags: ["normaal", "100x70mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "100×70 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
  },
  {
    id: "13-12-sticker",
    title: "A.C.A.B",
    img: "/img/1312-peuken.jpg",
    tags: ["normaal", "100x70mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "100×70 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
  },
   {
    id: "normal-goodnight",
    title: "Good Night M-S*de",
    img: "/img/good-night-m.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
  },
   {
    id: "den-haag-over-plakt",
    title: "Den Haag Overplakt",
    img: "/img/den-haag-overplakt.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
    soldOut: false,
  },
  {
    id: "normal-groeten-uit-den-haag",
    title: "Groeten Uit Den Haag",
    img: "/img/groeten-uit-den-haag.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw",
    group: "normaal",
    soldOut: true,
  },
  {
    id: "normal-denhaag-culture",
    title: "Den Haag Culture",
    img: "/img/denhaag-culture.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw",
    group: "normaal",
    soldOut: false,
  },
  {
    id: "normal-generaties-heen",
    title: "Door De Generaties Heen",
    img: "/img/door-de-generaties.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
  },
  {
    id: "normal-mijn-club",
    title: "Mijn Club FC Den Haag",
    img: "/img/mijn-club-fc-den-haag.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
    soldOut: false,
  },
  {
    id: "normal-fuck-den-bosch",
    title: "Fuck Den Bosch",
    img: "/img/fuck-den-bosch.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
    soldOut: true,
  },
  {
    id: "normal-den-haag-till",
    title: "Den Haag Till",
    img: "/img/den-haag-till.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
  },
  {
    id: "normal-green-yellow-army",
    title: "Green Yellow Army",
    img: "/img/green-yellow-army.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
    soldOut: true,
  },
  {
    id: "normal-betreden-op-eigen-risico",
    title: "Betreden op eigen risico",
    img: "/img/betreden-op-eigen-risico.jpg",
    tags: ["normaal", "100x100mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
    soldOut: false,
  },
  {
    id: "normal-coming-for-you",
    title: "Coming for you",
    img: "/img/coming-for-you.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
    ],
    extra: "85×55 mm · Vinyl · UV- & waterbestendig",
    badge: "Nieuw !",
    group: "normaal",
    soldOut: false,
  },
  {
    id: "normal-fuck-espn",
    title: "F*ck ESPN",
    img: "/img/fuck-espn.jpg",
    tags: ["normaal", "85x55mm", "vinyl"],
    variants: [
      { id: "25", label: "25 stuks", price: 4.5 },
      { id: "50", label: "50 stuks", price: 7.5 },
      { id: "100", label: "100 stuks", price: 12.0 },
      { id: "200", label: "200 stuks", price: 23.0 },
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
      { id: "50", label: "50 stuks", price: 8.5 },
      { id: "100", label: "100 stuks", price: 13.0 },
      { id: "150", label: "150 stuks", price: 18.5 },
      { id: "200", label: "200 stuks", price: 24.0 },
    ],
    extra: "Mix van designs · 85×55 mm · Vinyl · UV- & waterbestendig",
    group: "normaal",
    badge: "Ideaal voor awaydays",
  },

  /* ---------------- XXL (A6) ---------------- */
  {
    id: "xxl-zone",
    title: "XXL stickers A6 – Den Haag zone",
    img: "/img/den-haag-zone-a6.jpg",
    tags: ["A6", "xxl", "zone"],
    variants: [
      { id: "10", label: "10 stuks", price: 4.99 },
      { id: "25", label: "25 stuks", price: 7.99 },
      { id: "50", label: "50 stuks", price: 13.99 },
      { id: "75", label: "75 stuks", price: 18.99 },
      { id: "100", label: "100 stuks", price: 24.99 },
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
      { id: "10", label: "10 stuks", price: 4.99 },
      { id: "25", label: "25 stuks", price: 7.99 },
      { id: "50", label: "50 stuks", price: 13.99 },
      { id: "75", label: "75 stuks", price: 18.99 },
      { id: "100", label: "100 stuks", price: 24.99 },
    ],
    extra: "A6 (105×148 mm) · Vinyl · UV- & waterbestendig",
    group: "xxl",
  },
  {
    id: "xxl-fc-den-haag-1905",
    title: "XXL stickers – FC Den Haag / 1905",
    img: "/img/fc-den-haag.jpg",
    tags: ["rond", "xxl", "1905", "denhaag"],
    variants: [
      { id: "10", label: "10 stuks", price: 4.99 },
      { id: "25", label: "25 stuks", price: 7.99 },
      { id: "50", label: "50 stuks", price: 13.99 },
      { id: "75", label: "75 stuks", price: 18.99 },
      { id: "100", label: "100 stuks", price: 24.99 },
    ],
    extra: "Vinyl · UV- & waterbestendig",
    badge: "Ronde Stickers !",
    group: "xxl"
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
    badge: "Alleen bij 070stickershop.nl !",
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
    id: "t-shirt-did-you-miss-us",
    title: "Promotie 25/26 T-Shirt",
    img: "/img/did-you-miss-us.jpg",
    tags: ["t-shirt", "accessoires", "promotie", "eredivise"],
    variants: [
{ id: "S", label: "Maat S", price: 23.99 },
{ id: "M", label: "Maat M", price: 23.99 },
{ id: "L", label: "Maat L", price: 23.99 },
{ id: "XL", label: "Maat XL", price: 23.99 },
    ],
    extra: "Promotie shirt · Verkrijgbaar in S t/m XL · Did You Miss Us ?.",
    group: "kleding",
  },
  {
    id: "t-shirt-schilden-en-de-schaal",
    title: "kampioensshirt 25/26 🏆🔰",
    img: "/img/tshirt-kampioen.jpg",
    tags: ["t-shirt", "accessoires", "kampioen", "eredivise"],
    variants: [
{ id: "S", label: "Maat S", price: 23.99 },
{ id: "M", label: "Maat M", price: 23.99 },
{ id: "L", label: "Maat L", price: 23.99 },
{ id: "XL", label: "Maat XL", price: 23.99 },
    ],
    extra: "Kampioens shirt · Verkrijgbaar in S t/m XL · De schilden en de schaal ? · Den Haag heeft het allemaal !",
    group: "kleding",
  },
   {
    id: "t-shirt-brothers-juve",
    title: "Brothers Den Haag x Juventus T-Shirt",
    img: "/img/brothers-juve.jpg",
    tags: ["t-shirt", "accessoires", "denhaag", "juventus"],
    variants: [
{ id: "S", label: "Maat S", price: 23.99 },
{ id: "M", label: "Maat M", price: 23.99 },
{ id: "L", label: "Maat L", price: 23.99 },
{ id: "XL", label: "Maat XL", price: 23.99 },
    ],
    extra: "Brothers Den Haag x Juventus shirt · Verkrijgbaar in S t/m XL ·.",
    group: "kleding",
  },
  {
    id: "sjaal-1team-1taak",
    title: "1 team 1 taak sjaal",
    img: "/img/1-team-1-taak.jpg",
    tags: ["sjaal", "accessoires", "limited edition", "awaydays"],
    variants: [
      { id: "1", label: "1 sjaal", price: 19.99 },
      { id: "2", label: "2 sjaal", price: 27.99 },
    ],
    extra: "Ideaal om mee te nemen naar awaydays · Tijdelijk Verkrijgbaar.",
    group: "accessoires",
  },
  {
    id: "zonnebril-dh",
    title: "Zonnebril geel groen ",
    img: "/img/1312-zonnebril.jpg",
    tags: ["zonnebril", "accessoires", "limited edition", "zomercollectie"],
    variants: [
      { id: "1", label: "1 Zonnebril", price: 9.99 },
      { id: "2", label: "2 Zonnebrillen", price: 19.99 },
      { id: "3", label: "3 Zonnebrillen", price: 27.99 },
    ],
    extra: "Ideaal voor de zomer · Tijdelijk Verkrijgbaar.",
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
  {
    id: "den-haag-1-meter-cp",
    title: "1 Meter Sticker (Den Haag)",
    img: "/img/den-haag-cp.jpg",
    tags: ["1 meter lang", "accessoires", "uniek", "awaydays"],
    variants: [
      { id: "1", label: "1 stuk", price: 4.50 },
      { id: "2", label: "2 stuks", price: 9.00 },
      { id: "3", label: "3 stuks", price: 10.5 },
      { id: "5", label: "5 stuks", price: 17.50 },
    ],
    extra: "Uniek in nederland · 1 meter lang.",
    group: "meter",
    badge: "Alleen bij 070stickershop.nl !",
  },
    {
    id: "den-haag-1-meter-geel-groen",
    title: "1 Meter Sticker (Stad logo)",
    img: "/img/den-haag-yg.jpg",
    tags: ["1 meter lang", "accessoires", "uniek", "awaydays"],
    variants: [
      { id: "1", label: "1 stuk", price: 4.50 },
      { id: "2", label: "2 stuks", price: 9.00 },
      { id: "3", label: "3 stuks", price: 10.5 },
      { id: "5", label: "5 stuks", price: 17.50 },
    ],
    extra: "Uniek in nederland · 1 meter lang.",
    group: "meter",
    badge: "Alleen bij 070stickershop.nl !",
    soldOut: true,
  },
  {
  id: "combi-tape-meter",
  title: "Combi Deal – Tape Rol + 1 Meter Sticker !",
  img: "/img/combi.jpg", // kies ff een afbeelding
  tags: ["deal", "tape", "1 meter", "voordeel"],
  variants: [
    { id: "1", label: "1 set", price: 10.5 },
    { id: "2", label: "2 sets", price: 20.5 },
    { id: "3", label: "3 sets", price: 30.0 },
  ],
  extra: "Normaal €15.00 · Nu €10.50 🔥",
  group: "accessoires",
  badge: "🔥 BESTE DEAL",
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
const FREQUENTLY_BOUGHT = {
  // 🔥 NORMALE STICKERS → upsell tape + 1 meter
  "normal-your-city": ["tape-rol-groeten", "den-haag-1-meter-cp"],
  "normal-goodnight": ["tape-rol-groeten", "den-haag-1-meter-cp"],
  "normal-groeten-uit-den-haag": ["tape-rol-groeten", "den-haag-1-meter-cp"],
  "normal-denhaag-culture": ["tape-rol-groeten", "den-haag-1-meter-cp"],
  "normal-coming-for-you": ["tape-rol-groeten", "den-haag-1-meter-cp"],

  // 🔥 1 METER → upsell tape + mix
  "den-haag-1-meter-cp": ["tape-rol-groeten", "normal-mix"],
  "den-haag-1-meter-geel-groen": ["tape-rol-groeten", "normal-mix"],

  // 🔥 XXL → upsell tape
  "xxl-zone": ["tape-rol-groeten"],

  // fallback (optioneel)
};

/* ================== App ================== */
export default function App() {
const [products, setProducts] = useState(PRODUCTS);
const [reviews, setReviews] = useState([]);
const [name, setName] = useState("");
const [text, setText] = useState("");
const [rating, setRating] = useState(5);
useEffect(() => {
  fetchProducts();
  fetchReviews();
}, []);

async function fetchReviews() {
  const { data } = await supabase
    .from("reviews")
    .select("*");

  if (data) setReviews(data);
}

async function sendContact() {
  console.log("CLICK WERKT"); // test

  if (!name || !text) {
    alert("Vul alles in");
    return;
  }

  const { error } = await supabase.from("contact").insert([
    {
      name: name,
      message: text
    }
  ]);

  if (error) {
    console.error(error);
    alert("Fout bij verzenden");
  } else {
    alert("Bericht verzonden!");
    setName("");
    setText("");
  }
}

// 👇 HIER PLAKKEN
async function addReview() {
  if (!name || !text) return;

  await supabase.from("reviews").insert([
    {
      name,
      text,
      rating: parseInt(rating),
    }
  ]);

  setName("");
  setText("");
  setRating(5);

  fetchReviews();
}

async function fetchProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (!error && data.length > 0) {
    const mapped = data.map(p => ({
      id: p.id,
      title: p.title,
      img: p.img,
      group: p.group || "normaal",
      badge: p.badge,
      tags: ["accessoires"],
      extra: "",
      variants: [
        {
          id: "1",
          label: "1 stuk",
          price: p.price
        }
      ]
    }));

    // 👇 BELANGRIJK
setProducts(mapped.length ? mapped : PRODUCTS);
  }

}
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  useEffect(() => {
  if (cart.length === 0 && openCart) {
    setTimeout(() => setOpenCart(false), 150);
  }
}, [cart]);
  const ids = new Set();

function getFrequentlyBought() {
  const scores = {};

  cart.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return;

    // 🎯 NORMAAL → upsell 1 meter + tape
    if (product.group === "normaal") {
      scores["den-haag-1-meter-cp"] = (scores["den-haag-1-meter-cp"] || 0) + 3;
      scores["tape-rol-groeten"] = (scores["tape-rol-groeten"] || 0) + 2;
    }

    // 🎯 1 meter → upsell mix + tape
    if (product.group === "meter") {
      scores["normal-mix"] = (scores["normal-mix"] || 0) + 3;
      scores["tape-rol-groeten"] = (scores["tape-rol-groeten"] || 0) + 2;
    }

    // 🎯 XXL → tape + zonnebril
    if (product.group === "xxl") {
      scores["tape-rol-groeten"] = (scores["tape-rol-groeten"] || 0) + 2;
      scores["zonnebril-dh"] = (scores["zonnebril-dh"] || 0) + 1;
    }
  });

  // 🔥 Sorteer op score (hoogste eerst)
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  return sorted
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 3); // max 3 upsells
}
  const [selectedUpsells, setSelectedUpsells] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [selected, setSelected] = useState(() => {
    const o = {};
    for (const p of products) o[p.id] = p.variants[0]?.id;
    return o;
  });

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, type, value, groups, onlyToday, description, appliedOn }

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    title: "",
    img: "",
    variant: "",
  });
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
  const [confirmOpen, setConfirmOpen] = useState(false); // stap 1
  const [addressOpen, setAddressOpen] = useState(false); // stap 2
  const [customer, setCustomer] = useState({
    name: "",
    street: "",
    postalCity: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

const items = useMemo(() => {
  const q = query.trim().toLowerCase();
  if (!q) return products;

  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(q))
  );
}, [query, products]);

const visibleItems = useMemo(() => {
  return items.filter((p) => {
    if (category === "all") return true;
    if (category === "a4") return p.id === "a4-stickers";
    if (category === "xxl") return p.id.startsWith("xxl-");
    if (category === "meter") return p.group === "meter";
    if (category === "accessoires") return p.group === "accessoires";
    if (category === "kleding") return p.group === "kleding";
    if (category === "normaal") return p.group === "normaal";
    return true;
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
    const product = products.find((p) => p.id === productId);
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
      prev.filter(
        (x) => !(x.productId === productId && x.variantId === variantId)
      )
    );
  }

  function toggleUpsell(id) {
  setSelectedUpsells(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  );
}

function addSelectedUpsells() {
  selectedUpsells.forEach(id => addToCart(id));
  setSelectedUpsells([]);
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

if (appliedCoupon.productIds?.length) {
  // 🎯 Alleen specifieke producten
  eligibleSubtotal = cart.reduce((sum, item) => {
    if (appliedCoupon.productIds.includes(item.productId)) {
      return sum + item.price * item.qty;
    }
    return sum;
  }, 0);

} else if (appliedCoupon.groups?.length) {
  // bestaande logica (matchday etc)
  eligibleSubtotal = cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
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
    // Alles daarboven -> €5,50
    return 5.5;
  }

  const shipping = computeShipping();
  const discount = computeDiscount(subtotal, cart);
  const total = Math.max(0, subtotal - discount) + shipping;
  const upsellItems = getFrequentlyBought();

const upsellTotal = upsellItems.reduce((sum, product) => {
  const price = resolveVariantPrice(product, product.variants[0].id).price;
  return sum + price;
}, 0);

const bundleDiscount = upsellTotal * 0.1;
const bundlePrice = upsellTotal - bundleDiscount;

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

    // Adresblok
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

  // Quick apply knop in banner – MATCHDAY10
  function applyMatchdayFromBanner() {
    setCouponInput("MATCHDAY10");
    const c = COUPONS.MATCHDAY10;
    if (c) {
      setAppliedCoupon({
        code: "MATCHDAY10",
        appliedOn: localISODate(),
        ...c,
      });
    }
    haptic(18);
  }
if (window.location.pathname.includes("/admin")) {
  return <Admin />;
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
            <a href="#collectie" className="hover:underline">
              Collectie
            </a>
            <a href="#info" className="hover:underline">
              Verzending
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>

            {/* Instagram */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-sm hover:shadow transition bg-white/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M34.8 14.6c-3.2-1.7-5.4-4.5-6.2-8.2h-6.1v24.8c-.1 2.4-2.1 4.3-4.5 4.3-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c.6 0 1.1.1 1.6.3V20c-7.1-1.1-13.6 4.5-13.6 11.7 0 6.4 5.2 11.6 11.6 11.6 6.3 0 11.5-5.1 11.6-11.4V19.3c2.3 1.9 5.2 3.1 8.4 3.1v-7.8c-.9 0-1.8-.1-2.7-.4z"
                />
              </svg>
              TikTok
            </a>
          </nav>
        </div>
      </header>

      {/* MATCHDAY banner – alleen zichtbaar op wedstrijddagen */}
      {isMatchdayToday() && (
        <div className="bg-black text-white">
          <div className="mx-auto max-w-6xl px-4 py-2 text-sm flex items-center gap-3">
            <span className="font-semibold">Matchday actie:</span>
            <span>MATCHDAY10 — 10% korting op A4, XXL en Tape/Vlag</span>
            {!appliedCoupon ? (
              <button
                onClick={applyMatchdayFromBanner}
                className="ml-auto rounded-full bg-white text-black px-3 py-1 text-xs font-semibold hover:bg-white/90"
              >
                Code toepassen
              </button>
            ) : (
              <span className="ml-auto text-green-400 font-semibold">
                Code toegepast
              </span>
            )}
          </div>
        </div>
      )}

{/* HERO */}
<section className="relative isolate h-[420px] md:h-[650px] lg:h-[750px]">
  
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/video/ado-sfeer.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/0" />

  <div className="relative z-10 mx-auto max-w-6xl px-4 h-full flex items-center">
    <div className="grid md:grid-cols-2 gap-10 items-center w-full">
      
      {/* TEXT */}
      <div>
        <h1 className="text-4xl font-black text-white">
  🔥 Jouw Stickershop voor Stickers & Meer !
</h1>

<p className="text-white mt-2">
  ✔ Sinds 2023 actief 
  ✔ 600+ tevreden klanten 
  ✔ Binnen 24 uur verzonden
</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#collectie"
            className="rounded-2xl bg-[#f2c200] px-5 py-2.5 font-semibold shadow hover:shadow-md transition"
          >
            Shop nu
          </a>
          <a
            href="#info"
            className="rounded-2xl bg-white/90 px-5 py-2.5 font-semibold shadow hover:shadow-md transition"
          >
            Verzending & betalen
          </a>
        </div>
      </div>

      {/* LOGO */}
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
      <p className="text-sm text-green-600 font-semibold mt-2">
  ⭐ 4.8/5 uit 600+ klanten
</p>
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight">
              Collectie
            </h2>
            <div className="md:ml-auto w-full md:w-80">
              <label className="relative block">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-2xl border px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0b6e4f]"
                  placeholder="Zoeken op naam of tag…"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  ⌘K
                </span>
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
                  category === c.id
                    ? "bg-[#0b6e4f] text-white border-[#0b6e4f]"
                    : "bg-white hover:bg-white/80"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <h3 className="text-xl font-bold mb-4">
  🔥 ASSORTIMENT
</h3>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleItems.map((p) => {
              const variantId = selected[p.id] ?? p.variants[0]?.id;
              const { price, label } = resolveVariantPrice(p, variantId);

              const isSoldOut = p.soldOut;
              const showMatchday =
                isMatchdayToday() && isEligibleForMatchday(p) && !isSoldOut;

              return (
                <article
                  key={p.id}
                  className="group rounded-3xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border border-black/5 overflow-hidden"
                >
                  {/* Afbeelding */}
                  <div className="relative w-full h-[300px] overflow-hidden bg-black">
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
                        title="Matchday: 10% korting op A4, XXL en Tape/Vlag met MATCHDAY10"
                      >
                        -10% met MATCHDAY10
                      </span>
                    )}
                    {/* Uitverkocht badge */}
                    {isSoldOut && (
                      <span className="absolute right-3 top-3 z-10 rounded-xl bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                        Uitverkocht
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg">{p.title}</h3>
                    <p className="text-sm text-yellow-500">
   🔰 Populair bij klanten
</p>

<p className="text-sm text-red-500 font-semibold">
  ⚡ Beperkte voorraad
</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {p.tags.join(" · ")}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
{p.group === "kleding"
  ? "Kleding"
  : p.id.startsWith("normal-")
  ? "Formaat: 85×55mm"
  : p.id.startsWith("xxl-")
  ? "Formaat: A6 (105×148mm)"
  : p.id === "a4-stickers"
  ? "Formaat: A4 (210×297mm)"
  : p.group === "accessoires"
  ? "Accessoire"
  : "-"}

{p.group !== "kleding" && " · Vinyl · UV- & waterbestendig"}
                    </p>

                    {/* Variant selector */}
                    <div className="mt-3 flex items-center gap-2">
                      <label
                        htmlFor={`variant-${p.id}`}
                        className="text-sm text-neutral-700"
                      >
                        Kies aantal:
                      </label>
                      <select
                        id={`variant-${p.id}`}
                        className="rounded-xl border px-3 py-1.5 text-sm"
                        value={variantId}
                        onChange={(e) => changeVariant(p.id, e.target.value)}
                        disabled={isSoldOut}
                      >
                        {p.variants.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {p.variantNote && (
                      <p className="mt-2 text-xs text-neutral-500">
                        {p.variantNote}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-extrabold tracking-tight">
                        {formatPrice(price)}
                      </span>
                      <button
                        onClick={() => !isSoldOut && addToCart(p.id)}
                        disabled={isSoldOut}
                        className={`rounded-2xl border px-3 py-1.5 text-sm font-semibold hover:shadow transition ${
                          isSoldOut
                            ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                            : "bg-[#f2f8f6] hover:bg-white"
                        }`}
                      >
                        {isSoldOut ? "Uitverkocht" : "Voeg toe"}
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
              Verzendkosten: <strong>€5,50</strong> standaard. <br />
              <em>Uitzondering:</em> bestellingen die uitsluitend bestaan uit{" "}
              <strong>25 stuks</strong> (Normaal) of{" "}
              <strong>10 stuks</strong> (XXL A6) verzenden voor{" "}
              <strong>€4,50</strong>.
            </p>
          </div>
          <div className="rounded-3xl border p-6 shadow-sm">
            <h3 className="font-extrabold text-lg">Betalen</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Betaling stemmen we na bestelling af via{" "}
              <strong>WhatsApp</strong> (we sturen direct een betaalverzoek,
              bijv. Tikkie).
            </p>
          </div>
          <div className="rounded-3xl border p-6 shadow-sm">
            <h3 className="font-extrabold text-lg">Kwaliteit</h3>
            <p className="mt-2 text-sm text-neutral-700">
              Polymeer Vinyl, Uv-Waterbestendigd, Krasvast. Voor een Hagenees door een Hagenees !
            </p>
          </div>
        </div>
      </section>

      {/* Contact + Instagram/TikTok + reviews + community */}
      <footer id="contact" className="bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-black">Contact</h3>
            <p className="mt-2 text-white/80">
              Heb je een vraag of wil je samenwerken? Stuur een bericht!
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 shadow-sm hover:shadow transition bg-white/10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M34.8 14.6c-3.2-1.7-5.4-4.5-6.2-8.2h-6.1v24.8c-.1 2.4-2.1 4.3-4.5 4.3-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c.6 0 1.1.1 1.6.3V20c-7.1-1.1-13.6 4.5-13.6 11.7 0 6.4 5.2 11.6 11.6 11.6 6.3 0 11.5-5.1 11.6-11.4V19.3c2.3 1.9 5.2 3.1 8.4 3.1v-7.8c-.9 0-1.8-.1-2.7-.4z"
                  />
                </svg>
                TikTok
              </a>
            </div>

            <form
  onSubmit={(e) => {
    e.preventDefault();
    sendContact();
  }}
  className="mt-4 grid gap-3"
>
<input
  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
  placeholder="E-mail"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<textarea
  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400"
  placeholder="Bericht"
  rows={4}
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
<button
  type="submit"
  onClick={() => {
    console.log("BUTTON GEKLIKT");
    sendContact();
  }}
  className="rounded-2xl bg-[#f2c200] px-5 py-2.5 font-bold text-neutral-900"
>
  Versturen
</button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-black">Over 070_stickershop</h3>
            <p className="mt-2 text-white/80">
              Hoogwaardige vinyl stickers in groen-geel, ontworpen voor
              buitengebruik. UV- en waterbestendig, snel geleverd vanuit Den
              Haag. Vragen of maatwerk? Stuur ons gerust een bericht.
            </p>
            <ul className="mt-3 text-white/70 text-sm list-disc list-inside space-y-1">
              <li>Vinyl met outdoor-laminaat</li>
              <li>Scherpe prijzen & staffelkorting</li>
              <li>Snelle verzending binnen Nederland</li>
            </ul>
            <div className="mt-4 text-sm text-white/60">
              © {new Date().getFullYear()} 070_stickershop – Alle rechten
              voorbehouden
            </div>
          </div>
        </div>

        {/* ---------------------------------- Reviews Sectie ---------------------------------- */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-[#008C45]">
              Tevreden Klanten 💬
            </h2>
            <p className="text-neutral-700 mt-1">
              Gemiddeld{" "}
              <span className="font-bold text-[#FFD700]">4.8 / 5.0</span>{" "}
              gebaseerd op echte bestellingen
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Review 1 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/kevin.jpg"
                  alt="Kevin"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Kevin</p>
                  <p className="text-sm text-neutral-500">Kevin | Den Haag</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Topkwaliteit stickers, snel geleverd en goeie service. Echte
                klasse!”
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/Szymon.jpg"
                  alt="Szymon"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Szymon</p>
                  <p className="text-sm text-neutral-500">Szymon | Warschau</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Thank you very much friends from The Hague for this amazing
                stickers!”
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/daan.jpg"
                  alt="Daan"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Daan</p>
                  <p className="text-sm text-neutral-500">Daan | Ypenburg</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Helemaal top, Voorheen altijd via instagram maar de site werkt
                top!”
              </p>
            </div>

            {/* Review 4 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/linda.jpg"
                  alt="Linda"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Linda</p>
                  <p className="text-sm text-neutral-500">
                    Linda | Leidschendam
                  </p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Snelle levering, netjes verpakt. Mijn jongens vonden ze
                geweldig!”
              </p>
            </div>

            {/* Review 5 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/delano.jpg"
                  alt="Delano"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Delano</p>
                  <p className="text-sm text-neutral-500">Delano | Nootdorp</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Een van de weinige met kwaliteit stickers. Toppah!”
              </p>
            </div>

            {/* Review 6 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/linda.jpg"
                  alt="Linda"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Mike</p>
                  <p className="text-sm text-neutral-500">Mike | Den Haag</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Zeer tevreden met deze stickers!”
              </p>
            </div>
          </div>
        </section>

        {/* Review 7 */}
            <div className="bg-white border border-black/5 shadow-md rounded-2xl p-5 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/img/reviews/malgorzata.jpg"
                  alt="Delano"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">Malgorzata</p>
                  <p className="text-sm text-neutral-500">Malgorzata | Warschau</p>
                </div>
              </div>
              <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
              <p className="text-neutral-700 italic">
                “Very good quality and the material of the flag is really nice, i will definitely buy more in the future. greets from poland!”
              </p>
            </div>

        {/* ---------------------------------- Community Foto's ---------------------------------- */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-[#008C45]">
              Onze stickers 📸
            </h2>
            <p className="text-neutral-700">
              Jullie stickers gespot in de stad of ergens anders ? — stuur je
              foto via Instagram!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition">
              <img
                src="/img/reviews/foto1.jpg"
                alt="Gespot in amerika"
                className="w-full h-48 object-cover object-center"
              />
            </div>
            
            <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition">
              <img
                src="/img/reviews/foto2.jpg"
                alt="everywhere we go!"
                className="w-full h-48 object-cover object-center"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition">
              <img
                src="/img/reviews/foto3.jpg"
                alt="onze tape rollen in actie"
                className="w-full h-48 object-cover object-center"
              />
            </div>
            
            <div className="overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition">
              <img
                src="/img/reviews/foto4.jpg"
                alt="gespot in warschau"
                className="w-full h-48 object-cover object-center"
              />
            </div>
          </div>

          <div className="text-center mt-6">
            <a
              href="https://www.instagram.com/070_stickershop/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#008C45] hover:bg-[#00783C] text-white px-5 py-2.5 font-semibold shadow-md transition"
            >
              📲 Deel jouw foto op Instagram
            </a>
          </div>
        </section>
      </footer>

      {/* Cart Drawer (z-index boven toast) */}
      {openCart && (
        <div className="fixed inset-0 z-[80]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenCart(false)}
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-extrabold">Winkelwagen</h3>
              <button
                onClick={() => setOpenCart(false)}
                className="rounded-xl border px-2 py-1 text-sm"
              >
                Sluiten
              </button>
            </div>

            {/* items */}
            <div className="mt-4 flex-1 overflow-auto divide-y">
              {cart.length === 0 && (
                <p className="text-sm text-neutral-600">
                  Nog geen items. Voeg iets toe uit de collectie.
                </p>
              )}
              {cart.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="py-3 flex items-center gap-3"
                >
                  <img
                    src={item.img}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover object-center"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-neutral-600">
                      {item.variantLabel} – {formatPrice(item.price)}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Aantal in wagen: {item.qty}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      removeFromCart(item.productId, item.variantId)
                    }
                    className="text-sm rounded-xl border px-2 py-1"
                  >
                    Verwijder
                  </button>
                </div>
              ))}

            </div>

            {/* totals + checkout */}
            {cart.length > 0 && upsellItems.length > 0 && (
  <div className="mt-4 p-4 border rounded-2xl bg-white">
    
    <h4 className="font-bold mb-2">
      🔰 Maak je bestelling compleet
    </h4>

    <div className="space-y-2">
      {upsellItems.map(product => (
        <label key={product.id} className="flex items-center justify-between text-sm">
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedUpsells.includes(product.id)}
              onChange={() => toggleUpsell(product.id)}
            />
            <img
              src={product.img}
              alt=""
              className="w-10 h-10 rounded object-cover"
            />
            <div>
              <span>{product.title}</span>
              <div className="text-xs text-neutral-500">
                {formatPrice(resolveVariantPrice(product, product.variants[0].id).price)}
              </div>
            </div>
          </div>

        </label>
      ))}
    </div>

    {selectedUpsells.length > 0 && (
      <button
        onClick={addSelectedUpsells}
        className="mt-3 w-full bg-[#0b6e4f] text-white py-2 rounded-xl font-semibold"
      >
        Voeg geselecteerde producten toe
      </button>
    )}

  </div>
)}
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
                onKeyDown={(e) =>
                  e.key === "Enter" ? handleCheckout() : null
                }
                className="relative z-10 mt-3 w-full rounded-2xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white font-semibold px-5 py-2.5 shadow hover:shadow-md transition"
                role="button"
                tabIndex={0}
              >
                Bestelling plaatsen
              </button>

              <p className="mt-2 text-xs text-neutral-500">
                Alle prijzen excl. verzendkosten. Verzendkosten worden
                automatisch berekend op basis van je keuze.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Add-to-cart toast (niet tonen als cart open is) */}
      {toast.open && !openCart && (
        <div
          className={`pointer-events-none fixed inset-x-0 bottom-4 z-[40] flex justify-center transition-all duration-300 ${
            toast.open
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
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
                  {toast.variant ? (
                    <span className="text-neutral-600">
                      {" "}
                      — {toast.variant}
                    </span>
                  ) : null}
                </div>
                <div className="text-xs text-neutral-600">
                  Toegevoegd aan je winkelwagen
                </div>
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
                  onClick={() =>
                    setToast((t) => ({ ...t, open: false }))
                  }
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
                  <div
                    key={`${i.productId}-${i.variantId}`}
                    className="py-2 flex items-center gap-3"
                  >
                    <img
                      src={i.img}
                      alt=""
                      className="h-10 w-10 rounded-lg object-cover object-center border border-black/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{i.title}</div>
                      <div className="text-sm text-neutral-600">
                        {i.variantLabel} × {i.qty}
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatPrice(i.price * i.qty)}
                    </div>
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
                Je gaat in de volgende stap je adres invullen en daarna word je
                doorgestuurd naar WhatsApp.
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
            <label className="block text-sm font-semibold mb-1">
              Naam
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              value={customer.name}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, name: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Straat + huisnummer
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              value={customer.street}
              onChange={(e) =>
                setCustomer((c) => ({ ...c, street: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Postcode + plaats
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-black/10 px-3 py-2"
              value={customer.postalCity}
              onChange={(e) =>
                setCustomer((c) => ({
                  ...c,
                  postalCity: e.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={async () => {
              if (
                !customer.name.trim() ||
                !customer.street.trim() ||
                !customer.postalCity.trim()
              ) {
                alert(
                  "Vul je naam en adres (straat + huisnr, postcode + plaats) in."
                );
                return;
              }

              const orderData = {
                customer_name: customer.name,
                customer_street: customer.street,
                customer_postal_city: customer.postalCity,
                items: cart,
                subtotal,
                shipping,
                discount,
                total,
                status: "nieuw",
              };

              const { error } = await supabase
                .from("orders")
                .insert([orderData]);

              if (error) {
                alert("Fout bij opslaan bestelling.");
                console.error(error);
                return;
              }

              const tekst = buildOrderText();
              const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                tekst
              )}`;

              window.location.href = url;
            }}
            className="flex-1 rounded-2xl bg-[#0b6e4f] hover:bg-[#0a6045] text-white font-semibold px-4 py-2.5 shadow"
          >
            Bestellen via WhatsApp
          </button>

          <button
            onClick={() => {
              setAddressOpen(false);
              setConfirmOpen(true);
            }}
            className="rounded-2xl border px-4 py-2.5"
          >
            Terug
          </button>
        </div>

        <p className="mt-2 text-xs text-neutral-500">
          We sturen je bestelling via WhatsApp door. Je ontvangt daarna
          een betaalverzoek.
        </p>
      </div>
    </div>
  </div>
)}
      {/* /modal stap 2 */}

      {/* Sticky Winkelwagen knop */}
      <button
        onClick={() => setOpenCart(true)}
        className="fixed z-[95] bottom-5 right-5 rounded-full shadow-xl px-5 py-4 flex items-center gap-2"
        style={{
          backgroundColor: "#008C45",
          color: "white",
          border: "3px solid #FFD700",
        }}
        aria-label="Open winkelwagen"
        title="Winkelwagen"
      >
        <span aria-hidden>🛒</span>
        {cart.length > 0 && (
          <span
            className="ml-1 text-sm font-extrabold min-w-6 h-6 rounded-full grid place-items-center"
            style={{
              backgroundColor: "#FFD700",
              color: "#0b6e4f",
              padding: "0 8px",
            }}
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