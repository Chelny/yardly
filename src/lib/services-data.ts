import { LucideIcon } from "lucide-react-native";

export type Season = "winter" | "spring" | "summer" | "fall";
export type SeasonFilter = Season | "all";
export type PriceUnit = "season" | "visit" | "one-time";

export interface SeasonFilterOption {
  id: SeasonFilter;
  label: string;
  icon: LucideIcon | null;
}

export interface SaleWindow {
  opensAt: string;
  closesAt: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  unit: PriceUnit;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  logoInitial: string;
  logoColor: string;
  rating: number;
  reviewCount: number;
  phone: string;
  email: string;
  website?: string;
  languages: string[];
  serviceAreas: string[];
  description: string;
  reviews: Review[];
}

export interface Offer {
  id: string;
  providerId: string;
  distanceKm: number;
  price: number;
  priceUnit: PriceUnit;
  seasonCap?: number;
  used?: number;
  summary: string;
  saleWindow: SaleWindow;
  addOns: AddOn[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  seasons: Season[];
  icon: "snow" | "leaf" | "hedge" | "gutter" | "pool" | "leaf-blow";
  offers: Offer[];
}

export const PROVIDERS: Provider[] = [
  {
    id: "snow-pros",
    name: "Snow Pros Inc.",
    logoInitial: "S",
    logoColor: "#0ea5e9",
    rating: 4.8,
    reviewCount: 142,
    phone: "+1 514-555-0142",
    email: "hello@snowpros.example",
    website: "https://snowpros.example",
    languages: ["English", "Français"],
    serviceAreas: ["Montréal", "Laval", "Longueuil", "H2X", "H3Z", "H4A"],
    description:
      "Family-run snow removal crew serving the Island of Montreal since 2008. Licensed, insured, and equipped with GPS-tracked plows.",
    reviews: [
      {
        id: "r1",
        author: "Marie L.",
        rating: 5,
        comment: "Showed up before 7am after the storm. Driveway was spotless.",
        date: "2026-02-14",
      },
      {
        id: "r2",
        author: "David K.",
        rating: 4,
        comment: "Reliable, but the walkway add-on is pricey.",
        date: "2026-01-28",
      },
    ],
  },
  {
    id: "mtl-plow",
    name: "MTL Plow Co.",
    logoInitial: "M",
    logoColor: "#16a34a",
    rating: 4.5,
    reviewCount: 89,
    phone: "+1 514-555-0187",
    email: "info@mtlplow.example",
    languages: ["Français", "English"],
    serviceAreas: ["Montréal", "Westmount", "Outremont", "H2V", "H2W"],
    description:
      "Bundle-first snow removal: driveway and walkway included in every plan. Salt available on icy days.",
    reviews: [
      {
        id: "r3",
        author: "Sophie B.",
        rating: 5,
        comment: "The bundle is worth it — no surprise fees for the walkway.",
        date: "2026-02-02",
      },
    ],
  },
  {
    id: "green-thumb",
    name: "Green Thumb Landscaping",
    logoInitial: "G",
    logoColor: "#22c55e",
    rating: 4.9,
    reviewCount: 214,
    phone: "+1 514-555-0110",
    email: "team@greenthumb.example",
    website: "https://greenthumb.example",
    languages: ["English", "Français", "Español"],
    serviceAreas: ["Montréal", "Brossard", "Saint-Lambert", "H4G", "J4W"],
    description:
      "Full-service landscaping: lawn, hedges, pool, and seasonal cleanup. Certified horticulturists on staff.",
    reviews: [
      {
        id: "r4",
        author: "Alex T.",
        rating: 5,
        comment:
          "They transformed our backyard. Highly recommend the hedge trim.",
        date: "2026-06-10",
      },
    ],
  },
  {
    id: "yard-masters",
    name: "Yard Masters",
    logoInitial: "Y",
    logoColor: "#d97706",
    rating: 4.6,
    reviewCount: 67,
    phone: "+1 514-555-0164",
    email: "contact@yardmasters.example",
    languages: ["English"],
    serviceAreas: ["Montréal", "Pointe-Claire", "Dollard-des-Ormeaux", "H9R"],
    description:
      "Lawn care and leaf removal specialists. Weekly or bi-weekly visits, clippings bagged and removed.",
    reviews: [],
  },
  {
    id: "roof-and-gutter",
    name: "Roof & Gutter Experts",
    logoInitial: "R",
    logoColor: "#475569",
    rating: 4.7,
    reviewCount: 53,
    phone: "+1 514-555-0199",
    email: "service@roofgutter.example",
    languages: ["English", "Français"],
    serviceAreas: ["Montréal", "Laval", "Terrebonne", "H7A"],
    description:
      "Gutter cleaning and roof debris checks. Before-and-after photos sent after every visit.",
    reviews: [],
  },
  {
    id: "aqua-clear",
    name: "Aqua Clear Pools",
    logoInitial: "A",
    logoColor: "#06b6d4",
    rating: 4.8,
    reviewCount: 128,
    phone: "+1 514-555-0155",
    email: "hello@aquaclear.example",
    languages: ["English", "Français"],
    serviceAreas: ["Montréal", "Laval", "Montérégie", "H7W", "J4Y"],
    description:
      "Pool opening, weekly cleaning, and closing. Water chemistry tested and balanced on every visit.",
    reviews: [
      {
        id: "r5",
        author: "Nadia R.",
        rating: 5,
        comment: "Crystal clear water all summer. Worth every dollar.",
        date: "2026-08-20",
      },
    ],
  },
];

export const SERVICES: Service[] = [
  {
    id: "snow-removal",
    name: "Snow removal",
    description:
      "Driveway, walkway, steps, and porch. Choose the coverage that fits your property.",
    seasons: ["winter"],
    icon: "snow",
    offers: [
      {
        id: "snow-pros-flex",
        providerId: "snow-pros",
        distanceKm: 3.2,
        price: 360,
        priceUnit: "season",
        seasonCap: 8,
        used: 3,
        summary:
          "8 driveway visits included. Add walkway or salt when you need it.",
        saleWindow: { opensAt: "2026-09-01", closesAt: "2026-11-15" },
        addOns: [
          {
            id: "walkway",
            name: "Walkway & steps",
            price: 160,
            unit: "season",
          },
          { id: "salt", name: "Salt / de-icer", price: 15, unit: "one-time" },
        ],
      },
      {
        id: "mtl-plow-bundle",
        providerId: "mtl-plow",
        distanceKm: 4.5,
        price: 520,
        priceUnit: "season",
        seasonCap: 8,
        used: 3,
        summary:
          "Driveway + walkway bundled for the season. Salt available on icy days.",
        saleWindow: { opensAt: "2026-09-01", closesAt: "2026-11-15" },
        addOns: [
          { id: "salt", name: "Salt / de-icer", price: 10, unit: "one-time" },
        ],
      },
    ],
  },
  {
    id: "lawn-mowing",
    name: "Lawn mowing",
    description:
      "Weekly or bi-weekly cut, edge, and blow through the growing season.",
    seasons: ["spring", "summer", "fall"],
    icon: "leaf",
    offers: [
      {
        id: "green-thumb-mow",
        providerId: "green-thumb",
        distanceKm: 2.1,
        price: 480,
        priceUnit: "season",
        seasonCap: 12,
        used: 6,
        summary: "12 visits included. Weekly or bi-weekly cut, edge, and blow.",
        saleWindow: { opensAt: "2026-03-15", closesAt: "2026-05-31" },
        addOns: [],
      },
      {
        id: "yard-masters-mow",
        providerId: "yard-masters",
        distanceKm: 3.8,
        price: 540,
        priceUnit: "season",
        seasonCap: 12,
        used: 6,
        summary: "12 visits included. Cut, edge, blow, and bag clippings.",
        saleWindow: { opensAt: "2026-03-15", closesAt: "2026-05-31" },
        addOns: [],
      },
    ],
  },
  {
    id: "hedge-trimming",
    name: "Hedge trimming",
    description: "Shaping and cleanup for hedges up to 6 ft, twice per season.",
    seasons: ["spring", "summer"],
    icon: "hedge",
    offers: [
      {
        id: "green-thumb-hedge",
        providerId: "green-thumb",
        distanceKm: 2.5,
        price: 80,
        priceUnit: "visit",
        summary:
          "Shape, trim, and haul away clippings. Recommended twice per season.",
        saleWindow: { opensAt: "2026-04-01", closesAt: "2026-08-31" },
        addOns: [],
      },
    ],
  },
  {
    id: "gutter-cleaning",
    name: "Gutter cleaning",
    description:
      "Debris removal and downspout flush, recommended twice a year.",
    seasons: ["spring", "fall"],
    icon: "gutter",
    offers: [
      {
        id: "mtl-plow-gutter",
        providerId: "mtl-plow",
        distanceKm: 4.5,
        price: 120,
        priceUnit: "visit",
        summary: "Full gutter and downspout flush.",
        saleWindow: { opensAt: "2026-03-01", closesAt: "2026-11-30" },
        addOns: [],
      },
      {
        id: "roof-gutter-gutter",
        providerId: "roof-and-gutter",
        distanceKm: 5.1,
        price: 135,
        priceUnit: "visit",
        summary: "Gutter flush plus roof debris check.",
        saleWindow: { opensAt: "2026-03-01", closesAt: "2026-11-30" },
        addOns: [],
      },
    ],
  },
  {
    id: "pool-cleaning",
    name: "Pool cleaning",
    description:
      "Skim, vacuum, and balance water chemistry from opening to closing.",
    seasons: ["spring", "summer", "fall"],
    icon: "pool",
    offers: [
      {
        id: "aqua-clear-pool",
        providerId: "aqua-clear",
        distanceKm: 4.0,
        price: 900,
        priceUnit: "season",
        seasonCap: 10,
        used: 2,
        summary: "10 visits included. Skim, vacuum, and chemical balance.",
        saleWindow: { opensAt: "2026-04-01", closesAt: "2026-06-30" },
        addOns: [],
      },
      {
        id: "green-thumb-pool",
        providerId: "green-thumb",
        distanceKm: 4.2,
        price: 950,
        priceUnit: "season",
        seasonCap: 10,
        used: 2,
        summary: "10 visits included. Skim, vacuum, balance, and filter rinse.",
        saleWindow: { opensAt: "2026-04-01", closesAt: "2026-06-30" },
        addOns: [],
      },
    ],
  },
  {
    id: "leaf-blowing",
    name: "Leaf blowing",
    description: "Full-yard leaf removal and bagging.",
    seasons: ["fall"],
    icon: "leaf-blow",
    offers: [],
  },
];

export function findOfferById(
  offerId: string
): { service: Service; offer: Offer } | null {
  for (const service of SERVICES) {
    const offer: Offer | undefined = service.offers.find(
      (offer: Offer) => offer.id === offerId
    );
    if (offer) return { service, offer };
  }
  return null;
}

export function findProviderById(providerId: string): Provider | null {
  return (
    PROVIDERS.find((provider: Provider) => provider.id === providerId) ?? null
  );
}

export function isSaleOpen(
  window: SaleWindow,
  now: Date = new Date()
): boolean {
  const open: Date = new Date(window.opensAt);
  const close: Date = new Date(window.closesAt);
  return now >= open && now <= close;
}

export function formatPriceUnit(unit: PriceUnit): string {
  switch (unit) {
    case "season":
      return "per season";
    case "visit":
      return "per visit";
    case "one-time":
      return "one-time";
  }
}

export function formatSeasons(seasons: Season[]): string {
  return seasons
    .map((season: Season) => season.charAt(0).toUpperCase() + season.slice(1))
    .join(" · ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
