"use client"

import SquareGrid from "@/components/ui/gridLattice"
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { InlineMath } from 'react-katex';

export default function EncapsulationVisualizationProcess({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  return (
    <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-row gap-6 items-center justify-center">
            <div>(</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="\hat{A}" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixAT")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={8} size={15} />
                </div>
            </div>
            <div>X</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="y" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixY")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15} />
                </div>
            </div>
            <div>)</div>
            <div>+</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="e_1" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixE1")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
            <div>=</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="u" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixU")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
        </div>
        <div className="flex flex-row gap-6 items-center justify-center">
            <div className="w-fit">(</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="t" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixT")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15} />
                </div>
            </div>
            <div>X</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="y" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixY")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15} />
                </div>
            </div>
            <div>)</div>
            <div>+</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="e_2" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixE2")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
            <div>+</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="\mu" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixMu")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
            <div>=</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="v" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixV")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
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
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    </div>
  );
}