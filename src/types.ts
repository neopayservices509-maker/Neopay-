export type TrackingStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Parcel {
  id: string;
  tracking_id: string;
  status: TrackingStatus;
  location: string;
  estimated_date: string;
  updated_at: string;
  recipient_name?: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin';
}
