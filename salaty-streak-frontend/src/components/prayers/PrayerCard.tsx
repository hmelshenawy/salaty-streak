'use client';

import { useState } from 'react';
import { Sunrise, Sun, CloudSun, Sunset, Moon, Check, Clock, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PrayerName, PrayerStatus } from '@/types/prayer';
import { PrayerTimePeriod } from '@/types/dashboard';
import { PRAYER_LABELS, PRAYER_ICON_NAMES, STATUS_LABELS, STATUS_BG_COLORS, STATUS_TEXT_COLORS } from '@/lib/constants';
import { prayersService } from '@/services/prayers.service';

const PrayerIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
};

const PERIOD_COLORS: Record<string, string> = {
  early: 'bg-emerald-500',
  mid: 'bg-amber-400',
  late: 'bg-red-500',
};

const PERIOD_LABELS: Record<string, string> = {
  early: 'Early',
  mid: 'On Time',
  late: 'Late',
};

interface PrayerCardProps {
  prayer: {
    prayerName: PrayerName;
    status: PrayerStatus | null;
    inMosque: boolean;
    points: number;
    prayedAt: string | null;
    prayerTime: string | null;
    prayerTimestamp: string | null;
    prayerEndTime: string | null;
    windowMinutes: number;
    periods: PrayerTimePeriod[];
  };
  isPast: boolean;
  isCurrent: boolean;
  onLogged: () => void;
}

function getCurrentPeriod(
  periods: PrayerTimePeriod[],
  timestamp: string | null,
): PrayerTimePeriod | null {
  if (!timestamp || periods.length === 0) return null;
  const now = Date.now();
  const start = new Date(timestamp).getTime();
  const elapsedMinutes = (now - start) / 60000;

  for (const period of periods) {
    if (elapsedMinutes >= period.startOffset && elapsedMinutes < period.endOffset) {
      return period;
    }
  }
  return periods[periods.length - 1];
}

export function PrayerCard({ prayer, isPast, isCurrent, onLogged }: PrayerCardProps) {
  const [loading, setLoading] = useState(false);
  const [inMosque, setInMosque] = useState(false);
  const name = prayer.prayerName as PrayerName;
  const IconComponent = PrayerIconMap[PRAYER_ICON_NAMES[name]] || Sun;

  const logPrayer = async () => {
    setLoading(true);
    try {
      await prayersService.quickLog({
        prayerName: name,
        date: new Date().toISOString().split('T')[0],
        inMosque,
      });
      setInMosque(false);
      onLogged();
    } catch (err) {
      console.error('Failed to log prayer:', err);
    } finally {
      setLoading(false);
    }
  };

  const timeDisplay = prayer.prayerTime
    ? formatPrayerTime(prayer.prayerTime)
    : null;

  const currentPeriod = !prayer.status && !isPast && isCurrent
    ? getCurrentPeriod(prayer.periods, prayer.prayerTimestamp)
    : null;

  const pastPeriod = isPast && !prayer.status
    ? getCurrentPeriod(prayer.periods, prayer.prayerTimestamp)
    : null;

  const activePeriod = currentPeriod ?? pastPeriod;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl bg-card ring-1 transition-shadow ${
        isPast && !prayer.status
          ? 'ring-destructive/20 opacity-60 hover:ring-destructive/30'
          : isCurrent && !prayer.status
          ? 'ring-primary/30 hover:ring-primary/40'
          : 'ring-foreground/5 hover:ring-foreground/10'
      }`}
    >
      {/* Prayer icon */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          isPast && !prayer.status
            ? 'bg-destructive/10 text-destructive/60'
            : isCurrent && !prayer.status
            ? 'bg-primary/15 text-primary'
            : 'bg-primary/10 text-primary'
        }`}
      >
        <IconComponent className="h-6 w-6" />
      </div>

      {/* Prayer info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`font-medium text-base ${isPast && !prayer.status ? 'line-through decoration-destructive/40' : ''}`}>
            {PRAYER_LABELS[name]}
          </p>
          {activePeriod && (
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
              activePeriod.label === 'early'
                ? 'bg-emerald-500/15 text-emerald-400'
                : activePeriod.label === 'mid'
                ? 'bg-amber-400/15 text-amber-400'
                : 'bg-red-500/15 text-red-400'
            }`}>
              {PERIOD_LABELS[activePeriod.label]}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {timeDisplay && (
            <span className={`text-sm ${isPast && !prayer.status ? 'text-destructive/50' : 'text-muted-foreground'}`}>
              {timeDisplay}
            </span>
          )}
          {isPast && !prayer.status && (
            <span className="flex items-center gap-1 text-xs text-destructive/70">
              <AlertCircle className="h-3 w-3" />
              Missed
            </span>
          )}
          {isCurrent && !prayer.status && !isPast && prayer.windowMinutes > 0 && (
            <span className="text-xs text-primary/70">
              {prayer.windowMinutes}min window
            </span>
          )}
        </div>

        {/* Period progress bar for current or past unlogged prayers */}
        {activePeriod && prayer.periods.length > 0 && !prayer.status && (
          <div className="flex gap-0.5 mt-1.5 h-1.5 rounded-full overflow-hidden">
            {prayer.periods.map((period) => (
              <div
                key={period.label}
                className={`${PERIOD_COLORS[period.label]} ${
                  period.label === activePeriod.label ? 'opacity-100' : 'opacity-30'
                } transition-opacity`}
                style={{
                  width: `${((period.endOffset - period.startOffset) / prayer.windowMinutes) * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status / Action */}
      {prayer.status ? (
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant="secondary"
            className={`${STATUS_BG_COLORS[prayer.status]} ${STATUS_TEXT_COLORS[prayer.status]} border-0 font-medium`}
          >
            {STATUS_LABELS[prayer.status]}
          </Badge>
          {prayer.inMosque && (
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] px-1.5">
              🕌
            </Badge>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          {/* Mosque toggle */}
          <button
            type="button"
            onClick={() => setInMosque(!inMosque)}
            disabled={isPast}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isPast
                ? 'opacity-40 cursor-not-allowed bg-muted/30 text-muted-foreground'
                : inMosque
                ? 'bg-primary/15 text-primary ring-1 ring-primary/30'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span className="text-sm">🕌</span>
            Mosque
          </button>

          {/* Pray button — disabled if window is past */}
          <Button
            size="lg"
            className={`h-12 px-5 font-medium ${
              isPast
                ? 'bg-muted text-muted-foreground opacity-50'
                : isCurrent
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-primary/80 hover:bg-primary text-primary-foreground'
            }`}
            disabled={loading || isPast}
            onClick={logPrayer}
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            ) : isPast ? (
              <>
                <X className="h-4 w-4 mr-1.5" />
                Missed
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                Pray
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function formatPrayerTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}