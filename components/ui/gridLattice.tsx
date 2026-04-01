import { useState } from "react";

interface SquareGridProps {
  rows?: number;
  cols?: number;
  size?: number;
  color?: string;
  colorData?: number[];
  showValues?: boolean;
  onClick?: () => void;
}

const getColor = (value: number) => {
  const hue = (value / 255) * 240;
  const saturation = 80;
  const lightness = 40 + (value / 255) * 40;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const getLabelColor = (value: number) => {
  const lightness = 40 + (value / 255) * 40;
  return lightness > 60 ? "#000000aa" : "#ffffffcc";
};

export default function SquareGrid({
  rows = 8,
  cols = 8,
  size = 20,
  color = "#3b6fe8",
  colorData,
  showValues = false,
  onClick,
}: SquareGridProps) {
  const [hovered, setHovered] = useState(false);
  const total = rows * cols;
  const data = colorData?.slice(0, total);
  const effectiveSize = showValues ? Math.max(size, 16) : size;
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${cols}, ${effectiveSize}px)` }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const value = data?.[i];
        const squareColor = value != null ? getColor(value) : color;
        const labelColor = value != null ? getLabelColor(value) : "#ffffffcc";

        return (
          <div
            key={i}
            style={{
              width: effectiveSize,
              height: effectiveSize,
              backgroundColor: squareColor,
              borderRadius: 3,
              transform: hovered ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.15s ease",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {showValues && value != null && (
              <span
                style={{
                  fontSize: Math.max(effectiveSize * 0.3, 8),
                  fontWeight: 600,
                  color: labelColor,
                  lineHeight: 1,
                  userSelect: "none",
                  fontFamily: "monospace",
                }}
              >
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}