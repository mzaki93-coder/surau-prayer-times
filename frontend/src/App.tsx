import { useState } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePrayerTimes } from '@/hooks/use-prayer-times';
import { useCurrentTime } from '@/hooks/use-current-time';
import { useGoogleSheetsImages } from '@/hooks/use-google-sheets-images';
import { PrayerDisplay } from '@/components/PrayerDisplay';
import { SettingsDialog } from '@/components/SettingsDialog';
import { TestEnvironment } from '@/components/TestEnvironment';

// Surau Al-Ittihad Prayer Times Display
export default function App() {
  const { prayerTimes, hijriDate, loading, error } = usePrayerTimes();
  
  // ========================================
  // SLIDESHOW IMAGES - Managed via Google Sheets
  // To configure: Set GOOGLE_SHEET_ID in SettingsDialog
  // Sheet format: Column A should contain image URLs (one per row)
  // First row is treated as header and skipped
  // ========================================
  const googleSheetId = localStorage.getItem('google-sheet-id') || undefined;
  const { images } = useGoogleSheetsImages({ 
    sheetId: googleSheetId,
    refreshInterval: 60000 // Refresh every 60 seconds
  });
  // ========================================
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const currentTime = useCurrentTime(false);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-white">Surau Al-Ittihad</div>
          <div className="text-xl text-gray-400">Memuatkan waktu solat...</div>
        </div>
      </div>
    );
  }

  if (error || !prayerTimes) {
    return (
      <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl font-bold text-red-400">Ralat</div>
          <div className="text-xl text-gray-400">
            {error || 'Gagal memuatkan waktu solat'}
          </div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Cuba Semula
          </Button>
        </div>
      </div>
    );
  }

  if (isTestMode) {
    return (
      <TestEnvironment
        onExit={() => setIsTestMode(false)}
        images={images}
        prayerTimes={prayerTimes}
        hijriDate={hijriDate}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Settings Button */}
      <Button
        onClick={() => setSettingsOpen(true)}
        className="absolute top-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white border border-gray-600 shadow-lg"
        size="icon"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Main Display */}
      <PrayerDisplay
        prayerTimes={prayerTimes}
        hijriDate={hijriDate}
        images={images}
        currentTime={currentTime}
        isTestMode={false}
      />

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onEnterTestMode={() => setIsTestMode(true)}
      />
    </div>
  );
}
