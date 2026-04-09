import { Parcel } from './types';

// Simple mock database service to handle persistence while Firebase is being configured
const STORAGE_KEY = 'neo_pay_parcels';

const initialParcels: Parcel[] = [
  {
    id: '1',
    tracking_id: 'NEO123456789',
    status: 'in_transit',
    location: 'Paris, France',
    estimated_date: '2026-04-12',
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    tracking_id: 'NEO987654321',
    status: 'delivered',
    location: 'Lyon, France',
    estimated_date: '2026-04-08',
    updated_at: new Date().toISOString(),
  }
];

export const dbService = {
  getParcels: (): Parcel[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialParcels));
      return initialParcels;
    }
    return JSON.parse(stored);
  },

  getParcelByTrackingId: (trackingId: string): Parcel | undefined => {
    const parcels = dbService.getParcels();
    return parcels.find(p => p.tracking_id.toUpperCase() === trackingId.toUpperCase());
  },

  addParcel: (parcel: Omit<Parcel, 'id' | 'updated_at'>): Parcel => {
    const parcels = dbService.getParcels();
    const newParcel: Parcel = {
      ...parcel,
      id: Math.random().toString(36).substr(2, 9),
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...parcels, newParcel]));
    return newParcel;
  },

  updateParcel: (id: string, updates: Partial<Parcel>): Parcel | undefined => {
    const parcels = dbService.getParcels();
    const index = parcels.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updatedParcel = {
      ...parcels[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    parcels[index] = updatedParcel;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parcels));
    return updatedParcel;
  },

  deleteParcel: (id: string): void => {
    const parcels = dbService.getParcels();
    const filtered = parcels.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
