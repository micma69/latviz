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
    <div className="grid grid-rows-4 gap-2 w-full h-full">
      <div className="grid grid-cols-5 gap-2 w-full">
        <div className="grid grid-rows-2 gap-2">
          <div>Decapsulation Key dk <InlineMath math="\in \mathbb{B}^{768k+96}" /></div>
          <div>Ciphertext <InlineMath math="c \in \mathbb{B}^{32(d_u k + d_v)}" /></div>
        </div>
        <ArrowRightIcon className="size-6" />
        <div onClick={() => {
            onSelectVariable("decapsulationBase1");
            onChangeStage("decapsulation1");
        }} className="rounded-lg bg-white p-1 font-mono text-sm">
          Kyber-PKE Decrypt
        </div>
        <ArrowRightIcon className="size-6" />
        <div>Message <InlineMath math="m' \in \mathbb{B}^{32}" /></div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full">
        <InlineMath math="m' \parallel h" />
        <ArrowRightIcon className="size-6" />
        <div className="grid grid-rows-2 gap-2">
          <div><InlineMath math="K' \in \mathbb{B}^{32}" /></div>
          <div>Randomness <InlineMath math="r'" /></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-full">
        <InlineMath math="z \parallel c" />
        <ArrowRightIcon className="size-6" />
        <div><InlineMath math="\bar{K}" /></div>
      </div>
      <div onClick={() => {
          onSelectVariable("checkingCiphertext");
      }} className="rounded-lg bg-white p-1 font-mono text-sm">
        Re-encrypt to check whether resulting ciphertext c' matches input ciphertext c
      </div>
    </div>
  );
}