interface ProportionalCircleProps {
  value: number;
  maxValue: number;
  label?: string;
  unit?: string;
  size?: number;
  color?: string;
  showValue?: boolean;
}

export default function ProportionalCircle({
  value,
  maxValue,
  label,
  unit = '',
  size = 200,
  color = '#8AFD81',
  showValue = true,
}: ProportionalCircleProps) {
  // Calculer la taille proportionnelle (min 80px, max = size)
  const minSize = 80;
  const maxSize = size;
  const percentage = Math.min((value / maxValue) * 100, 100);
  const circleSize = minSize + ((maxSize - minSize) * (percentage / 100));
  const radius = circleSize / 2;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: circleSize, height: circleSize }}>
        <svg width={circleSize} height={circleSize} className="transform">
          {/* Cercle de fond */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius - 2}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
          />
          {/* Cercle principal */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius - 2}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeOpacity="0.3"
          />
          {/* Cercle intérieur avec gradient */}
          <defs>
            <radialGradient id={`gradient-${Math.round(value * 100)}`}>
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius - 8}
            fill={`url(#gradient-${Math.round(value * 100)})`}
          />
        </svg>
        {/* Texte central */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-[#0b1120]" style={{ fontSize: `${circleSize * 0.15}px` }}>
              {value.toFixed(1)}
            </span>
            {unit && (
              <span className="text-[#64748b] text-xs font-medium" style={{ fontSize: `${circleSize * 0.08}px` }}>
                {unit}
              </span>
            )}
          </div>
        )}
      </div>
      {label && (
        <p className="text-xs text-[#64748b] uppercase tracking-wider mt-3 text-center font-medium">
          {label}
        </p>
      )}
    </div>
  );
}

