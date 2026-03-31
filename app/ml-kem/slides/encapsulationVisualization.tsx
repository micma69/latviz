"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function EncapsulationVisualization({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
  useEffect(() => {
              onSelectVariable("encapsulationBase0");
          }, [onSelectVariable]);
  return (
    <div className="flex flex-row gap-12 h-full items-center justify-center">
      <div className="flex flex-col font-mono text-sm">
        Encapsulation Key ek
        <div>Message <InlineMath math="m \in \mathbb{B}^{32}" /></div>
        <div>Shared Secret Key <InlineMath math="K \in \mathbb{B}^{32}" /></div>
        <div>Randomness <InlineMath math="r \in \mathbb{B}^{32}" /></div>
      </div>
      <div className="flex flex-col items-center">
        <div>ek<InlineMath math=", m, r" /></div>
        <ArrowRightIcon className="size-6" />
      </div>
      <div onClick={() => {
          onSelectVariable("encapsulationBase1");
          onChangeStage("encapsulation1");
      }} className="rounded-lg bg-white p-3 font-mono text-sm h-24 flex items-center justify-center">
        Kyber-PKE Encrypt
      </div>
      <ArrowRightIcon className="size-6" />
      <div className="grid grid-rows-2">
        <InlineMath math="K" />
        <div className="font-mono text-sm"><InlineMath math="c" /> (ciphertext)</div>
      </div>
    </div>
  );
}