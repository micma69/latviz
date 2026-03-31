"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import SquareGrid from "@/components/ui/gridLattice"
import { InlineMath } from 'react-katex';
import { ArrowRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";

export default function DecapsulationVisualizationProcess({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  useEffect(() => {
                onSelectVariable("decapsulationBase1");
            }, [onSelectVariable]);
  return (
    <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="c" />
                <div
                    onClick={() => onSelectVariable("cipherMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={8} size={12} />
                </div>
            </div>
            <ArrowRightIcon className="size-6" />
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="c_1" />
                <div
                    onClick={() => onSelectVariable("cipher1MatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="c_2" />
                <div
                    onClick={() => onSelectVariable("cipher1MatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
            <ArrowRightIcon className="size-6" />
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="u'" />
                <div
                    onClick={() => onSelectVariable("uMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="v'" />
                <div
                    onClick={() => onSelectVariable("vMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-6">
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="v'" />
                <div
                    onClick={() => onSelectVariable("vMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
            <div onClick={() => onSelectVariable("decapsM")}>-</div>
            <div onClick={() => onSelectVariable("decapsM")}>(</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="\hat{s}^T" />
                <div
                    onClick={() => onSelectVariable("sMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={12} />
                </div>
            </div>
            <div onClick={() => onSelectVariable("decapsM")}>X</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="u'" />
                <div
                    onClick={() => onSelectVariable("uMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
            <div onClick={() => onSelectVariable("decapsM")}>)</div>
                <div onClick={() => onSelectVariable("decapsM")}><ArrowRightIcon className="size-6" /></div>
                <div onClick={() => onSelectVariable("decapsM")}><InlineMath math="w" /></div>
                <div onClick={() => onSelectVariable("decapsM")}><ArrowRightIcon className="size-6" /></div>
                <div onClick={() => onSelectVariable("decapsM")}><InlineMath math="m" /></div>
        </div>
        <div className="flex justify-content:flex-end">
            <Button variant="secondary"
                                size="lg"
                                onClick={() => onChangeStage("decapsulation0")}>
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    </div>
  );
}