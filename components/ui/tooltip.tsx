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
    </div>
  );
}