# Smart Campus Room Availability Checker

A React and TypeScript web application for checking availability of fictional campus rooms.

## Project structure

- `src/availability.ts` — Booking validation and availability rules.
- `src/App.tsx` — Main UI and availability feedback.
- `src/Timeline.tsx` — Booking timeline visualization.
- `src/TestPanel.tsx` — Browser-based test cases.
- `src/types.ts` — Shared TypeScript types.
- Room fixture data currently lives in `src/availability.ts`.

## Acceptance criteria

- **AC1**: Reject invalid, reversed, and past intervals.
- **AC2**: Maximum booking duration is 120 minutes.
- **AC3**: Blocked rooms are unavailable.
- **AC4**: Reject overlapping bookings but allow touching endpoints.
- **AC5**: Return Boolean results without mutating booking data.
- **AC6**: Preserve clear desktop and mobile UI feedback.

## Engineering rules

- Make only minimal, justified changes.
- Keep booking rules separate from fictional room data.
- Preserve the current UI and existing behavior.
- Do not add unnecessary design patterns or class hierarchies.
- Do not add a backend, database, login, API, or booking creation.
- Do not remove existing tests or weaken assertions.

## Verification

1. `npm run build`
2. `npm run typecheck`
3. `npm run lint`
4. Run existing Test Panel checks.
5. Add focused automated regression tests if feasible.
6. Record actual commands, results, changed files, and remaining limitations.
