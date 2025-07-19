import { useMemo } from "react";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface ModernPieChartProps {
  data: PieChartData[];
  size?: number;
  className?: string;
  title?: string;
}

export function ModernPieChart({
  data,
  size = 200,
  className,
  title,
}: ModernPieChartProps) {
  const { segments, total } = useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const segments = data.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const angle = total > 0 ? (item.value / total) * 360 : 0;
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

  const radius = size / 2 - 4;
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

  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius * 0.7;
    return polarToCartesian(center, center, labelRadius, midAngle);
  };

  if (total === 0) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div
          className="flex items-center justify-center bg-muted/30 rounded-full mb-4"
          style={{ width: size, height: size }}
        >
          <p className="text-sm text-muted-foreground">No data</p>
        </div>
        {title && <h3 className="font-semibold text-center">{title}</h3>}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && <h3 className="font-semibold mb-4 text-center">{title}</h3>}

      {/* Pie Chart */}
      <div className="relative mb-6">
        <svg width={size} height={size} className="drop-shadow-lg">
          {/* Chart segments */}
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={createPath(segment.startAngle, segment.endAngle)}
                fill={segment.color}
                stroke="rgb(24, 24, 27)"
                strokeWidth="3"
                className="hover:opacity-90 transition-all duration-200 cursor-pointer"
                style={{
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                }}
              />
              {/* Percentage labels on chart */}
              {segment.percentage > 8 && (
                <text
                  x={getLabelPosition(segment.startAngle, segment.endAngle).x}
                  y={getLabelPosition(segment.startAngle, segment.endAngle).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white font-semibold text-sm"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
                >
                  {segment.percentage.toFixed(0)}%
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-sm">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-card-foreground truncate">
                {segment.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total amount display */}
      <div className="mt-4 text-center">
        <div className="text-2xl font-bold text-card-foreground">
          ₹{total.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">Total Spending</div>
      </div>
    </div>
  );
}
