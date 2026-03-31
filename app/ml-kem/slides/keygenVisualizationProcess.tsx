"use client"

import SquareGrid from "@/components/ui/gridLattice"
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { InlineMath } from 'react-katex';

export default function KeygenVisualizationProcess({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-row gap-6 place items-center justify-center h-full">
        <div className="text-4xl">(</div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="A" />
            <div
              onClick={() => onSelectVariable("keygenMatrixA")}
              className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
              <SquareGrid rows={8} cols={8} size={15} />
            </div>
          </div>
        </div>
        <div className="text-4xl">X</div>
        <div className="flex flex-col items-center gap-3">
          <InlineMath math="s" />
          <div
            onClick={() => onSelectVariable("keygenMatrixS")}
            className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
          >
            <SquareGrid rows={8} cols={1} size={15} />
          </div>
        </div>
        <div className="text-4xl">)</div>
        <div className="text-4xl">+</div>
        <div className="flex flex-col items-center gap-3">
          <InlineMath math="e" />
          <div
            onClick={() => onSelectVariable("keygenMatrixE")}
            className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
          >
            <SquareGrid rows={8} cols={1} size={15}/>
          </div>
        </div>
        <div className="text-4xl">=</div>
        <div className="flex flex-col items-center gap-3">
          <InlineMath math="t" />
          <div
            onClick={() => onSelectVariable("keygenMatrixT")}
            className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
          >
            <SquareGrid rows={8} cols={1} size={15}/>
          </div>
        </div>
      </div>
      <div>
        	<Button variant="secondary"
                              size="sm"
                              onClick={() => onChangeStage("keygen0")}>
		        <ChevronLeftIcon className="size-6" /> BACK
	        </Button>
      </div>
    </div>
  );
}