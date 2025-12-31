import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, ExternalLink } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnterTestMode: () => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  onEnterTestMode,
}: SettingsDialogProps) {
  const [sheetId, setSheetId] = useState(() => localStorage.getItem('google-sheet-id') || '1a-9za-kelQxd_Urm1nkPFVhBq5Tl3_GDBTWGBSSHDRI');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (sheetId.trim()) {
      localStorage.setItem('google-sheet-id', sheetId.trim());
    } else {
      localStorage.removeItem('google-sheet-id');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    // Reload to apply changes
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl">Tetapan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Google Sheets Configuration */}
          <div className="space-y-3">
            <Label htmlFor="sheet-id" className="text-base font-semibold">
              Google Sheet ID untuk Imej
            </Label>
            <p className="text-sm text-gray-400">
              Masukkan ID Google Sheet untuk mengurus imej slideshow. Kosongkan untuk gunakan imej lalai.
            </p>
            <div className="space-y-2">
              <Input
                id="sheet-id"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                placeholder="Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Button
                onClick={handleSave}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saved ? 'Disimpan!' : 'Simpan & Muat Semula'}
              </Button>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>📋 Format Sheet: Kolum A = URL imej (satu per baris)</p>
              <p>🔗 Pastikan sheet adalah "Anyone with the link can view"</p>
              <Button
                variant="link"
                className="h-auto p-0 text-blue-400 hover:text-blue-300 text-xs"
                onClick={() => window.open('https://docs.google.com/spreadsheets', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Buka Google Sheets
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-700" />

          {/* Test Mode Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Persekitaran Ujian</h3>
            <p className="text-sm text-gray-400">
              Masuk ke persekitaran ujian untuk menguji semua ciri dengan kawalan masa manual.
            </p>
            <Button
              onClick={() => {
                onEnterTestMode();
                onOpenChange(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 h-10"
            >
              Masuk Persekitaran Ujian
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
