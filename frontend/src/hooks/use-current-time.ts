import { useState, useEffect } from 'react';

export function useCurrentTime(isTestMode: boolean = false, testTime?: Date) {
  const [currentTime, setCurrentTime] = useState<Date>(
    isTestMode && testTime ? testTime : new Date()
  );

  useEffect(() => {
    if (isTestMode && testTime) {
      setCurrentTime(testTime);
      return;
    }

    if (!isTestMode) {
      // Update every second in live mode
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTestMode, testTime]);

  return currentTime;
}
