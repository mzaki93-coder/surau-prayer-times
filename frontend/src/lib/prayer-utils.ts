import { PrayerTimes, PrayerTimeEntry, PrayerName } from '@/types/prayer';

export const PRAYER_ORDER: Array<{ name: PrayerName; key: keyof PrayerTimes }> = [
  { name: 'Subuh', key: 'subuh' },
  { name: 'Syuruk', key: 'syuruk' },
  { name: 'Zohor', key: 'zohor' },
  { name: 'Asar', key: 'asar' },
  { name: 'Maghrib', key: 'maghrib' },
  { name: 'Isyak', key: 'isyak' },
];

export function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getCurrentTimeInMinutes(currentTime: Date): number {
  return currentTime.getHours() * 60 + currentTime.getMinutes();
}

export function getNextPrayer(
  prayerTimes: PrayerTimes,
  currentTime: Date
): { name: PrayerName; time: string; key: keyof PrayerTimes } | null {
  const currentMinutes = getCurrentTimeInMinutes(currentTime);

  // Filter out Syuruk since it's not a prayer time
  const prayerTimesOnly = PRAYER_ORDER.filter(p => p.name !== 'Syuruk');

  for (const prayer of prayerTimesOnly) {
    const prayerMinutes = parseTimeToMinutes(prayerTimes[prayer.key]);
    // Highlight until 10 minutes after prayer time
    if (currentMinutes < prayerMinutes + 10) {
      return { name: prayer.name, time: prayerTimes[prayer.key], key: prayer.key };
    }
  }

  // If past all prayers, next is tomorrow's Subuh
  return { name: 'Subuh', time: prayerTimes.subuh, key: 'subuh' };
}

/**
 * Get highlighting state for prayer times based on refined logic
 * Returns which prayers should be highlighted in green and orange
 */
