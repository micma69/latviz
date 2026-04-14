import { useState } from "react";

interface SquareGridProps {
  rows?: number;
  cols?: number;
  rowsExpanded?: number;
  colsExpanded?: number;
  size?: number;
  color?: string;
  colorData?: number[];
  showValues?: boolean;
  base?: number;
  onClick?: () => void;
}

const getColor = (value: number, base: number) => {
  const hue = (value / (base - 1)) * 240;
  const saturation = 80;
  const lightness = 40 + (value / (base - 1)) * 40;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const getLabelColor = (value: number, base: number) => {
  const lightness = 40 + (value / (base - 1)) * 40;
  return lightness > 60 ? "#000000aa" : "#ffffffcc";
};

export default function SquareGrid({
  rows = 8,
  cols = 8,
  rowsExpanded,
  colsExpanded,
  size = 20,
  color = "#3b6fe8",
  colorData,
  showValues = false,
  base = 256,
  onClick,
}: SquareGridProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const canExpand = rowsExpanded !== undefined || colsExpanded !== undefined;

  const activeRows = expanded ? (rowsExpanded ?? rows) : rows;
  const activeCols = expanded ? (colsExpanded ?? cols) : cols;

  const total = activeRows * activeCols;
  const data = colorData?.slice(0, total);
  const effectiveSize = showValues ? Math.max(size, 16) : size;

  const handleClick = () => {
    if (canExpand) setExpanded((prev) => !prev);
    onClick?.();
  };

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 8 }}>
      <div
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${activeCols}, ${effectiveSize}px)`,
          cursor: canExpand ? "pointer" : onClick ? "pointer" : "default",
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const value = data?.[i];
          const squareColor = value != null ? getColor(value, base) : color;
          const labelColor = value != null ? getLabelColor(value, base) : "#ffffffcc";
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

      {canExpand && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            alignSelf: "flex-start",
            fontSize: 11,
            padding: "2px 8px",
            cursor: "pointer",
          }}
        >
        </button>
      )}
    </div>
  );
}