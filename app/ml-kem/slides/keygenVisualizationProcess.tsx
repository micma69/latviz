"use client"

import SquareGrid from "@/components/ui/gridLattice";
import { ChevronLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid';
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
      <div className="flex flex-row gap-6 font-mono text-sm items-center justify-center">
        <div>INPUT <InlineMath math="d \in \mathbb{B}^{32}" /></div>
        <SquareGrid rows={1} cols={4} size={12} />
        <ArrowLongRightIcon className="size-8" />
        <div className="flex flex-col gap-3 items-center">
          <div className="flex flex-col gap-1 items-center">
            <InlineMath math="\rho" />
            <SquareGrid rows={1} cols={4} size={12} />
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div>𝜎</div>
            <SquareGrid rows={1} cols={4} size={12} />
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-6 place items-center justify-center h-full">
        <div className="text-4xl">(</div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col items-center gap-3">
            <InlineMath math="A" />
            <div
              onClick={() => onSelectVariable("keygenMatrixA")}
              className="border-2 border-solid cursor-pointer w-fit h-fit"
            >
              <SquareGrid rows={8} cols={8} size={15} />
            </div>
          </div>
        </div>
        <div className="text-4xl"><InlineMath math="\cdot" /></div>
        <div className="flex flex-col items-center gap-3">
          <InlineMath math="s" />
          <div
            onClick={() => onSelectVariable("keygenMatrixS")}
            className="border-2 border-solid cursor-pointer w-fit h-fit"
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
            className="border-2 border-solid cursor-pointer w-fit h-fit"
          >
            <SquareGrid rows={8} cols={1} size={15}/>
          </div>
        </div>
        <div className="text-4xl">=</div>
        <div className="flex flex-col items-center gap-3">
          <InlineMath math="t" />
          <div
            onClick={() => onSelectVariable("keygenMatrixT")}
            className="border-2 border-solid cursor-pointer w-fit h-fit"
          >
            <SquareGrid rows={8} cols={1} size={15}/>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-16 justify-center">
        <div className="flex flex-col items-center justify-center font-mono text-sm gap-4">
            <div className="flex flex-row gap-2 items-center">
              <SquareGrid rows={8} cols={1} size={16}/>
              <div className="h-fit"><SquareGrid rows={4} cols={1} size={16}/></div>
            </div>
            <div><InlineMath math="ek_{PKE}" /></div>
        </div>
        <div className="flex flex-col items-center justify-center font-mono text-sm gap-4">
            <SquareGrid rows={8} cols={1} size={16} />
            <div><InlineMath math="dk_{PKE}" /></div>
        </div>
      </div>
      <div className="cursor-pointer">
        	<Button variant="secondary"
                              size="sm"
                              onClick={() => onChangeStage("keygen0")}>
		        <ChevronLeftIcon className="size-6" /> BACK
	        </Button>
      </div>
    </div>
  );
}