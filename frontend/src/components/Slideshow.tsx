import { useState, useEffect } from 'react';
import { SlideImage } from '@/types/prayer';
import { NextPrayerDisplay } from './NextPrayerDisplay';
import { PrayerTimes } from '@/types/prayer';

interface SlideshowProps {
  images: SlideImage[];
  prayerTimes: PrayerTimes;
  currentTime: Date;
  isPaused?: boolean;
}

export function Slideshow({ images, prayerTimes, currentTime, isPaused = false }: SlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNextPrayerSlide, setIsNextPrayerSlide] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [imageCounter, setImageCounter] = useState(0);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsFading(true);

      setTimeout(() => {
        if (isNextPrayerSlide) {
          // Show image
          setIsNextPrayerSlide(false);
          setCurrentIndex((prev) => (prev + 1) % Math.max(images.length, 1));
          setImageCounter(1);
        } else {
          // Check if we should show next prayer or another image
          const shouldShowNextPrayer = imageCounter >= 2 && Math.random() > 0.5;
          
          if (shouldShowNextPrayer || images.length === 0) {
            setIsNextPrayerSlide(true);
            setImageCounter(0);
          } else {
            setCurrentIndex((prev) => (prev + 1) % images.length);
            setImageCounter((prev) => prev + 1);
          }
        }

        setTimeout(() => setIsFading(false), 100);
      }, 300);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length, isNextPrayerSlide, imageCounter, isPaused]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {isNextPrayerSlide || images.length === 0 ? (
          <NextPrayerDisplay prayerTimes={prayerTimes} currentTime={currentTime} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={images[currentIndex]?.url}
              alt={`Slide ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                console.error('Image failed to load:', images[currentIndex]?.url);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
