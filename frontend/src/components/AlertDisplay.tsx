import { PrayerName } from '@/types/prayer';

interface AlertDisplayProps {
  prayerName: PrayerName;
  type: 'azan' | 'syuruk';
}

export function AlertDisplay({ prayerName, type }: AlertDisplayProps) {
  const displayText = type === 'azan' ? 'Azan' : 'Syuruk';

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <div className="text-center space-y-12 animate-pulse">
        <div className="text-9xl font-bold text-emerald-400">
          {displayText}
        </div>
        <div className="text-6xl font-semibold">
          {prayerName}
        </div>
      </div>
    </div>
  );
}
