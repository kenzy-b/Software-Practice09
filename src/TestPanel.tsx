import { FlaskConical } from 'lucide-react';
import type { Room } from '@/types';
import { checkAvailability, formatTime } from '@/availability';

interface TestCase {
  label: string;
  start: number;
  end: number;
}

const TEST_CASES: TestCase[] = [
  { label: '660–720', start: 660, end: 720 },
  { label: '630–690', start: 630, end: 690 },
  { label: '720–840', start: 720, end: 840 },
  { label: '720–841', start: 720, end: 841 },
  { label: '540–570', start: 540, end: 570 },
  { label: '570–600', start: 570, end: 600 },
  { label: '1400–1440', start: 1400, end: 1440 },
];

const EXPECTED: Record<string, boolean> = {
  '660–720': true,
  '630–690': false,
  '720–840': true,
  '720–841': false,
  '540–570': false,
  '570–600': true,
  '1400–1440': true,
};

interface TestPanelProps {
  room: Room;
}

export default function TestPanel({ room }: TestPanelProps) {
  return (
    <section
      className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6"
      aria-label="Test panel"
    >
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="h-5 w-5 text-slate-700" aria-hidden />
        <h2 className="text-lg font-bold text-slate-900">Test Panel</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Expected outcomes for the{' '}
        <span className="font-semibold text-slate-700">{room.name}</span> with
        baseline booking {room.existing.map((b) => `${formatTime(b.start)}–${formatTime(b.end)}`).join(', ')}.{' '}
        {room.blocked && (
          <span className="font-semibold text-red-600">
            Blocked room — all cases are unavailable.
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TEST_CASES.map((tc) => {
          const actual = checkAvailability(room, { start: tc.start, end: tc.end });
          const expected = room.blocked ? false : EXPECTED[tc.label];
          const pass = actual === expected;
          return (
            <div
              key={tc.label}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200"
            >
              <div className="flex items-center gap-2 min-w-0">
                <code className="text-xs sm:text-sm font-mono font-semibold text-slate-700">
                  {tc.label}
                </code>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  ({tc.start}–{tc.end} min)
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor: actual ? '#dcfce7' : '#fee2e2',
                    color: actual ? '#166534' : '#991b1b',
                  }}
                >
                  {actual ? 'Available' : 'Unavailable'}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: pass ? '#16a34a' : '#dc2626' }}
                  aria-label={pass ? 'Pass' : 'Fail'}
                >
                  {pass ? '✓' : '✗'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        ✓ = actual result matches expected. These run against the pure{' '}
        <code className="font-mono">checkAvailability</code> function.
      </p>
    </section>
  );
}
