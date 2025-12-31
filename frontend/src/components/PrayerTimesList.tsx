import { PrayerTimes, PrayerName } from '@/types/prayer';
import { PRAYER_ORDER, convertTo12Hour, getPrayerHighlighting } from '@/lib/prayer-utils';

interface PrayerTimesListProps {
  prayerTimes: PrayerTimes;
  currentTime: Date;
}

export function PrayerTimesList({ prayerTimes, currentTime }: PrayerTimesListProps) {
  const { greenPrayer, orangePrayer } = getPrayerHighlighting(prayerTimes, currentTime);

  return (
    <div className="space-y-1.5">
      {PRAYER_ORDER.map((prayer) => {
        const isGreen = greenPrayer?.key === prayer.key;
        const isOrange = orangePrayer?.key === prayer.key;
        const time12h = convertTo12Hour(prayerTimes[prayer.key]);

        // Determine styling based on green/orange status
        let bgColor = 'bg-gray-800';
        let textColor = 'text-gray-300';
        let shadow = '';
        let scale = '';

        if (isGreen) {
          // Green: Current prayer
          bgColor = 'bg-emerald-600';
          textColor = 'text-white';
          shadow = 'shadow-lg';
          scale = 'scale-105';
        } else if (isOrange) {
          // Orange: Next prayer
          bgColor = 'bg-orange-600';
          textColor = 'text-white';
          shadow = 'shadow-md';
          scale = 'scale-102';
        }

        return (
          <div
            key={prayer.key}
            className={`flex justify-between items-center px-4 py-2 rounded-lg transition-all ${bgColor} ${textColor} ${shadow} ${scale}`}
          >
            <span className="text-lg font-semibold">{prayer.name}</span>
            <span className="text-lg font-mono font-bold">{time12h}</span>
          </div>
        );
      })}
    </div>
  );
}
