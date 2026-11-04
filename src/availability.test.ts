import { describe, expect, it } from 'vitest';
import type { Booking, Room } from '@/types';
import { checkAvailability } from '@/availability';
import { NOW, ROOMS } from '@/rooms';

const unblockedRoom: Room = ROOMS.find((r) => r.id === 'room-a')!;
const blockedRoom: Room = ROOMS.find((r) => r.id === 'room-b')!;

function cloneRoom(room: Room): Room {
  return {
    ...room,
    existing: room.existing.map((b) => ({ ...b })),
  };
}

function cloneBookings(bookings: Booking[]): Booking[] {
  return bookings.map((b) => ({ ...b }));
}

describe('checkAvailability — AC1: invalid, reversed, and past intervals', () => {
  it('rejects start equal to now', () => {
    expect(checkAvailability(unblockedRoom, { start: NOW, end: NOW + 30 })).toBe(false);
  });

  it('rejects start before now', () => {
    expect(checkAvailability(unblockedRoom, { start: NOW - 10, end: NOW + 20 })).toBe(false);
  });

  it('rejects reversed intervals (start > end)', () => {
    expect(checkAvailability(unblockedRoom, { start: 700, end: 660 })).toBe(false);
  });

  it('rejects zero-length intervals (start === end)', () => {
    expect(checkAvailability(unblockedRoom, { start: 660, end: 660 })).toBe(false);
  });

  it('rejects non-integer start', () => {
    expect(checkAvailability(unblockedRoom, { start: 660.5, end: 720 })).toBe(false);
  });

  it('rejects non-integer end', () => {
    expect(checkAvailability(unblockedRoom, { start: 660, end: 720.5 })).toBe(false);
  });

  it('rejects end > 1440', () => {
    expect(checkAvailability(unblockedRoom, { start: 1430, end: 1441 })).toBe(false);
  });

  it('rejects negative start', () => {
    expect(checkAvailability(unblockedRoom, { start: -10, end: 30 })).toBe(false);
  });
});

describe('checkAvailability — AC2: maximum duration 120 minutes', () => {
  it('allows exactly 120 minutes', () => {
    expect(checkAvailability(unblockedRoom, { start: 660, end: 780 })).toBe(true);
  });

  it('rejects 121 minutes', () => {
    expect(checkAvailability(unblockedRoom, { start: 660, end: 781 })).toBe(false);
  });

  it('allows 60 minutes', () => {
    expect(checkAvailability(unblockedRoom, { start: 660, end: 720 })).toBe(true);
  });
});

describe('checkAvailability — AC3: blocked rooms are unavailable', () => {
  it('rejects every request for a blocked room', () => {
    expect(checkAvailability(blockedRoom, { start: 660, end: 720 })).toBe(false);
  });

  it('rejects even a non-overlapping slot for a blocked room', () => {
    expect(checkAvailability(blockedRoom, { start: 720, end: 840 })).toBe(false);
  });
});

describe('checkAvailability — AC4: overlap and touching endpoints', () => {
  it('rejects overlapping bookings', () => {
    expect(checkAvailability(unblockedRoom, { start: 630, end: 690 })).toBe(false);
  });

  it('allows touching at the existing booking end (start = bookedEnd)', () => {
    expect(checkAvailability(unblockedRoom, { start: 660, end: 720 })).toBe(true);
  });

  it('allows touching at the existing booking start (end = bookedStart)', () => {
    expect(checkAvailability(unblockedRoom, { start: 570, end: 600 })).toBe(true);
  });

  it('rejects fully contained overlap', () => {
    expect(checkAvailability(unblockedRoom, { start: 610, end: 650 })).toBe(false);
  });

  it('rejects full containment of existing booking', () => {
    expect(checkAvailability(unblockedRoom, { start: 590, end: 670 })).toBe(false);
  });

  it('allows a slot after the existing booking with a gap', () => {
    expect(checkAvailability(unblockedRoom, { start: 720, end: 840 })).toBe(true);
  });
});

describe('checkAvailability — AC5: returns Boolean and does not mutate data', () => {
  it('returns a boolean for a valid request', () => {
    const result = checkAvailability(unblockedRoom, { start: 660, end: 720 });
    expect(typeof result).toBe('boolean');
  });

  it('returns a boolean for an invalid request', () => {
    const result = checkAvailability(unblockedRoom, { start: 100, end: 50 });
    expect(typeof result).toBe('boolean');
  });

  it('does not modify the request object', () => {
    const request = { start: 660, end: 720 };
    const snapshot = { ...request };
    checkAvailability(unblockedRoom, request);
    expect(request).toEqual(snapshot);
  });

  it('does not modify the room existing bookings', () => {
    const room = cloneRoom(unblockedRoom);
    const before = cloneBookings(room.existing);
    checkAvailability(room, { start: 630, end: 690 });
    expect(room.existing).toEqual(before);
  });

  it('does not modify room.existing on a valid request', () => {
    const room = cloneRoom(unblockedRoom);
    const before = cloneBookings(room.existing);
    checkAvailability(room, { start: 660, end: 720 });
    expect(room.existing).toEqual(before);
  });
});

describe('checkAvailability — fixture data unchanged', () => {
  it('NOW is 540', () => {
    expect(NOW).toBe(540);
  });

  it('ROOMS has exactly two rooms', () => {
    expect(ROOMS).toHaveLength(2);
  });

  it('room-a is unblocked with baseline booking 600-660', () => {
    expect(unblockedRoom.blocked).toBe(false);
    expect(unblockedRoom.existing).toEqual([{ start: 600, end: 660 }]);
  });

  it('room-b is blocked with baseline booking 600-660', () => {
    expect(blockedRoom.blocked).toBe(true);
    expect(blockedRoom.existing).toEqual([{ start: 600, end: 660 }]);
  });

  it('ROOMS fixtures are not mutated after running checks', () => {
    const snapshot = ROOMS.map((r) => ({
      ...r,
      existing: r.existing.map((b) => ({ ...b })),
    }));
    checkAvailability(unblockedRoom, { start: 660, end: 720 });
    checkAvailability(blockedRoom, { start: 660, end: 720 });
    expect(ROOMS).toEqual(snapshot);
  });
});
