"use client"

import SquareGrid from "@/components/ui/gridLattice"
import { ChevronLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/solid';
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
        <div className="flex flex-row gap-6 justify-center">
            <div className="flex flex-row gap-3 items-center">
                <div className="flex flex-col items-center">
                    <div>Encapsulation Key ek</div>
                    <SquareGrid rows={1} cols={4} size={12} />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} size={12} />
                </div>
            </div>
            <div><InlineMath math=", " /></div>
            <div className="flex flex-col items-center">
                <div>Message <InlineMath math="m \in \mathbb{B}^{32}" /></div>
                <SquareGrid rows={1} cols={4} size={12} />
            </div>
            <div><InlineMath math=", " /></div>
            <div className="flex flex-col items-center">
                <div>Message <InlineMath math="r \in \mathbb{B}^{32}" /></div>
                <SquareGrid rows={1} cols={4} size={12} />
            </div>
        </div>
        <div className="flex flex-row gap-6 items-center justify-center">
            <div>(</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="\hat{A}" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixAT")}
                    className="cursor-pointer w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={8} size={15} />
                </div>
            </div>
            <div className="text-4xl"><InlineMath math="\cdot" /></div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="y" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixY")}
                    className="cursor-pointer w-fit h-fit"
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
                    className="cursor-pointer w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
            <div>=</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="u" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixU")}
                    className="cursor-pointer w-fit h-fit"
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
                    className="cursor-pointer w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15} />
                </div>
            </div>
            <div className="text-4xl"><InlineMath math="\cdot" /></div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="y" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixY")}
                    className="cursor-pointer w-fit h-fit"
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
                    className="cursor-pointer transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
            <div>+</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="\mu" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixMu")}
                    className="cursor-pointer transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
            <div>=</div>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="v" />
                <div
                    onClick={() => onSelectVariable("encapsMatrixV")}
                    className="cursor-pointer w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={15}/>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-2 items-center">
            <div className="flex flex-row gap-2">
                <div onClick={() => onSelectVariable("returnCiphertext")} className="cursor-pointer w-fit h-fit"><SquareGrid rows={4} cols={1} size={15} /></div>
                <div onClick={() => onSelectVariable("returnCiphertext")} className="cursor-pointer w-fit h-fit"><SquareGrid rows={4} cols={1} size={15} /></div>
            </div>
            <InlineMath math="c" />
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