import { useState, useEffect, useCallback, useRef } from 'react';
import { SlideImage } from '@/types/prayer';
import { useGetBackendUrl } from './use-get-backend-url';

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
const SYNC_INTERVAL = 5000; // 5 seconds
const RETRY_DELAY = 10000; // 10 seconds on error

export function useImageSync(): ImageSyncResult {
  const backendUrl = useGetBackendUrl();
  const [images, setImagesState] = useState<SlideImage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
    isOnline: false,
    version: 0,
  });

  const syncIntervalRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);
  const lastKnownVersionRef = useRef<number>(0);

  // Check if backend is available
  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }, [backendUrl]);

  // Fetch images from backend
  const fetchImagesFromBackend = useCallback(async (): Promise<SlideImage[] | null> => {
    try {
      const response = await fetch(`${backendUrl}/api/images`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      lastKnownVersionRef.current = data.version || 0;
      return data.images || [];
    } catch (error) {
      console.error('Failed to fetch images from backend:', error);
      return null;
    }
  }, [backendUrl]);

  // Push images to backend
  const pushImagesToBackend = useCallback(async (imagesToPush: SlideImage[]): Promise<boolean> => {
    try {
      const response = await fetch(`${backendUrl}/api/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imagesToPush }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      lastKnownVersionRef.current = data.version || 0;
      return true;
    } catch (error) {
      console.error('Failed to push images to backend:', error);
      return false;
    }
  }, [backendUrl]);

  // Check for updates from backend
  const checkForUpdates = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    try {
      const response = await fetch(`${backendUrl}/api/images/version`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return;

      const data = await response.json();
      const serverVersion = data.version || 0;

      // If server version is newer, fetch updated images
      if (serverVersion > lastKnownVersionRef.current) {
        const updatedImages = await fetchImagesFromBackend();
        if (updatedImages && isMountedRef.current) {
          setImagesState(updatedImages);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
          localStorage.setItem(VERSION_KEY, serverVersion.toString());
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  }, [backendUrl, fetchImagesFromBackend]);

  // Sync images (bidirectional)
  const syncImages = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      // Check if backend is available
      const isOnline = await checkBackendHealth();

      if (!isOnline) {
        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          isOnline: false,
          syncError: 'Backend tidak tersedia',
        }));
        return;
      }

      // Fetch images from backend
      const backendImages = await fetchImagesFromBackend();

      if (backendImages === null) {
        throw new Error('Failed to fetch from backend');
      }

      // Get local images
      const localImages = images;

      // If backend is empty but we have local images, push them
      if (backendImages.length === 0 && localImages.length > 0) {
        await pushImagesToBackend(localImages);
      }
      // If backend has images, use them
      else if (backendImages.length > 0) {
        setImagesState(backendImages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backendImages));
      }

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        isOnline: true,
        syncError: null,
        version: lastKnownVersionRef.current,
      }));
    } catch (error) {
      console.error('Sync error:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        isOnline: false,
        syncError: error instanceof Error ? error.message : 'Ralat tidak diketahui',
      }));
    }
  }, [images, checkBackendHealth, fetchImagesFromBackend, pushImagesToBackend]);

  // Set images (with sync)
  const setImages = useCallback(async (newImages: SlideImage[]) => {
    setImagesState(newImages);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newImages));

    // Try to push to backend
    const isOnline = await checkBackendHealth();
    if (isOnline) {
      await pushImagesToBackend(newImages);
    }
  }, [checkBackendHealth, pushImagesToBackend]);

  // Force sync
  const forceSync = useCallback(async () => {
    await syncImages();
  }, [syncImages]);

  // Initial sync on mount
  useEffect(() => {
    isMountedRef.current = true;
    syncImages();

    return () => {
      isMountedRef.current = false;
    };
  }, [syncImages]);

  // Set up polling for updates
  useEffect(() => {
    const startPolling = () => {
      syncIntervalRef.current = window.setInterval(() => {
        checkForUpdates();
      }, SYNC_INTERVAL);
    };

    startPolling();

    return () => {
      if (syncIntervalRef.current !== null) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [checkForUpdates]);

  // Listen to storage events (for same-device sync across tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updatedImages = JSON.parse(e.newValue);
          setImagesState(updatedImages);
        } catch (error) {
          console.error('Failed to parse storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    images,
    setImages,
    syncState,
    forceSync,
  };
}
