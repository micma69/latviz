"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";

export default function EncapsulationVisualization({
  onSelectVariable,
  onChangeStage,
  colorDataC,
  colorDataK
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    colorDataC: number[];
    colorDataK: number[];
 }) {
  useEffect(() => {
              onSelectVariable("encapsulationBase0");
          }, [onSelectVariable]);
  return (
    <div className="flex flex-row items-center justify-center h-full w-full gap-4">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col font-mono text-sm gap-3 items-center">
          <div className="flex flex-col font-mono text-sm">
            <div>Encapsulation Key ek</div>
            <SquareGrid rows={1} cols={4} size={12} />
          </div>
          <div className="flex flex-col font-mono text-sm">
            <div>Message <InlineMath math="m \in \mathbb{B}^{32}" /></div>
            <SquareGrid rows={1} cols={4} size={12} />
          </div>
        </div>
        <ArrowLongRightIcon className="size-6" />
        <div className="flex flex-col font-mono text-sm gap-3">
          <div className="flex flex-col font-mono text-sm">
            <div>Shared Secret Key <InlineMath math="K \in \mathbb{B}^{32}" /></div>
            <SquareGrid rows={1} cols={4} size={12} />
          </div>
          <div className="flex flex-col font-mono text-sm">
            <div>Randomness <InlineMath math="r \in \mathbb{B}^{32}" /></div>
            <SquareGrid rows={1} cols={4} size={12} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-row">ek<InlineMath math=", m, r" /></div>
        <ArrowLongRightIcon className="size-6" />
      </div>
      <div onClick={() => {
          onSelectVariable("encapsulationBase1");
          onChangeStage("encapsulation1");
      }} className="cursor-pointer rounded-lg bg-white p-3 font-mono text-sm h-24 flex items-center justify-center">
        Kyber-PKE Encrypt
      </div>
      <ArrowLongRightIcon className="size-6" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center">
          <div className="font-mono text-sm"><InlineMath math="c" /></div>
          <SquareGrid rows={1} cols={4} size={12} colorData={colorDataC} showValues={true} />
        </div>
        <div className="flex flex-col items-center">
          <InlineMath math="K" />
          <SquareGrid rows={1} cols={4} size={12} colorData={colorDataK} showValues={true} />
        </div>
      </div>
    </div>
  );
}