interface StraightenRowsDisplayProps {
  countdown: number;
}

export function StraightenRowsDisplay({ countdown }: StraightenRowsDisplayProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white tracking-wide">
          Lurus dan Rapatkan Saf
        </h1>
      </div>
    </div>
  );
}
