import { useMemo } from "react";

interface BarChartData {
  name: string;
  value: number;
  color: string;
}

interface BarChartProps {
  data: BarChartData[];
  height?: number;
  className?: string;
  title?: string;
}

export function BarChart({
  data,
  height = 200,
  className,
  title,
}: BarChartProps) {
  const { maxValue, normalizedData } = useMemo(() => {
    const maxValue = Math.max(...data.map((item) => item.value));
    const normalizedData = data.map((item) => ({
      ...item,
      percentage: maxValue > 0 ? (item.value / maxValue) * 100 : 0,
    }));
    return { maxValue, normalizedData };
  }, [data]);

  if (data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="flex items-end justify-center gap-2 mb-4">
            <div className="w-8 h-16 bg-muted rounded"></div>
            <div className="w-8 h-24 bg-muted rounded"></div>
            <div className="w-8 h-12 bg-muted rounded"></div>
          </div>
          <p className="text-sm text-muted-foreground">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h4 className="font-medium mb-4">{title}</h4>}

      <div
        className="flex items-end justify-center gap-3 mb-4"
        style={{ height: height - 60 }}
      >
        {normalizedData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 flex-1 max-w-16"
          >
            <div className="text-xs font-semibold text-center">
              ₹{(item.value / 1000).toFixed(1)}K
            </div>
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80 relative group"
              style={{
                height: `${item.percentage}%`,
                backgroundColor: item.color,
                minHeight: item.value > 0 ? "8px" : "2px",
              }}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {item.name}: ₹{item.value.toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center font-medium truncate w-full">
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
