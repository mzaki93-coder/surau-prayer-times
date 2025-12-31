import { useState, useEffect } from 'react';
import { PrayerTimes, NotificationPhase, PrayerName } from '@/types/prayer';
import { SlideImage } from '@/types/prayer';
import {
  getNextPrayer,
  parseTimeToMinutes,
  getCurrentTimeInMinutes,
  playBeepSequence,
  PRAYER_ORDER,
} from '@/lib/prayer-utils';
import { ClockDisplay } from './ClockDisplay';
import { DateDisplay } from './DateDisplay';
import { PrayerTimesList } from './PrayerTimesList';
import { Slideshow } from './Slideshow';
import { CountdownDisplay } from './CountdownDisplay';
import { AlertDisplay } from './AlertDisplay';
import { BlankScreen } from './BlankScreen';
import { StraightenRowsDisplay } from './StraightenRowsDisplay';

interface PrayerDisplayProps {
  prayerTimes: PrayerTimes;
  hijriDate: string;
  images: SlideImage[];
  currentTime: Date;
  isTestMode?: boolean;
}

export function PrayerDisplay({
  prayerTimes,
  hijriDate,
  images,
  currentTime,
  isTestMode = false,
}: PrayerDisplayProps) {
  const [notificationPhase, setNotificationPhase] = useState<NotificationPhase>('none');
  const [currentPrayer, setCurrentPrayer] = useState<PrayerName | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [hasPlayedBeep, setHasPlayedBeep] = useState(false);

  useEffect(() => {
    const currentMinutes = getCurrentTimeInMinutes(currentTime);
    const currentSeconds = currentTime.getSeconds();

    // Check each prayer time
    for (const prayer of PRAYER_ORDER) {
      const prayerMinutes = parseTimeToMinutes(prayerTimes[prayer.key]);
      const minutesUntil = prayerMinutes - currentMinutes;
      const secondsUntil = minutesUntil * 60 - currentSeconds;

      // 10-minute countdown phase - BUG FIX #2: Start at exactly 10 minutes (600 seconds)
      if (secondsUntil > 0 && secondsUntil <= 600 && notificationPhase === 'none') {
        setNotificationPhase('countdown-10min');
        setCurrentPrayer(prayer.name);
        setCountdown(secondsUntil);
        setHasPlayedBeep(false);
        return;
      }

      // Update countdown during 10-minute phase
      if (notificationPhase === 'countdown-10min' && currentPrayer === prayer.name) {
        if (secondsUntil > 0) {
          setCountdown(secondsUntil);
        } else if (secondsUntil === 0) {
          // Transition to azan alert
          setNotificationPhase('azan-alert');
          setCountdown(60);
          setHasPlayedBeep(false);
          return;
        }
      }

      // At prayer time - trigger alert
      if (minutesUntil === 0 && currentSeconds === 0 && notificationPhase !== 'azan-alert') {
        setNotificationPhase('azan-alert');
        setCurrentPrayer(prayer.name);
        setCountdown(60);
        setHasPlayedBeep(false);
        return;
      }

      // Play beep sequence during azan alert
      if (notificationPhase === 'azan-alert' && !hasPlayedBeep && currentPrayer === prayer.name) {
        playBeepSequence(5, 2000);
        setHasPlayedBeep(true);
      }

      // Update azan alert countdown - BUG FIX #4: Track elapsed time properly
      if (notificationPhase === 'azan-alert' && currentPrayer === prayer.name) {
        const elapsedSeconds = (currentMinutes - prayerMinutes) * 60 + currentSeconds;
        const remainingSeconds = 60 - elapsedSeconds;
        
        if (remainingSeconds > 0) {
          setCountdown(remainingSeconds);
        } else {
          // BUG FIX #3 & #4: After azan alert, check if Syuruk or regular prayer
          if (prayer.name === 'Syuruk') {
            // Syuruk: return to normal immediately after 1 minute
            setNotificationPhase('none');
            setCurrentPrayer(null);
            setHasPlayedBeep(false);
          } else {
            // Regular prayer: start iqamah countdown (14 minutes)
            setNotificationPhase('iqamah-countdown');
            setCountdown(14 * 60);
            setHasPlayedBeep(false);
          }
          return;
        }
      }

      // Iqamah countdown phase (only for non-Syuruk prayers) - 14 minutes
      if (notificationPhase === 'iqamah-countdown' && currentPrayer === prayer.name) {
        const elapsedSeconds = (currentMinutes - prayerMinutes) * 60 + currentSeconds - 60;
        const remainingSeconds = 840 - elapsedSeconds; // 14 minutes = 840 seconds
        
        if (remainingSeconds > 0) {
          setCountdown(remainingSeconds);
        } else {
          // After iqamah countdown, show "Lurus dan rapatkan saf" (1 minute)
          setNotificationPhase('straighten-rows');
          setCountdown(60);
          setHasPlayedBeep(false);
          return;
        }
      }

      // Straighten rows phase - 1 minute (after 14-minute iqamah)
      if (notificationPhase === 'straighten-rows' && currentPrayer === prayer.name) {
        const elapsedSeconds = (currentMinutes - prayerMinutes) * 60 + currentSeconds - 60 - 840; // 60s azan + 840s iqamah
        const remainingSeconds = 60 - elapsedSeconds; // 1 minute straighten rows
        
        if (remainingSeconds > 0) {
          setCountdown(remainingSeconds);
        } else {
          // After straighten rows, start blank screen (9 minutes)
          setNotificationPhase('blank-screen');
          setCountdown(9 * 60);
          setHasPlayedBeep(false);
          return;
        }
      }

      // Blank screen phase - 9 minutes (after 1-minute straighten rows)
      if (notificationPhase === 'blank-screen' && currentPrayer === prayer.name) {
        const elapsedSeconds = (currentMinutes - prayerMinutes) * 60 + currentSeconds - 60 - 840 - 60; // 60s azan + 840s iqamah + 60s straighten
        const remainingSeconds = 540 - elapsedSeconds; // 9 minutes blank screen
        
        if (remainingSeconds > 0) {
          setCountdown(remainingSeconds);
        } else {
          // After blank screen, return to normal
          setNotificationPhase('none');
          setCurrentPrayer(null);
          setHasPlayedBeep(false);
          return;
        }
      }
    }
  }, [currentTime, prayerTimes, notificationPhase, currentPrayer, hasPlayedBeep]);

  // Render based on notification phase
  const renderRightPanel = () => {
    switch (notificationPhase) {
      case 'countdown-10min':
        return currentPrayer ? (
          <CountdownDisplay seconds={countdown} prayerName={currentPrayer} type="10min" />
        ) : null;

      case 'azan-alert':
        return currentPrayer ? (
          <AlertDisplay
            prayerName={currentPrayer}
            type={currentPrayer === 'Syuruk' ? 'syuruk' : 'azan'}
          />
        ) : null;

      case 'iqamah-countdown':
        return currentPrayer ? (
          <CountdownDisplay seconds={countdown} prayerName={currentPrayer} type="iqamah" />
        ) : null;

      case 'straighten-rows':
        return <StraightenRowsDisplay countdown={countdown} />;

      case 'blank-screen':
        return <BlankScreen currentTime={currentTime} />;

      default:
        return (
          <Slideshow
            images={images}
            prayerTimes={prayerTimes}
            currentTime={currentTime}
            isPaused={notificationPhase !== 'none'}
          />
        );
    }
  };

  // Check if we're in blank screen or straighten rows phase (hide left panel)
  const isBlankScreen = notificationPhase === 'blank-screen' || notificationPhase === 'straighten-rows';

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex overflow-hidden">
      {/* Left Panel - 2/5 width */}
      {!isBlankScreen ? (
        <div className="w-2/5 h-full flex flex-col p-4 space-y-3 overflow-hidden">
          {/* Surau Name Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-emerald-400 tracking-wide">
              Surau Al-Ittihad
            </h1>
          </div>
          
          <ClockDisplay currentTime={currentTime} />
          <DateDisplay currentTime={currentTime} hijriDate={hijriDate} />
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
            <PrayerTimesList prayerTimes={prayerTimes} currentTime={currentTime} />
          </div>
        </div>
      ) : (
        // Blank left panel during blank screen phase - no padding or borders
        <div className="w-2/5 h-full bg-black" />
      )}

      {/* Right Panel - 3/5 width */}
      <div className="w-3/5 h-full bg-gray-800/50 backdrop-blur-sm">
        {renderRightPanel()}
      </div>
    </div>
  );
}
