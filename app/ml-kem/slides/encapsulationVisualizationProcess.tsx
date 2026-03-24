"use client"

import SquareGrid from "@/components/ui/gridLattice"
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { InlineMath } from 'react-katex';

export default function EncapsulationVisualizationProcess({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  return (
    <div className="grid grid-rows-4 gap-2 w-full">
        <div className="grid grid-cols-9 gap-2">
            <div className="w-fit">(</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixAT")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={8} size={12} />
            </div>
            <div>X</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixY")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12} />
            </div>
            <div>)</div>
            <div>+</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixE1")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12}/>
            </div>
            <div>=</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixU")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12}/>
            </div>
        </div>
        <div className="grid grid-cols-11 gap-2">
            <div className="w-fit">(</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixT")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12} />
            </div>
            <div>X</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixY")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12} />
            </div>
            <div>)</div>
            <div>+</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixE2")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12}/>
            </div>
            <div>+</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixMu")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12}/>
            </div>
            <div>=</div>
            <div
                onClick={() => onSelectVariable("encapsMatrixV")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={1} size={12}/>
            </div>
        </div>
        <div onClick={() => onSelectVariable("returnCiphertext")}
        className="flex justify-center">
            <InlineMath math="c_1 \parallel c_2 = c" />
        </div>
        <div>
            <Button variant="secondary"
                                size="lg"
                                onClick={() => onChangeStage("encapsulation0")}>
                <ArrowLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    </div>
  );
}