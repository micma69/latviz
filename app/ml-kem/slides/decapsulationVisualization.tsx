"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function DecapsulationVisualization({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  useEffect(() => {
                onSelectVariable("decapsulationBase0");
            }, [onSelectVariable]);
  return (
    <div className="flex flex-col gap-6 w-full h-full justify-center items-center">
      <div className="flex flex-row gap-6 w-full justify-center items-center">
        <div className="flex flex-col font-mono text-sm">
          <div>Decapsulation Key dk <InlineMath math="\in \mathbb{B}^{768k+96}" /></div>
          <div>Ciphertext <InlineMath math="c \in \mathbb{B}^{32(d_u k + d_v)}" /></div>
        </div>
        <ArrowRightIcon className="size-6" />
        <div onClick={() => {
            onSelectVariable("decapsulationBase1");
            onChangeStage("decapsulation1");
        }} className="flex rounded-lg bg-white p-3 font-mono text-sm h-24 items-center justify-center">
          Kyber-PKE Decrypt
        </div>
        <ArrowRightIcon className="size-6" />
        <div>Message <InlineMath math="m' \in \mathbb{B}^{32}" /></div>
      </div>
      <div className="flex flex-row gap-6 w-full justify-center items-center">
        <InlineMath math="m' \parallel h" />
        <ArrowRightIcon className="size-6" />
        <div className="flow flex-col font-mono text-sm">
          <div><InlineMath math="K' \in \mathbb{B}^{32}" /></div>
          <div>Randomness <InlineMath math="r'" /></div>
        </div>
      </div>
      <div className="flex flex-row gap-6 w-full justify-center items-center">
        <InlineMath math="z \parallel c" />
        <ArrowRightIcon className="size-6" />
        <div><InlineMath math="\bar{K}" /></div>
      </div>
    </div>
  );
}