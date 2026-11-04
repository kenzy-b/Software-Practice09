import { NOW } from '@/rooms';
import type {
  AvailabilityRequest,
  AvailabilityResult,
  Booking,
  Room,
} from '@/types';

const HOUR = 60;
const DAY = 24 * 60;

const MAX_DURATION = 120;

const OVERLAP_DESC = 'overlaps an existing booking';

function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

function findOverlap(
  start: number,
  end: number,
  bookings: Booking[]
): Booking | null {
  for (const b of bookings) {
    if (start < b.end && b.start < end) return b;
  }
  return null;
}

export function checkAvailability(
  room: Room,
  request: AvailabilityRequest
): boolean {
  if (room.blocked) return false;

  const { start, end } = request;
  if (!isInteger(start) || !isInteger(end)) return false;
  if (!(0 <= start && start < end && end <= DAY)) return false;
  if (start <= NOW) return false;
  if (end - start > MAX_DURATION) return false;
  if (findOverlap(start, end, room.existing) !== null) return false;

  return true;
}

export function evaluateAvailability(
  room: Room,
  startRaw: number | null,
  endRaw: number | null
): AvailabilityResult {
  if (room.blocked) {
    return {
      result: 'unavailable',
      reason: 'Room unavailable',
      detail: `${room.name} is currently blocked and cannot be booked.`,
    };
  }

  if (startRaw === null || endRaw === null) {
    return {
      result: 'unavailable',
      reason: 'Missing input',
      detail: 'Start and end times are both required.',
    };
  }

  if (!isInteger(startRaw) || !isInteger(endRaw)) {
    return {
      result: 'unavailable',
      reason: 'Invalid time format',
      detail:
        'Start and end must be whole numbers of minutes (no decimals, no text).',
    };
  }

  const start = startRaw;
  const end = endRaw;

  if (!(0 <= start)) {
    return {
      result: 'unavailable',
      reason: 'Start out of range',
      detail: 'Start must be at least 0 (00:00).',
    };
  }
  if (!(start < end)) {
    return {
      result: 'unavailable',
      reason: 'End must be after start',
      detail: 'End time must be later than the start time.',
    };
  }
  if (!(end <= DAY)) {
    return {
      result: 'unavailable',
      reason: 'End out of range',
      detail: 'End must be at most 1440 (24:00).',
    };
  }
  if (!(start > NOW)) {
    return {
      result: 'unavailable',
      reason: 'Start must be in the future',
      detail: `Start must be after now (${formatTime(NOW)}).`,
    };
  }
  if (end - start > MAX_DURATION) {
    return {
      result: 'unavailable',
      reason: 'Duration too long',
      detail: `Maximum booking duration is ${MAX_DURATION} minutes (your request is ${end - start} minutes).`,
    };
  }

  const ov = findOverlap(start, end, room.existing);
  if (ov) {
    return {
      result: 'unavailable',
      reason: 'Time conflict',
      detail: `Your request (${formatTime(start)}–${formatTime(end)}) ${OVERLAP_DESC} (${formatTime(ov.start)}–${formatTime(ov.end)}). Touching start/end is allowed.`,
    };
  }

  return {
    result: 'available',
    reason: 'Available',
    detail: `${room.name} is available from ${formatTime(start)} to ${formatTime(end)} (${end - start} min).`,
  };
}

export function formatTime(min: number): string {
  if (min === DAY) return '24:00';
  const clamped = ((min % DAY) + DAY) % DAY;
  const h = Math.floor(clamped / HOUR);
  const m = clamped % HOUR;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
