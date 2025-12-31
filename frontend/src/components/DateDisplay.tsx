import { getMalaysianDate, getHijriDate } from '@/lib/prayer-utils';

interface DateDisplayProps {
  currentTime: Date;
  hijriDate: string;
}

export function DateDisplay({ currentTime, hijriDate }: DateDisplayProps) {
  const gregorianDate = getMalaysianDate(currentTime);
  const hijriFormatted = hijriDate ? getHijriDate(hijriDate) : '';

  return (
    <div className="space-y-1 text-center">
      <div className="text-lg font-semibold text-gray-200">
        {gregorianDate}
      </div>
      {hijriFormatted && (
        <div className="text-base font-medium text-emerald-400">
          {hijriFormatted}
        </div>
      )}
    </div>
  );
}
