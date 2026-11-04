import { Clock } from 'lucide-react';
import type { Booking } from '@/types';
import { formatTime } from '@/availability';
import { NOW } from '@/rooms';

interface TimelineProps {
  bookings: Booking[];
  pendingStart: number | null;
  pendingEnd: number | null;
  blocked: boolean;
}

const START = 9 * 60;
const END = 24 * 60;
const SPAN = END - START;

function toPercent(min: number): number {
  return ((min - START) / SPAN) * 100;
}

const HOURS = Array.from({ length: 16 }, (_, i) => 9 + i);

export default function Timeline({
  bookings,
  pendingStart,
  pendingEnd,
  blocked,
}: TimelineProps) {
  const nowPct = toPercent(NOW);

  return (
    <div className="select-none">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
        <Clock className="h-4 w-4" aria-hidden />
        <span>9:00 – 24:00 timeline</span>
      </div>

      <div className="relative h-12 rounded-lg bg-slate-100 ring-1 ring-slate-200">
        {HOURS.map((h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 border-l border-slate-200/70"
            style={{ left: `${toPercent(h * 60)}%` }}
          />
        ))}

        {bookings.map((b, i) => (
          <div
            key={i}
            className={`absolute top-1 bottom-1 rounded-md flex items-center justify-center text-[10px] font-semibold text-white shadow-sm ${
              blocked ? 'bg-red-400' : 'bg-slate-500'
            }`}
            style={{
              left: `${toPercent(b.start)}%`,
              width: `${toPercent(b.end) - toPercent(b.start)}%`,
            }}
            aria-label={`Existing booking ${formatTime(b.start)} to ${formatTime(b.end)}`}
          >
            {blocked ? 'Blocked' : 'Booked'}
          </div>
        ))}

        {pendingStart !== null && pendingEnd !== null && pendingStart < pendingEnd && pendingStart >= START && pendingEnd <= END && (
          <div
            className="absolute top-1 bottom-1 rounded-md border-2 border-dashed border-sky-500 bg-sky-200/50 flex items-center justify-center text-[10px] font-bold text-sky-800"
            style={{
              left: `${toPercent(pendingStart)}%`,
              width: `${toPercent(pendingEnd) - toPercent(pendingStart)}%`,
            }}
            aria-label={`Pending request ${formatTime(pendingStart)} to ${formatTime(pendingEnd)}`}
          >
            You
          </div>
        )}

        <div
          className="absolute top-0 bottom-0 border-l-2 border-amber-500 z-10"
          style={{ left: `${nowPct}%` }}
        >
          <span className="absolute -top-0 -translate-y-full left-0 -translate-x-1/2 text-[9px] font-semibold text-amber-600 whitespace-nowrap">
            Now {formatTime(NOW)}
          </span>
        </div>
      </div>

      <div className="relative mt-1 h-4 text-[9px] text-slate-400">
        {HOURS.filter((h) => h % 2 === 1).map((h) => (
          <span
            key={h}
            className="absolute -translate-x-1/2"
            style={{ left: `${toPercent(h * 60)}%` }}
          >
            {h}:00
          </span>
        ))}
        <span
          className="absolute -translate-x-1/2 font-semibold text-slate-500"
          style={{ left: `${toPercent(24 * 60)}%` }}
        >
          24:00
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className={`inline-block h-3 w-3 rounded-sm ${blocked ? 'bg-red-400' : 'bg-slate-500'}`} />
          Existing booking
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border-2 border-dashed border-sky-500 bg-sky-200/50" />
          Your request
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-0.5 bg-amber-500" />
          Now
        </span>
      </div>
    </div>
  );
}
