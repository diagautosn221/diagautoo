export type GarageAlertType = "vidange" | "visite_technique" | "assurance" | "diagnostic";
export type GarageAlertSeverity = "ok" | "watch" | "urgent" | "blocked";

export type GarageAlert = {
  id: string;
  type: GarageAlertType;
  label: string;
  vehicle: string;
  client: string;
  due: string;
  severity: GarageAlertSeverity;
  source: string;
};

export type GarageWorkOrder = {
  id: string;
  time: string;
  client: string;
  vehicle: string;
  operation: string;
  status: "recu" | "diagnostic" | "devis" | "intervention" | "livraison";
  amount: number;
};

export type GarageSignal = {
  id: string;
  vehicle: string;
  device: string;
  metric: string;
  value: string;
  status: GarageAlertSeverity;
  updatedAt: string;
};

export const garageAlerts: GarageAlert[] = [
  {
    id: "al-vid-001",
    type: "vidange",
    label: "Vidange a planifier",
    vehicle: "Toyota Prado - DK 4582 AA",
    client: "Awa Diop",
    due: "1 180 km restants",
    severity: "watch",
    source: "kilometrage IoT + carnet atelier",
  },
  {
    id: "al-vt-002",
    type: "visite_technique",
    label: "Visite technique proche",
    vehicle: "Mercedes C220d - DK 9112 AB",
    client: "Mamadou Fall",
    due: "expire dans 17 jours",
    severity: "urgent",
    source: "document vehicule + rappel legal",
  },
  {
    id: "al-ass-003",
    type: "assurance",
    label: "Assurance a renouveler",
    vehicle: "Hyundai Tucson - SL 1845 AA",
    client: "Fatou Ndiaye",
    due: "expire dans 8 jours",
    severity: "urgent",
    source: "contrat client + relance garage",
  },
  {
    id: "al-dtc-004",
    type: "diagnostic",
    label: "Code P0420 actif",
    vehicle: "BMW 320i - TH 2284 AB",
    client: "Ibrahima Sarr",
    due: "atelier recommande",
    severity: "blocked",
    source: "lecture OBD-II temps reel",
  },
];

export const garageWorkOrders: GarageWorkOrder[] = [
  {
    id: "wo-7714",
    time: "08:20",
    client: "Awa Diop",
    vehicle: "Toyota Prado",
    operation: "Vidange + filtre + controle capteur",
    status: "diagnostic",
    amount: 62000,
  },
  {
    id: "wo-7742",
    time: "09:35",
    client: "Mamadou Fall",
    vehicle: "Mercedes C220d",
    operation: "Visite technique + freinage",
    status: "devis",
    amount: 148000,
  },
  {
    id: "wo-7798",
    time: "11:10",
    client: "Ibrahima Sarr",
    vehicle: "BMW 320i",
    operation: "Diagnostic moteur P0420",
    status: "intervention",
    amount: 285000,
  },
];

export const garageSignals: GarageSignal[] = [
  {
    id: "sig-bat",
    vehicle: "Toyota Prado",
    device: "DASN-IOT-0421",
    metric: "Batterie",
    value: "12.6 V",
    status: "ok",
    updatedAt: "14:32",
  },
  {
    id: "sig-temp",
    vehicle: "BMW 320i",
    device: "DASN-IOT-0194",
    metric: "Temperature moteur",
    value: "96 C",
    status: "watch",
    updatedAt: "14:31",
  },
  {
    id: "sig-dtc",
    vehicle: "BMW 320i",
    device: "DASN-IOT-0194",
    metric: "DTC actifs",
    value: "P0420, U0121",
    status: "blocked",
    updatedAt: "14:31",
  },
  {
    id: "sig-gps",
    vehicle: "Hyundai Tucson",
    device: "DASN-IOT-0882",
    metric: "Derniere position",
    value: "Dakar Plateau",
    status: "ok",
    updatedAt: "14:29",
  },
];

export function getGarageOverview() {
  const urgentAlerts = garageAlerts.filter((alert) => alert.severity === "urgent" || alert.severity === "blocked");
  const revenue = garageWorkOrders.reduce((total, order) => total + order.amount, 0);

  return {
    updatedAt: new Date().toISOString(),
    summary: {
      clients: 128,
      vehicles: 214,
      connectedDevices: 147,
      openWorkOrders: garageWorkOrders.length,
      urgentAlerts: urgentAlerts.length,
      projectedRevenue: revenue,
    },
    alerts: garageAlerts,
    workOrders: garageWorkOrders,
    signals: garageSignals,
  };
}
