interface SquareGridProps {
  rows?: number;
  cols?: number;
  size?: number;
  onClick?: () => void;
}

export default function SquareGrid({
  rows = 8,
  cols = 8,
  size = 20,
  onClick
}: SquareGridProps) {
  const total = rows * cols;

  return (
    <div
      onClick={onClick}
      className="grid gap-1 cursor-pointer"
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: size,
            height: size,
            backgroundColor: "blue"
          }}
        />
      ))}
    </div>
  );
}