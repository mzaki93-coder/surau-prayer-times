import { useState, useEffect } from 'react';
import { SlideImage } from '@/types/prayer';

interface SyncState {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncError: string | null;
  isOnline: boolean;
  version: number;
}

interface ImageSyncResult {
  images: SlideImage[];
  setImages: (images: SlideImage[]) => void;
  syncState: SyncState;
  forceSync: () => Promise<void>;
}

const STORAGE_KEY = 'slideshow-images';
const VERSION_KEY = 'slideshow-images-version';

/**
 * Simplified image sync hook that works without backend
 * Uses only localStorage for persistence
 * Syncs across tabs on the same device
 */
export function useImageSync(): ImageSyncResult {
  const [images, setImagesState] = useState<SlideImage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading images from localStorage:', error);
      return [];
    }
  });

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
    isOnline: true, // Always online in frontend-only mode
    version: 0,
  });

  // Save to localStorage whenever images change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
      const version = Date.now();
      localStorage.setItem(VERSION_KEY, version.toString());
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        syncError: null,
        isOnline: true,
        version,
      }));
    } catch (error) {
      console.error('Error saving images to localStorage:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: 'Failed to save images',
        isOnline: false,
      }));
    }
  }, [images]);

  // Listen for storage events (sync across tabs on same device)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newImages = JSON.parse(e.newValue);
          setImagesState(newImages);
          setSyncState(prev => ({
            ...prev,
            lastSyncTime: new Date(),
            syncError: null,
            isOnline: true,
          }));
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setImages = (newImages: SlideImage[]) => {
    setImagesState(newImages);
  };

  const forceSync = async () => {
    // In frontend-only mode, just update the sync time
    setSyncState(prev => ({
      ...prev,
      lastSyncTime: new Date(),
      syncError: null,
      isOnline: true,
    }));
  };

  return {
    images,
    setImages,
    syncState,
    forceSync,
  };
}
