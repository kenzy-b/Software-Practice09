export interface Booking {
  start: number;
  end: number;
}

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
  existing: Booking[];
}

export interface AvailabilityRequest {
  start: number;
  end: number;
}

export type ResultKind = 'available' | 'unavailable';

export interface AvailabilityResult {
  result: ResultKind;
  reason: string;
  detail: string;
}
