"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function KeygenVisualization({
  onSelectVariable,
  onChangeStage
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
 }) {
    useEffect(() => {
            onSelectVariable("keygenBase0");
        }, []);

    return (
        <div className="grid grid-cols-5 gap-3 flex items-center h-full">
            <div className="grid grid-rows-2 flex items-center font-mono text-sm">
                <div>Randomness <InlineMath math="d \in \mathbb{B}^{32}" /></div>
                <div>Randomness <InlineMath math="z \in \mathbb{B}^{32}" /></div>
            </div>
            <div className="w-fit"><ArrowRightIcon className="size-8" /></div>
            <div onClick={() => {
                onSelectVariable("keygenBase1");
                onChangeStage("keygen1");
            }} className="rounded-lg bg-white p-1 font-mono text-sm flex items-center justify-center h-24">
                Kyber-PKE Key Generation
            </div>
            <div className="w-fit"><ArrowRightIcon className="size-8" /></div>
            <div className="grid grid-rows-2 flex items-center font-mono text-sm">
                <div>ek <InlineMath math="\in \mathbb{B}^{384k+32}" /> (Encapsulation Key)</div>
                <div>dk <InlineMath math="\in \mathbb{B}^{768k+96}" /> (Decapsulation Key)</div>
            </div>
        </div>
    );
}
