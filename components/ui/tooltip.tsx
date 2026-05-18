interface TooltipProps {
  title: string;
  description: string;
  details: string;
  position: { x: number; y: number };
  stats?: {
    min: number | null;
    max: number | null;
    avg: number | null;
    rows: number;
    cols: number;
    range: number;
  };
}

export default function Tooltip({ title, description, details, position, stats }: TooltipProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
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
        {title}
      </h3>
      
      <p style={{ color: "#7f8c8d", fontSize: "0.85rem", marginBottom: "12px" }}>
        {description}
      </p>
      
      <div style={{ margin: "10px 0" }}>
        <strong style={{ display: "block", marginBottom: "4px", color: "#2c3e50" }}>
          Details:
        </strong>
        <p style={{ margin: 0, lineHeight: "1.4", fontSize: "0.85rem" }}>
          {details}
        </p>
      </div>
      
      {stats && (
        <div style={{ 
          marginTop: "10px", 
          paddingTop: "8px", 
          borderTop: "1px solid #ecf0f1",
          fontSize: "0.75rem",
          color: "#666"
        }}>
          <div>Range: {stats.min} → {stats.max}</div>
          <div>Average: {stats.avg}</div>
          {stats.range === 0 && <div>All values identical</div>}
          {stats.range === 1 && <div>Binary data</div>}
        </div>
      )}

      <div style={{ 
        marginTop: "10px", 
        fontSize: "0.7rem", 
        color: "#95a5a6",
        textAlign: "right"
      }}>
        {stats?.rows}×{stats?.cols}
      </div>
    </div>
  );
}