export function getPrayerHighlighting(
  prayerTimes: PrayerTimes,
  currentTime: Date
): {
  greenPrayer: { name: PrayerName; key: keyof PrayerTimes } | null;
  orangePrayer: { name: PrayerName; key: keyof PrayerTimes } | null;
} {
  const currentMinutes = getCurrentTimeInMinutes(currentTime);
  
  const subuhMin = parseTimeToMinutes(prayerTimes.subuh);
  const syurukMin = parseTimeToMinutes(prayerTimes.syuruk);
  const zohorMin = parseTimeToMinutes(prayerTimes.zohor);
  const asarMin = parseTimeToMinutes(prayerTimes.asar);
  const maghribMin = parseTimeToMinutes(prayerTimes.maghrib);
  const isyakMin = parseTimeToMinutes(prayerTimes.isyak);

  // 1. Next prayer is Subuh - highlight Subuh in orange and highlight Isyak in green
  // (This is after Isyak+20 until before Subuh)
  if (currentMinutes >= isyakMin + 20 || currentMinutes < subuhMin) {
    return {
      greenPrayer: { name: 'Isyak', key: 'isyak' },
      orangePrayer: { name: 'Subuh', key: 'subuh' }
    };
  }

  // 2. Now is Subuh - only highlight Subuh in green until 20 minutes after Subuh
  if (currentMinutes >= subuhMin && currentMinutes < subuhMin + 20) {
    return {
      greenPrayer: { name: 'Subuh', key: 'subuh' },
      orangePrayer: null
    };
  }

  // 3. Next time is Syuruk - highlight Syuruk in orange and highlight Subuh in green
  // (After Subuh+20 until before Syuruk)
  if (currentMinutes >= subuhMin + 20 && currentMinutes < syurukMin) {
    return {
      greenPrayer: { name: 'Subuh', key: 'subuh' },
      orangePrayer: { name: 'Syuruk', key: 'syuruk' }
    };
  }

  // 4. Now is Syuruk - highlight Syuruk in green for 5 minutes and highlight Zohor in orange
  if (currentMinutes >= syurukMin && currentMinutes < syurukMin + 5) {
    return {
      greenPrayer: { name: 'Syuruk', key: 'syuruk' },
      orangePrayer: { name: 'Zohor', key: 'zohor' }
    };
  }

  // 5. Next prayer is Zohor - only highlight Zohor in orange
  // (After Syuruk+5 until before Zohor)
  if (currentMinutes >= syurukMin + 5 && currentMinutes < zohorMin) {
    return {
      greenPrayer: null,
      orangePrayer: { name: 'Zohor', key: 'zohor' }
    };
  }

  // 6. Now is Zohor - only highlight Zohor in green until 20 minutes after Zohor
  if (currentMinutes >= zohorMin && currentMinutes < zohorMin + 20) {
    return {
      greenPrayer: { name: 'Zohor', key: 'zohor' },
      orangePrayer: null
    };
  }

  // 7. Next prayer time is Asar - highlight Asar in orange and highlight Zohor in green
  // (After Zohor+20 until before Asar)
  if (currentMinutes >= zohorMin + 20 && currentMinutes < asarMin) {
    return {
      greenPrayer: { name: 'Zohor', key: 'zohor' },
      orangePrayer: { name: 'Asar', key: 'asar' }
    };
  }

  // 8. Now is Asar - only highlight Asar in green until 20 minutes after Asar
  if (currentMinutes >= asarMin && currentMinutes < asarMin + 20) {
    return {
      greenPrayer: { name: 'Asar', key: 'asar' },
      orangePrayer: null
    };
  }

  // 9. Next prayer time is Maghrib - highlight Maghrib in orange and highlight Asar in green
  // (After Asar+20 until before Maghrib)
  if (currentMinutes >= asarMin + 20 && currentMinutes < maghribMin) {
    return {
      greenPrayer: { name: 'Asar', key: 'asar' },
      orangePrayer: { name: 'Maghrib', key: 'maghrib' }
    };
  }

  // 10. Now is Maghrib - only highlight Maghrib in green until 20 minutes after Maghrib
  if (currentMinutes >= maghribMin && currentMinutes < maghribMin + 20) {
    return {
      greenPrayer: { name: 'Maghrib', key: 'maghrib' },
      orangePrayer: null
    };
  }

  // 11. Next prayer time is Isyak - highlight Isyak in orange and highlight Maghrib in green
  // (After Maghrib+20 until before Isyak)
  if (currentMinutes >= maghribMin + 20 && currentMinutes < isyakMin) {
    return {
      greenPrayer: { name: 'Maghrib', key: 'maghrib' },
      orangePrayer: { name: 'Isyak', key: 'isyak' }
    };
  }

  // 12. Now is Isyak - only highlight Isyak in green until 20 minutes after Isyak
  if (currentMinutes >= isyakMin && currentMinutes < isyakMin + 20) {
    return {
      greenPrayer: { name: 'Isyak', key: 'isyak' },
      orangePrayer: null
    };
  }

  // Fallback (should not reach here)
  return {
    greenPrayer: null,
    orangePrayer: null
  };
}

export function getTimeUntilPrayer(prayerTime: string, currentTime: Date): number {
  const prayerMinutes = parseTimeToMinutes(prayerTime);
  const currentMinutes = getCurrentTimeInMinutes(currentTime);
  
  let diff = prayerMinutes - currentMinutes;
  
  // If negative, it means it's tomorrow
  if (diff < 0) {
    diff += 24 * 60;
  }
  
  return diff;
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getMalaysianDate(date: Date): string {
  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'
  ];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
}

export function getHijriDate(hijriString: string): string {
  // API returns format like "1446-06-15"
  // Convert to Malaysian Malay format
  const hijriMonths = [
    'Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jamadilawal', 'Jamadilakhir',
    'Rejab', 'Syaaban', 'Ramadan', 'Syawal', 'Zulkaedah', 'Zulhijjah'
  ];
  
  const [year, month, day] = hijriString.split('-').map(Number);
  const monthName = hijriMonths[month - 1] || '';
  
  return `${day} ${monthName} ${year}H`;
}

export function playBeep(frequency: number = 3500, duration: number = 100): void {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

export function playDoubleBeep(): Promise<void> {
  return new Promise((resolve) => {
    playBeep(3500, 100);
    setTimeout(() => {
      playBeep(3500, 100);
      setTimeout(resolve, 200);
    }, 150);
  });
}

export async function playBeepSequence(repetitions: number = 5, gapMs: number = 2000): Promise<void> {
  for (let i = 0; i < repetitions; i++) {
    await playDoubleBeep();
    if (i < repetitions - 1) {
      await new Promise(resolve => setTimeout(resolve, gapMs));
    }
  }
}
