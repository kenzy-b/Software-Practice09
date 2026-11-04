import type { Room } from '@/types';

export const NOW = 540;

export const ROOMS: Room[] = [
  {
    id: 'room-a',
    name: 'Room A · Study Lab',
    building: 'Library Building',
    capacity: 12,
    blocked: false,
    existing: [{ start: 600, end: 660 }],
  },
  {
    id: 'room-b',
    name: 'Room B · Seminar Room',
    building: 'Science Block',
    capacity: 30,
    blocked: true,
    existing: [{ start: 600, end: 660 }],
  },
];
