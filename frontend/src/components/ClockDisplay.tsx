import { useEffect, useState } from 'react';

interface ClockDisplayProps {
  currentTime: Date;
}

export function ClockDisplay({ currentTime }: ClockDisplayProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;

    const timeString = `${hours12.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;

    setTime(timeString);
  }, [currentTime]);

  return (
    <div className="text-center">
      <div className="text-5xl font-bold text-white tracking-wider font-mono">
        {time}
      </div>
    </div>
  );
}
