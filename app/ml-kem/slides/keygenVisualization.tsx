"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";
import { KeygenSpyData } from '@/utils/createSpy';

export default function KeygenVisualization({
  onSelectVariable,
  onChangeStage,
  spyData 
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: KeygenSpyData | null;
 }) {
    useEffect(() => {
            onSelectVariable("keygenBase0");
        }, []);

    const { d, z, rho, sigma, A, sHat, eHat, tHat, ekPKE, dkPKE, publicKey, secretKey } = spyData ?? {};

    return (
        <div className="flex flex-row gap-6 items-center h-full w-full justify-center">
            <div className="flex flex-col items-center font-mono text-sm gap-6">
                <div>
                    <div>Randomness <InlineMath math="d \in \mathbb{B}^{32}" /></div>
                    <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.d ? Array.from(spyData.d) : []} showValues={true} />
                </div>
                <div>
                    <div>Randomness <InlineMath math="z \in \mathbb{B}^{32}" /></div>
                    <SquareGrid rows={1} cols={4} size={12} colorData={spyData?.z ? Array.from(spyData.z) : []} showValues={true} />
                </div>
            </div>
            <div className="w-fit"><ArrowLongRightIcon className="size-8" /></div>
            <div className="flex flex-col">
                <div onClick={() => {
                    onSelectVariable("keygenBase1");
                    onChangeStage("keygen1");
                }} className="rounded-lg bg-white p-3 font-mono text-sm flex cursor-pointer items-center justify-center h-96">
                    Kyber-PKE Key Generation
                </div>
            </div>
            <div className="flex flex-col items-center gap-8 w-fit h-full justify-center">
                <div className="flex flex-row items-center gap-8">
                    <ArrowLongRightIcon className="size-8" />
                    <div className="flex flex-col items-center justify-center font-mono text-sm">
                        <div>Encapsulation Key ek <InlineMath math="\in \mathbb{B}^{384k+32}" /></div>
                        <SquareGrid rows={8} cols={8} size={4} colorData={spyData?.publicKey} showValues={true}/>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-8">
                    <ArrowLongRightIcon className="size-8" />
                    <div className="flex flex-col items-center justify-center font-mono text-sm">
                        <div>Decapsulation Key dk <InlineMath math="\in \mathbb{B}^{768k+96}" /></div>
                        <SquareGrid rows={8} cols={8} size={4} colorData={spyData?.secretKey} showValues={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
}
