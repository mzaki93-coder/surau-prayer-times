export interface PrayerTimes {
  subuh: string;
  syuruk: string;
  zohor: string;
  asar: string;
  maghrib: string;
  isyak: string;
}

export interface PrayerTimeEntry {
  name: string;
  time: string;
  key: keyof PrayerTimes;
}

export interface ApiPrayerTime {
  day: number;
  hijri: string;
  fajr: number;      // Unix timestamp
  syuruk: number;    // Unix timestamp
  dhuhr: number;     // Unix timestamp
  asr: number;       // Unix timestamp
  maghrib: number;   // Unix timestamp
  isha: number;      // Unix timestamp
}

export interface ApiResponse {
  zone: string;
  year: number;
  month: string;
  month_number: number;
  last_updated: string | null;
  prayers: ApiPrayerTime[];
}

export type PrayerName = 'Subuh' | 'Syuruk' | 'Zohor' | 'Asar' | 'Maghrib' | 'Isyak';

export interface SlideImage {
  id: string;
  url: string;
}

export type NotificationPhase = 
  | 'none'
  | 'countdown-10min'
  | 'azan-alert'
  | 'iqamah-countdown'
  | 'straighten-rows'
  | 'blank-screen';
