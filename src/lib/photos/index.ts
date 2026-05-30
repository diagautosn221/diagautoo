/**
 * Real-photo registry for DiagAutoSN.
 *
 * Principle: no SVG illustrations of cars or equipment. Every visual that
 * represents a real-world object resolves to a real photograph. URLs are
 * curated, stable CDN endpoints (Unsplash / Pexels). Sized via query
 * params so a single source serves multiple aspect ratios.
 *
 * When the team has its own shots (in-atelier, branded), swap the URL —
 * the API stays the same.
 */

export type PhotoSize =
  | "thumb"   // ~400px wide
  | "card"   // ~800px wide
  | "hero"   // ~1600px wide
  | "full";  // ~2400px wide

const SIZE_WIDTH: Record<PhotoSize, number> = {
  thumb: 400,
  card: 800,
  hero: 1600,
  full: 2400,
};

/** Photographer-friendly Unsplash photo id → sized URL helper. */
function unsplash(id: string, size: PhotoSize = "card", aspectRatio?: string) {
  const w = SIZE_WIDTH[size];
  const ar = aspectRatio ? `&ar=${aspectRatio}` : "";
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}${ar}`;
}

/** Pexels-hosted photo. */
function pexels(id: number, size: PhotoSize = "card") {
  const w = SIZE_WIDTH[size];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
}

/* ────────────────────────────────────────────────────────────────────────
 * CARS — by brand. Each entry returns a 16:9 friendly photo of the brand.
 * Falls back to a generic premium SUV shot when the brand is unknown.
 * ──────────────────────────────────────────────────────────────────── */

const CAR_BY_BRAND: Record<string, string> = {
  // Toyota — Land Cruiser silhouette, beige sand vibe
  toyota: "1583121274602-3e2820c69888",
  // Mercedes — black C-class executive
  mercedes: "1618843479313-40f8afb4b4d8",
  "mercedes-benz": "1618843479313-40f8afb4b4d8",
  // BMW — 3-series grey
  bmw: "1555215695-3004980ad54e",
  // Hyundai — Tucson dark blue
  hyundai: "1606664515524-ed2f786a0bd6",
  // Renault — Duster compact SUV beige
  renault: "1502877338535-766e1452684a",
  // Peugeot
  peugeot: "1583121274602-3e2820c69888",
  // Nissan
  nissan: "1494976388531-d1058494cdd8",
  // Kia
  kia: "1605559424843-9e4c228bf1c2",
  // Audi
  audi: "1542362567-b07e54358753",
  // Land Rover
  "land rover": "1606664515524-ed2f786a0bd6",
  // VW
  volkswagen: "1502877338535-766e1452684a",
  vw: "1502877338535-766e1452684a",
  // Ford
  ford: "1494976388531-d1058494cdd8",
  // Tesla
  tesla: "1560958089-b8a1929cea89",
};

const CAR_GENERIC = "1492144534655-ae79c964c9d7"; // dark luxury sedan

export function getCarPhoto(brand?: string, _model?: string, size: PhotoSize = "card") {
  void _model;
  const key = (brand ?? "").trim().toLowerCase();
  const id = CAR_BY_BRAND[key] ?? CAR_GENERIC;
  return unsplash(id, size);
}

/* ────────────────────────────────────────────────────────────────────────
 * DIAGNOSTIC EQUIPMENT — by SKU family. Generic OBD / scanner photos that
 * read as professional automotive diagnostic tools.
 * ──────────────────────────────────────────────────────────────────── */

const EQUIPMENT: Record<string, string> = {
  "elm327":      "1486754735734-325b5831c3ad", // bluetooth OBD dongle
  "obd-mini":    "1581094288338-2314dddb7ece", // mini wifi
  "bmw-enet":    "1599256872237-5dcc0fbe9668", // cable connector
  "autocom":     "1486262715619-67b85e0b08d3", // diagnostic case
  "delphi":      "1486262715619-67b85e0b08d3",
  "mb-star":     "1581094288338-2314dddb7ece", // tablet style
  "launch-x431": "1554224155-1696413565d3",     // pro tablet
  "autel":       "1554224155-1696413565d3",
  "thinkcar":    "1581094288338-2314dddb7ece",
  generic:       "1486754735734-325b5831c3ad",
};

export function getEquipmentPhoto(key?: string, size: PhotoSize = "card") {
  const k = (key ?? "generic").trim().toLowerCase();
  const id = EQUIPMENT[k] ?? EQUIPMENT.generic ?? "1486754735734-325b5831c3ad";
  return unsplash(id, size);
}

/* ────────────────────────────────────────────────────────────────────────
 * WORKSHOP / ATELIER — humans, hands, garages, real action.
 * ──────────────────────────────────────────────────────────────────── */

const WORKSHOP: Record<string, string> = {
  hero:        "1487754180451-c456f719a1fc", // mechanic with car, dramatic
  diagnostic:  "1632823469850-2f77dd9c7f93", // hands plugging OBD
  service:     "1486262715619-67b85e0b08d3", // tool kit
  training:    "1494522358652-f30e61a60313", // group around hood
  bay:         "1492144534655-ae79c964c9d7", // garage bay
  hands:       "1599256872237-5dcc0fbe9668", // mechanic hands
  install:     "1581094288338-2314dddb7ece", // tablet install
  team:        "1581094288338-2314dddb7ece",
};

export function getWorkshopPhoto(scene: keyof typeof WORKSHOP, size: PhotoSize = "card") {
  const id = WORKSHOP[scene] ?? WORKSHOP.hero ?? "1487754180451-c456f719a1fc";
  return unsplash(id, size);
}

/* ────────────────────────────────────────────────────────────────────────
 * PEXELS bridge for photos that already work better there (some action
 * shots, garage scenes, full-bleed marketing heroes).
 * ──────────────────────────────────────────────────────────────────── */

export const PEXELS = {
  garageHero: pexels(1402787, "hero"),
  obdScan: pexels(3807277, "card"),
  carInterior: pexels(3729464, "card"),
  redSuv: pexels(4639907, "card"),
  whiteSuv: pexels(116675, "card"),
  toolboard: pexels(31154207, "card"),
};
