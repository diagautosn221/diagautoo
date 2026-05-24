import type { Client, Vehicle, CarEvent, Reminder, Vital } from "./types";

export const clients: Client[] = [
  {
    id: "c-001",
    fullName: "Mamadou Diop",
    email: "m.diop@example.sn",
    phone: "+221 77 432 18 90",
    city: "Dakar",
    createdAt: "2023-04-12",
  },
  {
    id: "c-002",
    fullName: "Awa Faye",
    email: "awa.faye@example.sn",
    phone: "+221 76 218 44 12",
    city: "Thiès",
    createdAt: "2023-09-03",
  },
  {
    id: "c-003",
    fullName: "Ibrahima Sarr",
    email: "i.sarr@example.sn",
    phone: "+221 78 901 22 45",
    city: "Dakar",
    createdAt: "2024-01-22",
  },
  {
    id: "c-004",
    fullName: "Fatou Ndiaye",
    email: "fatou.n@example.sn",
    phone: "+221 70 654 09 18",
    city: "Saint-Louis",
    createdAt: "2024-06-18",
  },
];

export const vehicles: Vehicle[] = [
  {
    id: "v-001",
    clientId: "c-001",
    brand: "Mercedes-Benz",
    model: "C220 d",
    year: 2019,
    vin: "WDDWF4KB1KR512004",
    plate: "DK-4582-AA",
    fuel: "diesel",
    mileage: 124800,
    color: "Noir obsidienne",
    photoSeed: "mb-c220",
    healthScore: 78,
  },
  {
    id: "v-002",
    clientId: "c-001",
    brand: "Toyota",
    model: "Hilux 2.4",
    year: 2021,
    vin: "MROFB8CD300456789",
    plate: "DK-9112-AB",
    fuel: "diesel",
    mileage: 67200,
    color: "Blanc nacré",
    photoSeed: "toyota-hilux",
    healthScore: 92,
  },
  {
    id: "v-003",
    clientId: "c-002",
    brand: "BMW",
    model: "320i F30",
    year: 2017,
    vin: "WBA8E5C50HK483921",
    plate: "TH-2284-AB",
    fuel: "essence",
    mileage: 156400,
    color: "Gris minéral",
    photoSeed: "bmw-320",
    healthScore: 64,
  },
  {
    id: "v-004",
    clientId: "c-003",
    brand: "Renault",
    model: "Duster 1.5 dCi",
    year: 2020,
    vin: "VF1HJD20A65432109",
    plate: "DK-7720-AA",
    fuel: "diesel",
    mileage: 89500,
    color: "Beige sable",
    photoSeed: "renault-duster",
    healthScore: 81,
  },
  {
    id: "v-005",
    clientId: "c-004",
    brand: "Hyundai",
    model: "Tucson 2.0",
    year: 2022,
    vin: "KMHJ281ABNU112345",
    plate: "SL-1845-AA",
    fuel: "essence",
    mileage: 32100,
    color: "Bleu nuit",
    photoSeed: "hyundai-tucson",
    healthScore: 95,
  },
];

export const events: CarEvent[] = [
  {
    id: "e-001",
    vehicleId: "v-001",
    date: "2026-04-22",
    type: "diagnostic",
    severity: "medium",
    title: "Code P0420 — efficacité catalyseur",
    description:
      "Lecture OBD-II — efficacité du catalyseur sous le seuil. Remplacement préconisé à court terme.",
    mileage: 124800,
    technician: "Cheikh M.",
    dtcCodes: ["P0420"],
  },
  {
    id: "e-002",
    vehicleId: "v-001",
    date: "2026-02-15",
    type: "vidange",
    severity: "info",
    title: "Vidange + filtre huile",
    description: "Huile 5W30 synthétique. Filtre Mann d'origine.",
    cost: 45000,
    mileage: 121200,
    technician: "Cheikh M.",
    parts: ["Huile 5W30 6L", "Filtre à huile Mann W712/52"],
  },
  {
    id: "e-003",
    vehicleId: "v-001",
    date: "2025-11-04",
    type: "freinage",
    severity: "info",
    title: "Plaquettes avant remplacées",
    description: "Plaquettes Bosch + témoin d'usure. Disques contrôlés OK.",
    cost: 78000,
    mileage: 117800,
    technician: "Modou S.",
    parts: ["Plaquettes avant Bosch BP1234"],
  },
  {
    id: "e-004",
    vehicleId: "v-001",
    date: "2025-08-12",
    type: "controle_technique",
    severity: "info",
    title: "Contrôle technique passé",
    description: "Validé sans contre-visite. Prochain dans 2 ans.",
    mileage: 113200,
  },
  {
    id: "e-005",
    vehicleId: "v-002",
    date: "2026-03-30",
    type: "vidange",
    severity: "info",
    title: "Vidange routine",
    description: "Huile + filtre. RAS.",
    cost: 38000,
    mileage: 65800,
    technician: "Cheikh M.",
    parts: ["Huile 10W40 5L", "Filtre Toyota d'origine"],
  },
  {
    id: "e-006",
    vehicleId: "v-003",
    date: "2026-04-29",
    type: "panne",
    severity: "high",
    title: "Bobine d'allumage cylindre 3 HS",
    description:
      "Code P0303 raté d'allumage cylindre 3. Bobine remplacée + bougies. Test routier OK.",
    cost: 95000,
    mileage: 156400,
    technician: "Modou S.",
    parts: ["Bobine d'allumage Bosch", "4× bougies NGK"],
    dtcCodes: ["P0303", "P0301"],
  },
  {
    id: "e-007",
    vehicleId: "v-003",
    date: "2026-01-18",
    type: "intervention",
    severity: "medium",
    title: "Distribution kit + pompe à eau",
    description:
      "Préventif à 150 000 km. Kit Gates + pompe Hepu. Tension parfaite après rodage.",
    cost: 285000,
    mileage: 152100,
    technician: "Cheikh M.",
    parts: ["Kit distribution Gates", "Pompe à eau Hepu"],
  },
  {
    id: "e-008",
    vehicleId: "v-004",
    date: "2026-04-05",
    type: "pneus",
    severity: "info",
    title: "4 pneus neufs Michelin Latitude",
    description: "Géométrie réglée. Pression contrôlée.",
    cost: 320000,
    mileage: 89000,
    technician: "Modou S.",
    parts: ["4× Michelin Latitude Tour 215/65 R16"],
  },
  {
    id: "e-009",
    vehicleId: "v-005",
    date: "2026-03-12",
    type: "vidange",
    severity: "info",
    title: "Première vidange constructeur",
    description: "Selon préconisations Hyundai. Huile + filtre + contrôle visuel.",
    cost: 52000,
    mileage: 30000,
    technician: "Cheikh M.",
  },
  {
    id: "e-010",
    vehicleId: "v-001",
    date: "2026-05-02",
    type: "rdv",
    severity: "low",
    title: "RDV diagnostic complémentaire",
    description: "Confirmation P0420 et devis remplacement catalyseur.",
    mileage: 124800,
  },
];

