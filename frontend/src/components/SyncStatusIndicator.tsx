import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SyncStatusIndicatorProps {
  isSyncing: boolean;
  isOnline: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  onForceSync: () => void;
  className?: string;
}

export function SyncStatusIndicator({
  isSyncing,
  isOnline,
  lastSyncTime,
  syncError,
  onForceSync,
  className,
}: SyncStatusIndicatorProps) {
  const getStatusIcon = () => {
    if (isSyncing) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    if (syncError) {
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
    if (isOnline) {
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    }
    return <CloudOff className="w-4 h-4 text-gray-400" />;
  };

  const getStatusText = () => {
    if (isSyncing) {
      return 'Menyegerakkan...';
    }
    if (syncError) {
      return 'Ralat penyegerakan';
    }
    if (isOnline && lastSyncTime) {
      const now = new Date();
      const diff = Math.floor((now.getTime() - lastSyncTime.getTime()) / 1000);
      if (diff < 60) {
        return 'Disegerakkan baru-baru ini';
      }
      return `Disegerakkan ${diff} saat lalu`;
    }
    if (isOnline) {
      return 'Dalam talian';
    }
    return 'Luar talian';
  };

  const getStatusColor = () => {
    if (syncError) return 'text-red-400';
    if (isOnline) return 'text-emerald-400';
    return 'text-gray-400';
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className={cn('text-sm', getStatusColor())}>
          {getStatusText()}
        </span>
      </div>
      
      {!isSyncing && (
        <Button
          onClick={onForceSync}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs hover:bg-gray-800"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          Segerakkan
        </Button>
      )}
    </div>
  );
}
