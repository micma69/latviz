"use client"

import SquareGrid from "@/components/ui/gridLattice"
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";

export default function KeygenVisualizationProcess({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  return (
    <div className="grid grid-rows-3 gap-3">
      <div className="grid grid-cols-5 flex items-center">
        <div className="w-fit">(</div>
        <div
          onClick={() => onSelectVariable("keygenMatrixA")}
          className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
        >
          <SquareGrid rows={8} cols={8} size={12} />
        </div>
        <div>X</div>
        <div
          onClick={() => onSelectVariable("keygenMatrixS")}
          className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
        >
          <SquareGrid rows={8} cols={1} size={12} />
        </div>
        <div>)</div>
      </div>
      <div className="grid grid-cols-4 gap-2 flex items-center">
        <div>+</div>
        <div
          onClick={() => onSelectVariable("keygenMatrixE")}
          className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
        >
          <SquareGrid rows={8} cols={1} size={12}/>
        </div>
        <div>=</div>
        <div
          onClick={() => onSelectVariable("keygenMatrixT")}
          className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
        >
          <SquareGrid rows={8} cols={1} size={12}/>
        </div>
      </div>
      
      <div className="flex h-24">
        	<Button variant="secondary"
                              size="sm"
                              onClick={() => onChangeStage("keygen0")}>
		        <ArrowLeftIcon className="size-6" /> BACK
	        </Button>
      </div>
    </div>
  );
}