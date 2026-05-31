import {
  fieldNumber,
  fieldObject,
  fieldString,
  schema,
} from "./index";

/* ── Auth ─────────────────────────────────────────────────────────────── */

export const loginPayloadSchema = schema({
  email: fieldString({ email: true, max: 254 }),
  password: fieldString({ min: 1, max: 256, trim: false }),
});

/* ── Installation ─────────────────────────────────────────────────────── */

const newClientSchema = schema({
  fullName: fieldString({ min: 2, max: 100 }),
  email: fieldString({ email: true, optional: true, max: 254 }),
  phone: fieldString({ min: 6, max: 30 }),
  city: fieldString({ optional: true, max: 80 }),
});

const newVehicleSchema = schema({
  brand: fieldString({ min: 1, max: 60 }),
  model: fieldString({ min: 1, max: 60 }),
  plate: fieldString({ min: 3, max: 20 }),
  vin: fieldString({ optional: true, max: 32 }),
  mileage: fieldNumber({ min: 0, max: 2_000_000, int: true, default: 0 }),
});

export const installationPayloadSchema = schema({
  clientId: fieldString({ optional: true, max: 40 }),
  newClient: fieldObject(newClientSchema, { optional: true }),
  vehicleId: fieldString({ optional: true, max: 40 }),
  newVehicle: fieldObject(newVehicleSchema, { optional: true }),
  dongleSerial: fieldString({
    min: 4,
    max: 40,
    pattern: /^[A-Za-z0-9\-_.]+$/,
    patternError: "Le numéro du boîtier ne doit contenir que A-Z, 0-9, - _ .",
  }),
  technicianNote: fieldString({ optional: true, max: 240 }),
});
