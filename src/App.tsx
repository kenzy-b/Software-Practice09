import { useMemo, useState } from 'react';
import {
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DoorClosed,
  DoorOpen,
  Lock,
  Search,
  Users,
  XCircle,
} from 'lucide-react';
import type { AvailabilityResult } from '@/types';
import {
  evaluateAvailability,
  formatTime,
} from '@/availability';
import { NOW, ROOMS } from '@/rooms';
import Timeline from '@/Timeline';
import TestPanel from '@/TestPanel';

function parseInput(v: string): number | null {
  const trimmed = v.trim();
  if (trimmed === '') return null;
  if (/^(true|false)$/i.test(trimmed)) return null;
  if (!/^-?\d+$/.test(trimmed)) return null;
  return parseInt(trimmed, 10);
}

export default function App() {
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [startStr, setStartStr] = useState<string>('660');
  const [endStr, setEndStr] = useState<string>('720');
  const [result, setResult] = useState<AvailabilityResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const room = useMemo(
    () => ROOMS.find((r) => r.id === roomId) ?? ROOMS[0],
    [roomId]
  );

  function handleRoomChange(id: string) {
    setRoomId(id);
    setResult(null);
    setSubmitted(false);
  }

  function handleCheck() {
    const start = parseInput(startStr);
    const end = parseInput(endStr);
    const res = evaluateAvailability(room, start, end);
    setResult(res);
    setSubmitted(true);
  }

  function handleReset() {
    setStartStr('660');
    setEndStr('720');
    setResult(null);
    setSubmitted(false);
  }

  const startNum = parseInput(startStr);
  const endNum = parseInput(endStr);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white shadow-sm mb-3">
            <Building2 className="h-4 w-4" aria-hidden />
            Smart Campus
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Room Availability Checker
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Check whether a campus room is available for your time slot. No
            booking is created — this is a checker only.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-100 rounded-full px-3 py-1">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Current time: <span className="font-bold">{formatTime(NOW)}</span> (540 min)
          </div>
        </header>

        {/* Room selection */}
        <section
          className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 sm:p-6 mb-4"
          aria-label="Room selection"
        >
          <h2 className="text-base font-bold text-slate-900 mb-3">
            1. Select a room
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROOMS.map((r) => {
              const selected = r.id === roomId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => handleRoomChange(r.id)}
                  className={`relative text-left rounded-xl p-4 ring-2 transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 ${
                    selected
                      ? 'ring-sky-500 bg-sky-50'
                      : 'ring-slate-200 bg-white hover:ring-slate-300 hover:bg-slate-50'
                  }`}
                  aria-pressed={selected}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {r.blocked ? (
                        <DoorClosed className="h-5 w-5 text-red-500 shrink-0" aria-hidden />
                      ) : (
                        <DoorOpen className="h-5 w-5 text-emerald-600 shrink-0" aria-hidden />
                      )}
                      <span className="font-bold text-slate-900 truncate">
                        {r.name}
                      </span>
                    </div>
                    {r.blocked ? (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5">
                        <Lock className="h-3 w-3" aria-hidden />
                        Blocked
                      </span>
                    ) : (
                      <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5">
                        <CheckCircle2 className="h-3 w-3" aria-hidden />
                        Open
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" aria-hidden />
                      {r.building}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" aria-hidden />
                      {r.capacity}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Room detail + timeline */}
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 sm:p-6 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">
              2. Room details
            </h2>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                room.blocked
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {room.blocked ? (
                <>
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  Blocked
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  Unblocked
                </>
              )}
            </span>
          </div>

          {room.existing.length > 0 ? (
            <div className="mb-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Existing bookings
              </p>
              {room.existing.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <CalendarCheck className="h-4 w-4 text-slate-400" aria-hidden />
                  <span className="font-medium">
                    {formatTime(b.start)} – {formatTime(b.end)}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({b.start}–{b.end} min)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-sm text-slate-500">No existing bookings.</p>
          )}

          <Timeline
            bookings={room.existing}
            pendingStart={startNum}
            pendingEnd={endNum}
            blocked={room.blocked}
          />
        </section>

        {/* Form */}
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 sm:p-6 mb-4">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            3. Enter your time slot
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start */}
            <div>
              <label
                htmlFor="start-input"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Start (minutes from midnight)
              </label>
              <input
                id="start-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={startStr}
                onChange={(e) => {
                  setStartStr(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g. 660"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
              />
              <p className="mt-1 text-xs text-slate-500">
                Preview: <span className="font-semibold">{startNum !== null ? formatTime(startNum) : '—'}</span>
              </p>
            </div>

            {/* End */}
            <div>
              <label
                htmlFor="end-input"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                End (minutes from midnight)
              </label>
              <input
                id="end-input"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={endStr}
                onChange={(e) => {
                  setEndStr(e.target.value);
                  setSubmitted(false);
                }}
                placeholder="e.g. 720 or 1440"
                className="w-full rounded-lg border border-slate-300 px-3 py-3 text-base text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
              />
              <p className="mt-1 text-xs text-slate-500">
                Preview: <span className="font-semibold">{endNum !== null ? formatTime(endNum) : '—'}</span> (1440 = 24:00)
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Enter times as integer minutes from midnight (0–1440). 1440 displays
            as 24:00. Max duration 120 min. Start must be after {formatTime(NOW)}.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleCheck}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-5 py-3 text-base font-bold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 active:bg-sky-800"
            >
              <Search className="h-5 w-5" aria-hidden />
              Check availability
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-100 px-5 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-300"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Result */}
        {submitted && result && (
          <ResultBanner result={result} />
        )}

        {!submitted && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center mb-4">
            <Clock className="h-8 w-8 text-slate-300 mx-auto mb-2" aria-hidden />
            <p className="text-sm text-slate-400">
              Enter a time slot and press “Check availability” to see the result.
            </p>
          </div>
        )}

        {/* Test panel */}
        <TestPanel room={room} />

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-slate-400">
          Prototype only · Fictional data · No booking is created
        </footer>
      </div>
    </div>
  );
}

function ResultBanner({ result }: { result: AvailabilityResult }) {
  const available = result.result === 'available';
  return (
    <section
      className={`rounded-2xl shadow-sm ring-1 p-5 sm:p-6 mb-4 ${
        available
          ? 'bg-emerald-50 ring-emerald-200'
          : 'bg-red-50 ring-red-200'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 rounded-full p-2 ${
            available ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          {available ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-600" aria-hidden />
          ) : (
            <XCircle className="h-6 w-6 text-red-600" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-lg sm:text-xl font-extrabold ${
              available ? 'text-emerald-800' : 'text-red-800'
            }`}
          >
            {available ? 'Available' : 'Unavailable'}
          </p>
          <p
            className={`text-sm font-semibold ${
              available ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {result.reason}
          </p>
          <p
            className={`mt-1 text-sm ${
              available ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {result.detail}
          </p>
        </div>
      </div>
    </section>
  );
}
