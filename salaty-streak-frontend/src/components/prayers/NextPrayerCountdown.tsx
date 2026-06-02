'use client';

import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface NextPrayerCountdownProps {
  prayerName: string;
  timestamp: string; // ISO date string
  endTime: string;   // ISO date string
  windowMinutes: number;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Now';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = Math.floor((ms % 60000) / 1000);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

const PRAYER_LABELS: Record<string, string> = {
  FAJR: 'Fajr',
  DHUHR: 'Dhuhr',
  ASR: 'Asr',
  MAGHRIB: 'Maghrib',
  ISHA: 'Isha',
};

export function NextPrayerCountdown({
  prayerName,
  timestamp,
  endTime,
  windowMinutes,
}: NextPrayerCountdownProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const prayerTime = new Date(timestamp).getTime();
  const prayerEnd = new Date(endTime).getTime();
  const diff = prayerTime - now;

  // Hasn't started yet — show countdown to prayer
  if (diff > 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 ring-1 ring-primary/20">
        <Clock className="h-5 w-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary">
            Next: {PRAYER_LABELS[prayerName] ?? prayerName}
          </p>
          <p className="text-xs text-muted-foreground">
            Starts in <span className="font-semibold text-foreground">{formatCountdown(diff)}</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-primary tabular-nums">{formatCountdown(diff)}</p>
        </div>
      </div>
    );
  }

  // Currently within prayer window — show remaining time with urgency coloring
  const remaining = prayerEnd - now;
  if (remaining > 0) {
    const elapsed = now - prayerTime;
    const progress = Math.min(elapsed / (prayerEnd - prayerTime), 1);
    const remainingMinutes = remaining / 60000;

    // Determine urgency level
    // Last 15 min = critical (red), last 30 min = urgent (amber), rest = active (gold/accent)
    const isCritical = remainingMinutes <= 15;
    const isUrgent = remainingMinutes <= 30;

    // Color classes based on urgency
    const bgClass = isCritical
      ? 'bg-destructive/10 ring-destructive/30'
      : isUrgent
      ? 'bg-amber-500/10 ring-amber-500/30'
      : 'bg-accent/10 ring-accent/20';

    const textClass = isCritical
      ? 'text-destructive'
      : isUrgent
      ? 'text-amber-500'
      : 'text-accent';

    const iconClass = isCritical
      ? 'text-destructive'
      : isUrgent
      ? 'text-amber-500'
      : 'text-accent';

    const ringProgressClass = isCritical
      ? 'text-destructive'
      : isUrgent
      ? 'text-amber-500'
      : 'text-accent';

    const labelClass = isCritical
      ? 'text-destructive'
      : isUrgent
      ? 'text-amber-500'
      : 'text-accent-foreground';

    const Icon = isCritical ? AlertTriangle : Clock;

    return (
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${bgClass} ring-1`}>
        <Icon className={`h-5 w-5 ${iconClass} shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${labelClass}`}>
            {isCritical ? '⚠️ ' : ''}Now: {PRAYER_LABELS[prayerName] ?? prayerName}
          </p>
          <p className="text-xs text-muted-foreground">
            {isCritical ? (
              <span className="font-semibold text-destructive">
                {formatCountdown(remaining)} left — Pray now!
              </span>
            ) : isUrgent ? (
              <span className="font-semibold text-amber-500">
                {formatCountdown(remaining)} remaining
              </span>
            ) : (
              <>
                Time remaining <span className="font-semibold text-foreground">{formatCountdown(remaining)}</span>
              </>
            )}
          </p>
        </div>
        <div className="relative h-10 w-10 shrink-0">
          <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/30"
            />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${progress * 94.25} ${94.25}`}
              strokeLinecap="round"
              className={ringProgressClass}
            />
          </svg>
        </div>
      </div>
    );
  }

  return null;
}