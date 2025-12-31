import { useState, useEffect } from 'react';
import { PrayerTimes, ApiResponse } from '@/types/prayer';

const API_BASE_URL = 'https://api.waktusolat.app/v2/solat/TRG02';

// Convert Unix timestamp to 24-hour time format (HH:MM)
// This will be converted to 12-hour format by the display component
function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  return `${hoursStr}:${minutesStr}`;
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        setLoading(true);
        
        // Get current date to fetch the correct month/year
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const currentDay = today.getDate();
        
        // Fetch prayer times for the current month and year
        const apiUrl = `${API_BASE_URL}?year=${currentYear}&month=${currentMonth}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('Gagal mendapatkan waktu solat');
        }

        const data: ApiResponse = await response.json();
        
        if (data.prayers && data.prayers.length > 0) {
          // Verify we got the correct month/year
          if (data.year !== currentYear || data.month_number !== currentMonth) {
            console.warn('API returned different month/year than requested');
          }
          
          // Find today's prayer times by matching the day
          const todayPrayer = data.prayers.find(p => p.day === currentDay);
          
          if (!todayPrayer) {
            throw new Error(`Waktu solat untuk hari ini (${currentDay}) tidak dijumpai`);
          }
          
          setPrayerTimes({
            subuh: formatTime(todayPrayer.fajr),
            syuruk: formatTime(todayPrayer.syuruk),
            zohor: formatTime(todayPrayer.dhuhr),
            asar: formatTime(todayPrayer.asr),
            maghrib: formatTime(todayPrayer.maghrib),
            isyak: formatTime(todayPrayer.isha),
          });
          
          setHijriDate(todayPrayer.hijri);
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ralat tidak diketahui');
        console.error('Error fetching prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrayerTimes();

    // Refresh prayer times at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      fetchPrayerTimes();
      // Set up daily refresh
      const dailyInterval = setInterval(fetchPrayerTimes, 24 * 60 * 60 * 1000);
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);

    return () => clearTimeout(midnightTimer);
  }, []);

  return { prayerTimes, hijriDate, loading, error };
}