export const reminders: Reminder[] = [
  {
    id: "r-001",
    vehicleId: "v-001",
    due: "2026-05-15",
    type: "diagnostic",
    label: "Confirmer remplacement catalyseur",
  },
  {
    id: "r-002",
    vehicleId: "v-001",
    due: "2026-08-15",
    type: "vidange",
    label: "Vidange à 130 000 km",
  },
  {
    id: "r-003",
    vehicleId: "v-002",
    due: "2026-09-30",
    type: "vidange",
    label: "Vidange + filtres",
  },
  {
    id: "r-004",
    vehicleId: "v-003",
    due: "2026-06-04",
    type: "controle_technique",
    label: "Contrôle technique",
  },
  {
    id: "r-005",
    vehicleId: "v-005",
    due: "2026-09-12",
    type: "vidange",
    label: "Deuxième vidange",
  },
];

export function vitalsForVehicle(vehicle: Vehicle): Vital[] {
  const base: Vital[] = [
    {
      key: "battery",
      label: "Batterie",
      value: vehicle.healthScore > 80 ? "12.6" : "12.1",
      unit: "V",
      status: vehicle.healthScore > 75 ? "ok" : "warn",
      trend: "stable",
    },
    {
      key: "oil",
      label: "Niveau huile",
      value: vehicle.healthScore > 70 ? "92" : "68",
      unit: "%",
      status: vehicle.healthScore > 75 ? "ok" : "warn",
      trend: "down",
    },
    {
      key: "brake",
      label: "Plaquettes",
      value: vehicle.healthScore > 80 ? "78" : "42",
      unit: "%",
      status: vehicle.healthScore > 75 ? "ok" : "warn",
      trend: "down",
    },
    {
      key: "tire",
      label: "Pression pneus",
      value: "2.3",
      unit: "bar",
      status: "ok",
      trend: "stable",
    },
    {
      key: "coolant",
      label: "Liquide refroid.",
      value: vehicle.healthScore > 70 ? "89" : "55",
      unit: "%",
      status: vehicle.healthScore > 70 ? "ok" : "warn",
      trend: "stable",
    },
    {
      key: "engine",
      label: "Voyant moteur",
      value: vehicle.healthScore < 70 ? "ON" : "OFF",
      unit: "",
      status: vehicle.healthScore < 70 ? "alert" : "ok",
      trend: "stable",
    },
  ];
  return base;
}

export function getClientById(id: string) {
  return clients.find((c) => c.id === id);
}

export function getVehicleById(id: string) {
  return vehicles.find((v) => v.id === id);
}

export function getVehiclesByClient(clientId: string) {
  return vehicles.filter((v) => v.clientId === clientId);
}

export function getEventsByVehicle(vehicleId: string) {
  return events
    .filter((e) => e.vehicleId === vehicleId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getRemindersByVehicle(vehicleId: string) {
  return reminders
    .filter((r) => r.vehicleId === vehicleId)
    .sort((a, b) => a.due.localeCompare(b.due));
}

export function getActiveAlerts() {
  return events.filter(
    (e) => e.severity === "high" || e.severity === "critical" || e.severity === "medium"
  );
}
