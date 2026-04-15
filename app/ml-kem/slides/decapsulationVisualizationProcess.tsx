"use client"

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import SquareGrid from "@/components/ui/gridLattice"
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ChevronLeftIcon, MinusIcon, EqualsIcon } from '@heroicons/react/24/solid';
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

  const [state, setState] = useState(0);

  useEffect(() => {
    onSelectVariable("decapsulationBase1");
  }, [onSelectVariable]);

  const advanceState = (n: number, variable?: string) => {
    setState(n);
    if (variable) onSelectVariable(variable);
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-center items-center">
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-col gap-2 items-center">
          <div><InlineMath math="dk_{PKE}" /></div> {/*// 384k bytes */}
          <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []} showValues />
        </div>
        <div className="flex flex-col items-center font-mono text-sm cursor-pointer" onClick={() => advanceState(1, "1")}>
          decode
          <ArrowLongRightIcon className="size-6" />
        </div>
        <div className={`flex flex-col items-center gap-4 transition-opacity duration-300 ${state >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div><InlineMath math="\hat{s}" /></div>
          <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.sHat[0] ? Array.from(spyData.sHat[0]) : []} showValues base={3329} />
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div className="flex flex-col gap-2 items-center">
          <div><InlineMath math="c" /></div>
          <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues />
        </div>
        <div className="flex flex-col items-center font-mono text-sm cursor-pointer" onClick={() => advanceState(1, "1")}>
          split
          <ArrowLongRightIcon className="size-6" />
        </div>
        <div className={`flex flex-row gap-4 transition-opacity duration-300 ${state >= 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="c_1" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.c1 ? Array.from(spyData.c1) : []} showValues />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="c_2" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.c2 ? Array.from(spyData.c2) : []} showValues />
          </div>
          <div className="flex flex-col items-center font-mono text-sm cursor-pointer" onClick={() => advanceState(2, "2")}>
            decode + decompress
            <ArrowLongRightIcon className="size-6" />
          </div>
          <div className={`flex flex-row gap-4 transition-opacity duration-300 ${state >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="u'" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.u[0] ? Array.from(spyData.u[0]) : []} showValues base={3329} />
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="v'" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.v ? Array.from(spyData.v) : []} showValues base={3329} />
          </div>
          </div>
        </div>
      </div>
      <div className={`flex flex-row gap-2 transition-opacity duration-300 ${state >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="v'" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.v ? Array.from(spyData.v) : []} showValues base={3329} />
          </div>
          <MinusIcon className="size-6" />
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="{\hat{s}}^T" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.sHat[0] ? Array.from(spyData.sHat[0]) : []} showValues base={3329} />
          </div>
          <InlineMath math="\cdot" />
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="u'" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.u[0] ? Array.from(spyData.u[0]) : []} showValues base={3329} />
          </div>
          <div>)</div>
          <EqualsIcon className="size-6" />
          <div className="flex flex-col gap-2 items-center">
            <div><InlineMath math="w" /></div>
            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.w ? Array.from(spyData.w) : []} showValues base={3329} />
          </div>
      </div>
      <div className={`flex flex-row gap-2 transition-opacity duration-300 ${state >= 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-2 items-center">
          <div><InlineMath math="w" /></div>
          <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.w ? Array.from(spyData.w) : []} showValues base={3329} />
        </div>
        <div className="flex flex-col items-center font-mono text-sm cursor-pointer">
          compress + encode
          <ArrowLongRightIcon className="size-6" />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div><InlineMath math="m" /></div>
          <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues />
        </div>
      </div>
        <Button
            variant="secondary"
            size="sm"
            onClick={() => onChangeStage("decapsulation0")}
            className="flex justify-start cursor-pointer"
            >
            <ChevronLeftIcon className="size-6" /> BACK
        </Button>
    </div>
  );
}