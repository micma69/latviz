"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import SquareGrid from "@/components/ui/gridLattice"
import { InlineMath } from 'react-katex';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
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
    <div className="grid grid-rows-3 gap-2 w-fit">
        <div className="grid grid-cols-5 gap-2">
            <div
                onClick={() => onSelectVariable("cipherMatrixDecaps")}
                className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
            >
                <SquareGrid rows={8} cols={8} size={12} />
            </div>
            <ArrowRightIcon className="size-6" />
            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => onSelectVariable("cipher1MatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
                <div
                    onClick={() => onSelectVariable("cipher2MatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
            <ArrowRightIcon className="size-6" />
            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => onSelectVariable("uMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
                <div
                    onClick={() => onSelectVariable("vMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
            <div>Decryption Key <InlineMath math="dk_PKE \in \mathbb{B}^{384k}" /></div>
            <div className="grid grid-rows-2 gap-2">
                Decode
                <ArrowRightIcon className="size-6" />
            </div>
        </div>
        <div>
            <Button variant="secondary"
                                size="lg"
                                onClick={() => onChangeStage("decapsulation0")}>
                <ArrowLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    </div>
  );
}