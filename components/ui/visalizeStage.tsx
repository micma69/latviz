'use client';

import { useState } from "react";

export default function VisualizationPanel() {
  const [stage, setStage] = useState(0);

  return (
    <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5">
      <div className="rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full flex items-center justify-center text-zinc-500 text-sm">

      </div>

      {/* Example controls */}
      <div className="mt-4 flex gap-2">
        <button onClick={() => setStage(0)}>Stage 1</button>
        <button onClick={() => setStage(1)}>Stage 2</button>
        <button onClick={() => setStage(2)}>Stage 3</button>
      </div>
    </main>
  );
}