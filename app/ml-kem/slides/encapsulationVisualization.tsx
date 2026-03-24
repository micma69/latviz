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
    <div className="grid grid-cols-5 gap-2 w-full">
      <div className="grid grid-rows-5 flex items-center font-mono text-sm">
        Encapsulation Key ek
        Randomness <InlineMath math="m \in \mathbb{B}^{32}" />
        Shared Secret Key <InlineMath math="K \in \mathbb{B}^{32}" />
        Randomness <InlineMath math="r \in \mathbb{B}^{32}" />
      </div>
      <div className="grid grid-rows-2">
        ek<InlineMath math=", m, r" />
        <ArrowRightIcon className="size-6" />
      </div>
      <div onClick={() => {
          onSelectVariable("encapsulationBase1");
          onChangeStage("encapsulation1");
      }} className="rounded-lg bg-white p-1 font-mono text-sm">
        Kyber-PKE Encrypt
      </div>
      <ArrowRightIcon className="size-6" />
      <div className="grid grid-rows-2">
        <InlineMath math="K" />
        <div><InlineMath math="c" /> (ciphertext)</div>
      </div>
    </div>
  );
}