import { formatCountdown } from '@/lib/prayer-utils';
import { PrayerName } from '@/types/prayer';

interface CountdownDisplayProps {
  seconds: number;
  prayerName: PrayerName;
  type: '10min' | 'iqamah';
}

export function CountdownDisplay({ seconds, prayerName, type }: CountdownDisplayProps) {
  const title = type === '10min' 
    ? `${prayerName} dalam` 
    : 'Iqamah dalam';

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <div className="text-center space-y-8">
        <h2 className="text-5xl font-semibold text-gray-300">
          {title}
        </h2>
        <div className="text-9xl font-bold font-mono text-emerald-400 tracking-wider">
          {formatCountdown(seconds)}
        </div>
        {type === '10min' && (
          <p className="text-3xl text-gray-400">minit</p>
        )}
      </div>
    </div>
  );
}
