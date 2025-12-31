import { useState, useEffect } from 'react';
import { SlideImage } from '@/types/prayer';

// Default fallback images
const DEFAULT_IMAGES = [
  'https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/599128109_122151056030694568_8821770402187334892_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_ohc=wkAnesiIS8EQ7kNvwHN15bn&_nc_oc=AdlkMjbceDZvoIdPGXw_azFggCNmb3L0GxLOL0qvSG7-PzCUCOV87hfdKqZaFNRJwiY&_nc_zt=23&_nc_ht=scontent-dub4-1.xx&_nc_gid=8zRUUJF-EI6wEhlG8eW7Vw&oh=00_Afkku2hMS0DpSL9ZhDl03DS8y0DkxuND_vJqVPZeua5Emg&oe=695126E8',
  'https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/593522905_122149870832694568_3759298780679005170_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=55OpVP1YCGkQ7kNvwHaRTlL&_nc_oc=AdmKXWtpP1Elo6zfC1dLOqb4xEWKOXcg4KIx4-SA8kuZ7MUSB3MeFbHqif_9bsGcXGo&_nc_zt=23&_nc_ht=scontent-dub4-1.xx&_nc_gid=6L6oRz2MxvAIn4dwqcPVdA&oh=00_AfnE69WQjsMzlGb8LlEGF6c6hh8yYcSaH3nnzG9On_8nGQ&oe=695129A5',
  'https://scontent-dub4-1.xx.fbcdn.net/v/t39.30808-6/594540960_122149870856694568_8077412387366524536_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=KTiDssBooNMQ7kNvwGVKV06&_nc_oc=Adku57rZNG5z0tRGNCMtlTnJn7lviG8VzjKH723xFXz63pTv3F30ctdQ__3c097fnfU&_nc_zt=23&_nc_ht=scontent-dub4-1.xx&_nc_gid=i8FbFvQexUF4Qow7CNS1Bw&oh=00_AfmwvAg0-gEWjj417bgf8tcHCmukJ2Bt6XIig-aMrQUPjg&oe=6951089F',
  'https://scontent.fper9-1.fna.fbcdn.net/v/t39.30808-6/605251469_122151781484694568_1640142620240870071_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gnENByblxIUQ7kNvwFD79pn&_nc_oc=Adn_DT567FZzAqBqWzLf1VYS0Cq_mQFuOZaUjQ4wo2tjz-NG7T7k2OjvjCMv-wEzuns&_nc_zt=23&_nc_ht=scontent.fper9-1.fna&_nc_gid=Div73FOlYZ2fMBr7ddu9SQ&oh=00_AfnwGlZ8HzC8fXfdf3jswFCzgj78xmoatTSi45jl7l-CaA&oe=69555B93',
];

interface UseGoogleSheetsImagesOptions {
  sheetId?: string;
  refreshInterval?: number; // in milliseconds
}

const DEFAULT_SHEET_ID = '1a-9za-kelQxd_Urm1nkPFVhBq5Tl3_GDBTWGBSSHDRI';

export function useGoogleSheetsImages(options: UseGoogleSheetsImagesOptions = {}) {
  const { sheetId = DEFAULT_SHEET_ID, refreshInterval = 60000 } = options; // Default: refresh every 60 seconds
  const [images, setImages] = useState<SlideImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    // If no sheetId is provided, use default images
    if (!sheetId) {
      const defaultSlideImages = DEFAULT_IMAGES.map((url, index) => ({
        id: `default-${index}`,
        url,
      }));
      setImages(defaultSlideImages);
      setLoading(false);
      return;
    }

    try {
      // Google Sheets CSV export URL format
      // The sheet should have image URLs in the first column (Column A)
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
      
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch Google Sheet');
      }

      const csvText = await response.text();
      
      // Parse CSV - split by newlines and filter out empty lines
      const lines = csvText.split('\n').filter(line => line.trim());
      
      // Skip header row if it exists, and extract URLs from first column
      const imageUrls = lines
        .slice(1) // Skip header
        .map(line => {
          // Handle CSV with quotes and commas
          const match = line.match(/^"?([^",]+)"?/);
          return match ? match[1].trim() : line.split(',')[0].trim();
        })
        .filter(url => {
          // Validate URL format
          try {
            new URL(url);
            return true;
          } catch {
            return false;
          }
        });

      if (imageUrls.length === 0) {
        // If no valid URLs found, use defaults
        const defaultSlideImages = DEFAULT_IMAGES.map((url, index) => ({
          id: `default-${index}`,
          url,
        }));
        setImages(defaultSlideImages);
      } else {
        const slideImages = imageUrls.map((url, index) => ({
          id: `sheet-${index}`,
          url,
        }));
        setImages(slideImages);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching images from Google Sheets:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback to default images on error
      const defaultSlideImages = DEFAULT_IMAGES.map((url, index) => ({
        id: `default-${index}`,
        url,
      }));
      setImages(defaultSlideImages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();

    // Set up periodic refresh
    const interval = setInterval(fetchImages, refreshInterval);

    return () => clearInterval(interval);
  }, [sheetId, refreshInterval]);

  return { images, loading, error, refetch: fetchImages };
}
