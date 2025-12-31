import { PrayerTimes, PrayerName } from '@/types/prayer';
import { getNextPrayer, convertTo12Hour } from '@/lib/prayer-utils';

interface NextPrayerDisplayProps {
  prayerTimes: PrayerTimes;
  currentTime: Date;
}

export function NextPrayerDisplay({ prayerTimes, currentTime }: NextPrayerDisplayProps) {
  const nextPrayer = getNextPrayer(prayerTimes, currentTime);

  if (!nextPrayer) return null;

  const time12h = convertTo12Hour(nextPrayer.time);

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      <div className="text-center space-y-6">
        <h2 className="text-4xl font-semibold text-gray-300">
          Waktu Solat Seterusnya
        </h2>
        <div className="space-y-4">
          <div className="text-8xl font-bold text-emerald-400">
            {nextPrayer.name}
          </div>
          <div className="text-6xl font-mono font-bold">
            {time12h}
          </div>
        </div>
      </div>
    </div>
  );
}
