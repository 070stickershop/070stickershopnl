/* ------------------------------ PRODUCTDATA ------------------------------ */

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

  /* ---------------- Accessoires ---------------- */
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

/* ------------------------------ EXPORT ------------------------------ */
export default PRODUCTS;
