import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { PrayerDisplay } from './PrayerDisplay';
import { SlideImage, PrayerTimes } from '@/types/prayer';

interface TestEnvironmentProps {
  onExit: () => void;
  images: SlideImage[];
  prayerTimes: PrayerTimes;
  hijriDate: string;
}

export function TestEnvironment({ onExit, images, prayerTimes, hijriDate }: TestEnvironmentProps) {
  const [testTime, setTestTime] = useState<Date>(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    // Initialize time input with current test time - BUG FIX #5: Include seconds
    const hours = testTime.getHours().toString().padStart(2, '0');
    const minutes = testTime.getMinutes().toString().padStart(2, '0');
    const seconds = testTime.getSeconds().toString().padStart(2, '0');
    setTimeInput(`${hours}:${minutes}:${seconds}`);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTestTime((prev) => {
        const next = new Date(prev);
        next.setSeconds(next.getSeconds() + 1);
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleSetTime = () => {
    if (timeInput) {
      // BUG FIX #5: Parse hours, minutes, and seconds
      const parts = timeInput.split(':').map(Number);
      const hours = parts[0] || 0;
      const minutes = parts[1] || 0;
      const seconds = parts[2] || 0;
      
      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        const newTime = new Date();
        newTime.setHours(hours, minutes, seconds, 0);
        setTestTime(newTime);
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTestTime(new Date());
    // BUG FIX #5: Include seconds in reset
    const hours = new Date().getHours().toString().padStart(2, '0');
    const minutes = new Date().getMinutes().toString().padStart(2, '0');
    const seconds = new Date().getSeconds().toString().padStart(2, '0');
    setTimeInput(`${hours}:${minutes}:${seconds}`);
  };

  return (
    <div className="relative w-full h-screen">
      {/* Test Environment Label */}
      <button
        onClick={onExit}
        className="absolute bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-colors"
      >
        PERSEKITARAN UJIAN - Klik untuk Keluar
      </button>

      {/* Test Controls */}
      <div className="absolute top-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3 shadow-lg">
        <div className="space-y-2">
          <Label htmlFor="testTime" className="text-white text-sm">
            Tetapkan Masa (HH:MM:SS)
          </Label>
          <div className="flex gap-2">
            <Input
              id="testTime"
              type="time"
              step="1"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white w-36"
            />
            <Button
              onClick={handleSetTime}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Set
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            size="sm"
            className={isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Jeda
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Mula
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            size="sm"
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Set Semula
          </Button>
        </div>
      </div>

      {/* Prayer Display */}
      <PrayerDisplay
        prayerTimes={prayerTimes}
        hijriDate={hijriDate}
        images={images}
        currentTime={testTime}
        isTestMode={true}
      />
    </div>
  );
}
