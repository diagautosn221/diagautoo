export type VehicleAiPayload = {
  notes?: string;
  fileName?: string;
  plate?: string;
  vin?: string;
  mileage?: number;
};

export type VehicleAiRiskLevel = "faible" | "surveillance" | "urgent";

export type VehicleAiResult = {
  likelyVehicle: string;
  confidence: number;
  riskLevel: VehicleAiRiskLevel;
  extractedPlate?: string;
  vinStatus: "absent" | "format a verifier" | "format plausible";
  observations: string[];
  checklist: string[];
  recommendedNextStep: string;
  serviceTags: string[];
  disclaimer: string;
};

type BrandSignal = {
  label: string;
  keywords: string[];
  baseConfidence: number;
};

const brandSignals: BrandSignal[] = [
  { label: "Toyota Prado / Land Cruiser", keywords: ["toyota", "prado", "land cruiser", "landcruiser"], baseConfidence: 74 },
  { label: "Mercedes-Benz Classe C", keywords: ["mercedes", "benz", "c220", "c 220", "classe c"], baseConfidence: 72 },
  { label: "BMW Serie 3", keywords: ["bmw", "320", "serie 3", "f30", "e90"], baseConfidence: 70 },
  { label: "Hyundai Tucson", keywords: ["hyundai", "tucson"], baseConfidence: 69 },
  { label: "Kia Sportage", keywords: ["kia", "sportage"], baseConfidence: 69 },
  { label: "Peugeot SUV / Berline", keywords: ["peugeot", "3008", "308", "508"], baseConfidence: 66 },
  { label: "Renault SUV / Berline", keywords: ["renault", "koleos", "megane", "clio"], baseConfidence: 64 },
  { label: "Nissan Patrol / Qashqai", keywords: ["nissan", "patrol", "qashqai", "x trail", "x-trail"], baseConfidence: 66 },
  { label: "Ford Ranger / SUV", keywords: ["ford", "ranger", "explorer"], baseConfidence: 64 },
];

const urgentSignals = ["moteur", "fumee", "fume", "chauffe", "surchauffe", "frein", "huile", "pression", "batterie", "accident", "panne", "voyant rouge"];
const watchSignals = ["vidange", "assurance", "visite", "controle technique", "pneu", "pneus", "courroie", "revision", "bruit", "voyant"];

function normalize(value?: string) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function scoreBrand(source: string) {
  let best = { label: "Vehicule a identifier", confidence: 42 };

  for (const signal of brandSignals) {
    const matches = signal.keywords.filter((keyword) => source.includes(keyword)).length;
    if (matches === 0) continue;
    const confidence = Math.min(signal.baseConfidence + matches * 8, 94);
    if (confidence > best.confidence) best = { label: signal.label, confidence };
  }

  return best;
}

function extractPlate(source: string, explicitPlate?: string) {
  const explicit = explicitPlate?.trim();
  if (explicit) return explicit.toUpperCase();

  const match = source.toUpperCase().match(/[A-Z]{1,3}\s?\d{2,5}\s?[A-Z]{1,3}/);
  return match?.[0]?.replace(/\s+/g, " ").trim();
}

function getVinStatus(vin?: string): VehicleAiResult["vinStatus"] {
  const cleaned = (vin || "").trim().toUpperCase();
  if (!cleaned) return "absent";
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(cleaned) ? "format plausible" : "format a verifier";
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

export function analyzeVehicleEvidence(payload: VehicleAiPayload): VehicleAiResult {
  const source = normalize([payload.notes, payload.fileName, payload.plate, payload.vin].filter(Boolean).join(" "));
  const brand = scoreBrand(source);
  const urgentHits = urgentSignals.filter((signal) => source.includes(signal));
  const watchHits = watchSignals.filter((signal) => source.includes(signal));
  const plate = extractPlate(source, payload.plate);
  const vinStatus = getVinStatus(payload.vin);
  const mileage = Number.isFinite(payload.mileage) ? Number(payload.mileage) : undefined;

  let confidence = brand.confidence;
  if (plate) confidence += 5;
  if (vinStatus === "format plausible") confidence += 8;
  if (payload.fileName) confidence += 3;
  confidence = Math.min(confidence, 96);

  const riskLevel: VehicleAiRiskLevel = urgentHits.length > 0 ? "urgent" : watchHits.length > 0 ? "surveillance" : "faible";
  const observations: string[] = [];

  if (brand.label !== "Vehicule a identifier") {
    observations.push(`Hypothese principale : ${brand.label}.`);
  } else {
    observations.push("Marque et modele non confirmes : ajouter une photo de face, de profil et de l'arriere.");
  }

  if (plate) observations.push(`Plaque detectee ou saisie : ${plate}.`);
  if (vinStatus === "format plausible") observations.push("VIN au format 17 caracteres plausible.");
  if (vinStatus === "format a verifier") observations.push("VIN incomplet ou au format inhabituel : verifier la carte grise.");
  if (mileage !== undefined && mileage > 0) observations.push(`Kilometrage declare : ${mileage.toLocaleString("fr-FR")} km.`);
  if (urgentHits.length > 0) observations.push(`Signaux critiques detectes : ${urgentHits.join(", ")}.`);
  if (watchHits.length > 0) observations.push(`Points administratifs ou entretien a surveiller : ${watchHits.join(", ")}.`);

  const checklist = unique([
    "Comparer la photo avec la carte grise et la plaque.",
    "Scanner le VIN sur chassis ou pare-brise avant creation du dossier.",
    "Lancer une lecture du boitier si un voyant, une fumee ou une chauffe est mentionnee.",
    ...(source.includes("vidange") ? ["Verifier le dernier kilometrage de vidange et le filtre a huile."] : []),
    ...(source.includes("assurance") ? ["Controler la date d'assurance et joindre le document au carnet client."] : []),
    ...(source.includes("visite") || source.includes("controle technique")
      ? ["Controler la date de visite technique et programmer un rappel avant expiration."]
      : []),
  ]);

  const serviceTags = unique([
    riskLevel === "urgent" ? "Diagnostic prioritaire" : "Pre-identification",
    ...(urgentHits.includes("frein") ? ["Freinage"] : []),
    ...(urgentHits.includes("huile") || urgentHits.includes("pression") ? ["Lubrification"] : []),
    ...(urgentHits.includes("batterie") ? ["Electricite"] : []),
    ...(watchHits.includes("vidange") ? ["Vidange"] : []),
    ...(watchHits.includes("assurance") ? ["Assurance"] : []),
    ...(watchHits.includes("visite") || watchHits.includes("controle technique") ? ["Visite technique"] : []),
  ]);

  const recommendedNextStep =
    riskLevel === "urgent"
      ? "Bloquer le vehicule en reception rapide, ouvrir un diagnostic atelier et demander une lecture du boitier."
      : riskLevel === "surveillance"
        ? "Creer le dossier client, verifier les dates et programmer les rappels avant echeance."
        : "Completer les photos, confirmer le VIN puis rattacher le vehicule au compte client.";

  return {
    likelyVehicle: brand.label,
    confidence,
    riskLevel,
    extractedPlate: plate,
    vinStatus,
    observations,
    checklist,
    recommendedNextStep,
    serviceTags,
    disclaimer: "Aide a l'identification et au tri atelier. La decision finale reste basee sur la carte grise, le VIN et le diagnostic mecanique.",
  };
}
