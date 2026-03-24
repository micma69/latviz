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
        <div className="flex flex-row gap-6 items-center h-full w-full justify-center">
            <div className="flex flex-col items-center font-mono text-sm">
                <div>Randomness <InlineMath math="d \in \mathbb{B}^{32}" /></div>
                <div>Randomness <InlineMath math="z \in \mathbb{B}^{32}" /></div>
            </div>
            <div className="w-fit"><ArrowRightIcon className="size-8" /></div>
            <div onClick={() => {
                onSelectVariable("keygenBase1");
                onChangeStage("keygen1");
            }} className="rounded-lg bg-white p-3 font-mono text-sm flex items-center justify-center h-24">
                Kyber-PKE Key Generation
            </div>
            <div className="w-fit"><ArrowRightIcon className="size-8" /></div>
            <div className="flex flex-col items-center font-mono text-sm">
                <div>ek <InlineMath math="\in \mathbb{B}^{384k+32}" /> (Encapsulation Key)</div>
                <div>dk <InlineMath math="\in \mathbb{B}^{768k+96}" /> (Decapsulation Key)</div>
            </div>
        </div>
    );
}
