"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ChevronLeftIcon, ArrowLongDownIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import SquareGrid from "@/components/ui/gridLattice";
import { EncapsSpyData } from '@/utils/createSpy';

export default function EncapsulationVisualization({
    onSelectVariable,
    onChangeStage,
    spyData,
    step
}: { 
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: EncapsSpyData | null;
    step: number;
 }) {
  useEffect(() => {
              onSelectVariable("encapsulationBase0");
          }, [onSelectVariable]);

  return (
    <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
        <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
            <div className="text-blue-700 font-semibold text-lg">Input</div>
            <div className="flex flex-row gap-8 items-center justify-center">
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="ek" /></div>
                    <SquareGrid algorithm="mlkem"  size={12} colorData={spyData?.ek ? Array.from(spyData.ek) : []} showValues={true} variableKey="encapskey_encaps" onClick={() => onSelectVariable("encapskey_encaps")} />
                </div>
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div><InlineMath math="m" /></div>
                    <SquareGrid algorithm="mlkem"  size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues={true} variableKey="m_encaps" onClick={() => onSelectVariable("m_encaps")} />
                </div>
            </div>
        </div>
        {step >= 2 && <>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 items-center">
                    <ArrowLongDownIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                        <div className="text-green-700 font-semibold text-lg">Output</div>
                        <div className="flex flex-col items-center  text-sm gap-2">
                            <div><InlineMath math="K" /></div>
                            <SquareGrid algorithm="mlkem"  size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} variableKey="K_encaps" onClick={() => onSelectVariable("K_encaps")} />
                        </div>
                    </div>         
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <ArrowLongDownIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div className="flex flex-col items-center  text-sm gap-2">
                            <div><InlineMath math="r" /></div>
                            <SquareGrid algorithm="mlkem"  size={12} colorData={spyData?.r ? Array.from(spyData.r) : []} showValues={true} variableKey="r_encaps" onClick={() => onSelectVariable("r_encaps")} />
                        </div>
                    </div>
                    <ArrowLongDownIcon className="size-6" />
                </div>
            </div>
        </>}
        {step >= 3 && <>
            <div
                onClick={() => {
                    onSelectVariable("encapsulationBase1");
                    onChangeStage("encapsulation1");
                }}
                className="rounded-lg bg-white p-4  text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
            >
                Kyber-PKE Encrypt
            </div>
        </>}
        {step >= 4 && <>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                <div className="text-green-700 font-semibold text-lg">Output</div>
                <div className="flex flex-col items-center  text-sm gap-2">
                    <div className=" text-sm"><InlineMath math="c" /></div>
                    <SquareGrid algorithm="mlkem"  size={12} colorData={spyData?.cipherText} showValues={true} variableKey="ciphertext_encaps" onClick={() => onSelectVariable("ciphertext_encaps")} />
                </div>
            </div>
        </>}
        <Button
            variant="secondary"
            size="sm"
            onClick={() => onChangeStage("home")}
            className="flex justify-start cursor-pointer mt-2"
        >
            <ChevronLeftIcon className="size-6" /> BACK
        </Button>
    </div>
  );
}