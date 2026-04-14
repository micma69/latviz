"use client"

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import SquareGrid from "@/components/ui/gridLattice"
import { InlineMath } from 'react-katex';
import { ArrowRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { DecapsSpyData } from '@/utils/createSpy';

export default function DecapsulationVisualizationProcess({
  onSelectVariable,
  onChangeStage,
  spyData
}: { 
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DecapsSpyData | null;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    onSelectVariable("decapsulationBase1");
  }, [onSelectVariable]);

  useEffect(() => {
    if (step >= 3) return;
    const timer = setTimeout(() => setStep(s => s + 1), 800);
    return () => clearTimeout(timer);
  }, [step]);

  const show = (s: number) => step >= s;

  const c = spyData?.c ? Array.from(spyData.c) : [];
  const c1 = spyData?.c1 ? Array.from(spyData.c1) : [];
  const c2 = spyData?.c2 ? Array.from(spyData.c2) : [];
  const u = spyData?.u ? spyData.u.flatMap(p => Array.from(p)) : [];
  const v = spyData?.v ? Array.from(spyData.v) : [];
  const sHat = spyData?.sHat ? spyData.sHat.flatMap(p => Array.from(p)) : [];
  const w = spyData?.w ? Array.from(spyData.w) : [];

  return (
    <div className="flex flex-col gap-6 h-full">
        {/* Stage 1: c → c1, c2 */}
        <div className="flex flex-row items-center justify-center gap-6">
            <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${show(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <InlineMath math="c" />
                <div
                    onClick={() => onSelectVariable("cipherMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={8} size={12} colorData={c} />
                </div>
            </div>

            <ArrowRightIcon className={`size-6 transition-all duration-500 ${show(1) ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${show(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <InlineMath math="c_1" />
                <div
                    onClick={() => onSelectVariable("cipher1MatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={c1} />
                </div>
            </div>

            <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${show(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <InlineMath math="c_2" />
                <div
                    onClick={() => onSelectVariable("cipher2MatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={c2} />
                </div>
            </div>

            <ArrowRightIcon className={`size-6 transition-all duration-500 ${show(2) ? 'opacity-100' : 'opacity-0'}`} />

            <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${show(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <InlineMath math="u'" />
                <div
                    onClick={() => onSelectVariable("uMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={u} />
                </div>
            </div>

            <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${show(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <InlineMath math="v'" />
                <div
                    onClick={() => onSelectVariable("vMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={v} />
                </div>
            </div>
        </div>

        {/* Stage 2: v' - (ŝᵀ × u') → w → m */}
        <div className={`flex flex-row justify-center items-center gap-6 transition-all duration-500 ${show(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex flex-col items-center gap-3">
                <InlineMath math="v'" />
                <div
                    onClick={() => onSelectVariable("vMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={v} />
                </div>
            </div>

            <div onClick={() => onSelectVariable("decapsM")} className="cursor-pointer">-</div>
            <div onClick={() => onSelectVariable("decapsM")} className="cursor-pointer">(</div>

            <div className="flex flex-col items-center gap-3">
                <InlineMath math="\hat{s}^T" />
                <div
                    onClick={() => onSelectVariable("sMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={1} size={12} colorData={sHat} />
                </div>
            </div>

            <div onClick={() => onSelectVariable("decapsM")} className="cursor-pointer">×</div>

            <div className="flex flex-col items-center gap-3">
                <InlineMath math="u'" />
                <div
                    onClick={() => onSelectVariable("uMatrixDecaps")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={u} />
                </div>
            </div>

            <div onClick={() => onSelectVariable("decapsM")} className="cursor-pointer">)</div>
            <ArrowRightIcon className="size-6" />

            <div className="flex flex-col items-center gap-3">
                <InlineMath math="w" />
                <div
                    onClick={() => onSelectVariable("decapsM")}
                    className="border-2 border-solid cursor-pointer hover:border-blue-500 transition w-fit h-fit"
                >
                    <SquareGrid rows={8} cols={4} size={12} colorData={w} />
                </div>
            </div>

            <ArrowRightIcon className="size-6" />
            <div onClick={() => onSelectVariable("decapsM")} className="cursor-pointer">
                <InlineMath math="m" />
            </div>
        </div>

        <div className="flex justify-content:flex-end">
            <Button variant="secondary" size="lg" onClick={() => onChangeStage("decapsulation0")}>
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    </div>
  );
}