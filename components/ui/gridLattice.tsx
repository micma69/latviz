import { useState } from "react";

interface SquareGridProps {
  rows?: number;
  cols?: number;
  rowsExpanded?: number;
  colsExpanded?: number;
  fullRows?: number;
  fullCols?: number;
  size?: number;
  color?: string;
  colorData?: number[];
  showValues?: boolean;
  base?: number;
  onClick?: () => void;
  // Tooltip props for the whole grid
  tooltipTitle?: string;
  tooltipDescription?: string;
  tooltipDetails?: string;
  showTooltip?: boolean;
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
  fullRows = rows,
  fullCols = cols,
  size = 20,
  color = "#bac0cd5b",
  colorData,
  showValues = false,
  base = 256,
  onClick,
  tooltipTitle = "insert popup title",
  tooltipDescription = "short desc? what the numbers are probs",
  tooltipDetails = "how to make",
  showTooltip = true,
}: SquareGridProps) {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setHovered(true);
    if (showTooltip) {
      const rect = event.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: rect.right + 10,
        y: rect.top,
      });
      setShowInfoCard(true);
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setShowInfoCard(false);
  };

  // Calculate statistics for the tooltip
  const values = data?.filter(v => v !== undefined) || [];
  const minValue = values.length ? Math.min(...values) : null;
  const maxValue = values.length ? Math.max(...values) : null;
  const avgValue = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 8, position: "relative" }}>
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${activeCols}, ${effectiveSize}px)`,
          gap: "4px",
          cursor: canExpand ? "pointer" : onClick ? "pointer" : "default",
          position: "relative",
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
                transform: hovered ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.15s ease",
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

      {/* Info Card for the entire grid */}
      {showTooltip && showInfoCard && (
        <div
          style={{
            position: "fixed",
            left: mousePosition.x,
            top: mousePosition.y,
            backgroundColor: "white",
            borderLeft: "4px solid #3498db",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            zIndex: 1000,
            width: "320px",
            pointerEvents: "none",
            animation: "slideIn 0.2s ease",
          }}
        >
          <h3 style={{ margin: "0 0 8px 0", color: "#2c3e50", fontSize: "1.1rem" }}>
            {tooltipTitle}
          </h3>
          
          <p style={{ color: "#7f8c8d", fontSize: "0.85rem", marginBottom: "12px" }}>
            {tooltipDescription}
          </p>
          
          <div style={{ margin: "10px 0" }}>
            <strong style={{ display: "block", marginBottom: "4px", color: "#2c3e50" }}>
              Details:
            </strong>
            <p style={{ margin: 0, lineHeight: "1.4", fontSize: "0.85rem" }}>
              {tooltipDetails}
            </p>
          </div>
          
          <div style={{ 
            marginTop: "10px", 
            paddingTop: "8px", 
            borderTop: "1px solid #ecf0f1" 
          }}>
          </div>

          {/* Grid dimensions info */}
          <div style={{ 
            marginTop: "10px", 
            fontSize: "0.7rem", 
            color: "#95a5a6",
            textAlign: "right"
          }}>
            {fullRows}×{fullCols}
          </div>
        </div>
      )}

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
          {expanded ? "Collapse" : "Expand"}
        </button>
      )}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}