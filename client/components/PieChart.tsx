import { useMemo } from "react";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  className?: string;
}

export function PieChart({ data, size = 120, className }: PieChartProps) {
  const { segments, total } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const segments = data.map((item) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      currentAngle += angle;

      return {
        ...item,
        percentage,
        angle,
        startAngle,
        endAngle: currentAngle,
      };
    });

    return { segments, total };
  }, [data]);

  const radius = size / 2 - 2;
  const center = size / 2;

  const createPath = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      center,
      center,
      "L",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  if (total === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">No data</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <svg width={size} height={size} className="drop-shadow-sm">
        {segments.map((segment, index) => (
          <path
            key={index}
            d={createPath(segment.startAngle, segment.endAngle)}
            fill={segment.color}
            stroke="white"
            strokeWidth="2"
            className="hover:opacity-80 transition-opacity"
          />
        ))}
      </svg>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {segments.map((segment, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: segment.color }}
              ></div>
              <span className="font-medium">{segment.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">
                ₹{segment.value.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
