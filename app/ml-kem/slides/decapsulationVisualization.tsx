"use client"

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ArrowLongDownIcon } from '@heroicons/react/24/solid';
import { DecapsSpyData } from '@/utils/createSpy';
import SquareGrid from "@/components/ui/gridLattice";

export default function DecapsulationVisualization({
  onSelectVariable,
  onChangeStage,
  spyData
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DecapsSpyData | null;
    
 }) {

  const [state, setState] = useState(0);

  useEffect(() => {
                onSelectVariable("decapsulationBase0");
            }, [onSelectVariable]);

  const advanceState = (n: number, variable?: string) => {
    setState(n);
    if (variable) onSelectVariable(variable);
  };

  return (
    // State 0, default
    <div className="flex flex-col gap-6 w-full h-full justify-center items-center">
      <div className="flex flex-row gap-6 w-full justify-center items-center">
        <div className="flex flex-col font-mono text-sm items-start">
          <div className="flex flex-row gap-6 w-full justify-center items-center">
            <div className="flex flex-col items-center gap-2">
                <div>Decapsulation Key dk <InlineMath math="\in \mathbb{B}^{768k+96}" /></div>
                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.dk ? Array.from(spyData.dk) : []} showValues={true} />
            </div>
            <div className="flex flex-col items-center font-mono text-sm cursor-pointer" onClick={() => advanceState(1, "1")}>
              extract
              <ArrowLongRightIcon className="size-6" />
            </div>
            <div className={`flex flex-row gap-4 transition-opacity duration-300 ${state >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="flex flex-col gap-2 items-center">
                <div><InlineMath math="dk_{PKE}" /></div> {/*// 384k bytes */}
                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []} showValues={true} />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <div><InlineMath math="ek_{PKE}" /></div> {/*// 384k bytes + 32 */}
                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []} showValues={true} />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <div><InlineMath math="h" /></div> {/*// 32 bytes */}
                <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.h ? Array.from(spyData.h) : []} showValues={true} />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <div><InlineMath math="z" /></div> {/*// 32 bytes */}
                <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.z ? Array.from(spyData.z) : []} showValues={true} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div>Ciphertext <InlineMath math="c \in \mathbb{B}^{32(d_u k + d_v)}" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues={true} />
          </div>
        </div>
      </div>
      <div className={`flex flex-row cursor-pointer items-center gap-3 transition-opacity duration-300 ${state >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => advanceState(2, "2")}>
        <ArrowLongDownIcon className="size-6" />
        <div className="flex flex-col">
          <div>input</div>
          <div><InlineMath math="dk_{PKE}, c" /></div>
        </div>
      </div>
      <div onClick={() => {
          onSelectVariable("decapsulationBase1");
          onChangeStage("decapsulation1");
      }} className={`flex rounded-lg bg-white p-3 font-mono text-sm h-24 items-center justify-center cursor-pointer transition-opacity duration-300 ${state >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        Kyber-PKE Decrypt
      </div>
      <div className={`flex flex-row cursor-pointer transition-opacity duration-300 ${state >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => advanceState(3, "3")}>
        <ArrowLongDownIcon className="size-6" />
        <div>output</div>
      </div>
      <div className={`flex flex-col cursor-pointer items-center gap-3 transition-opacity duration-300 ${state >= 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div><InlineMath math="m'" /></div> {/*// 32 bytes */}
        <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues={true} />
      </div>
    </div>
  );
}