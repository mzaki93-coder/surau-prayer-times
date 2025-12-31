import { format } from 'date-fns';

interface BlankScreenProps {
  currentTime: Date;
}

export function BlankScreen({ currentTime }: BlankScreenProps) {
  const timeString = format(currentTime, 'h:mm:ss a');

  return (
    <div className="w-full h-full bg-black relative">
      {/* Minimalist clock in bottom-left corner */}
      <div className="absolute bottom-8 left-8">
        <div className="text-white/80 text-2xl font-light tracking-wider">
          {timeString}
        </div>
      </div>
    </div>
  );
}
