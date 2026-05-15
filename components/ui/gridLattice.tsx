import { useState, useMemo } from "react";

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
  displayData?: number[];
  showValues?: boolean;
  base?: number;
  onClick?: () => void;
  tooltipTitle?: string;
  tooltipDescription?: string;
  tooltipDetails?: string;
  showTooltip?: boolean;
}

const getColor = (value: number, min: number, max: number) => {
  let normalized;
  const range = max - min;
  
  if (range === 1) {
    // Binary case should not reach here - handled separately
    normalized = value === min ? 0.2 : 0.8;
  } else if (range === 2) {
    normalized = (value - min) / range;
    normalized = 0.1 + normalized * 0.8;
  } else {
    normalized = range === 0 ? 0.5 : (value - min) / range;
  }
  
  const hue = normalized * 240;
  const saturation = 80;
  const lightness = 40 + normalized * 40;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const getLabelColor = (value: number, min: number, max: number) => {
  const range = max - min;
  
  let normalized;
  if (range === 1) {
    normalized = value === min ? 0.2 : 0.8;
  } else if (range === 2) {
    normalized = (value - min) / range;
    normalized = 0.1 + normalized * 0.8;
  } else {
    normalized = range === 0 ? 0.5 : (value - min) / range;
  }
  
  const lightness = 40 + normalized * 40;
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
  displayData,
  showValues = false,
  base,
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
  const colorDataSlice = colorData?.slice(0, total);
  const displayDataSlice = displayData?.slice(0, total);
  
  const { min, max, range } = useMemo(() => {
    if (!colorData || colorData.length === 0) {
      return { min: 0, max: (base ?? 256) - 1, range: (base ?? 256) - 1 };
    }
    
    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const val of colorData) {
      if (val < minVal) minVal = val;
      if (val > maxVal) maxVal = val;
    }
    if (minVal === maxVal) {
      return { min: minVal, max: maxVal, range: 0 };
    }
    return { min: minVal, max: maxVal, range: maxVal - minVal };
  }, [colorData, base]);
  
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

  const values = displayDataSlice?.filter(v => v !== undefined) || colorDataSlice?.filter(v => v !== undefined) || [];
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
          const colorValue = colorDataSlice?.[i];
          const displayValue = displayDataSlice?.[i] ?? colorValue;
          const hasValue = colorValue !== undefined;
          
          let squareColor;
          if (!hasValue) {
            squareColor = "#f0f0f0";
          } else if (range === 0) {
            // All values are the same (e.g., all zeros)
            squareColor = "#b81414";
          } else if (range === 1) {
            // Binary data (0 and 1)
            squareColor = colorValue === min ? "#b81414" : "#a3a3f5";
          } else {
            // Normal gradient
            squareColor = getColor(colorValue, min, max);
          }
          
          let labelColor = "#ffffffcc";
          if (hasValue && range === 0) {
            labelColor = "#ffffff";
          } else if (hasValue && range === 1) {
            labelColor = colorValue === min ? "#ffffff" : "#000000";
          } else if (hasValue) {
            labelColor = getLabelColor(colorValue, min, max);
          }
          
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
                opacity: hasValue ? 1 : 0.5,
              }}
            >
              {showValues && hasValue && displayValue !== undefined && (
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
                  {displayValue}
                </span>
              )}
              {showValues && !hasValue && (
                <span
                  style={{
                    fontSize: Math.max(effectiveSize * 0.3, 8),
                    color: "#999",
                    lineHeight: 1,
                    userSelect: "none",
                    fontFamily: "monospace",
                  }}
                >
                  —
                </span>
              )}
            </div>
          );
        })}
      </div>

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
          
          {minValue !== null && maxValue !== null && (
            <div style={{ 
              marginTop: "10px", 
              paddingTop: "8px", 
              borderTop: "1px solid #ecf0f1",
              fontSize: "0.75rem",
              color: "#666"
            }}>
              <div>Range: {minValue} → {maxValue}</div>
              <div>Average: {avgValue}</div>
              {range === 0 && <div>All values identical (showing red)</div>}
              {range === 1 && <div>Binary data: {min}=red, {max}=light blue</div>}
            </div>
          )}

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