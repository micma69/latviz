"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";
import { DSAKeygenSpyData } from '@/utils/createSpy';
import { Button } from "@/components/ui/button";

export default function KeygenOuter({
    onSelectVariable,
    onChangeStage,
    spyData,
    step
}: { 
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DSAKeygenSpyData | null;
    step: number;
}) {
    useEffect(() => {
        onSelectVariable("explanation");
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                    <div className="text-blue-700 font-semibold text-lg">Input</div>
                        <div className="flex flex-col items-center  text-sm gap-2">
                            <div><InlineMath math="\xi" /></div>
                            <SquareGrid algorithm="mldsa"
                                 size={12}
                                colorData={spyData?.seed ? Array.from(spyData.seed) : []}
                                showValues variableKey="xi_keygen" onClick={() => onSelectVariable("xi_keygen")}
                            />
                        </div>
                </div>
                {step >= 2 && <>
                    <ArrowLongRightIcon className="size-6" />
                    <div
                        onClick={() => {
                            onSelectVariable("keygen1");
                            onChangeStage("keygen1");
                        }}
                        className="rounded-lg bg-white p-4  text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                    >
                        Internal Key Generation
                    </div>
                </>}
                {step >= 3 && <>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                        <div className="text-green-700 font-semibold text-lg">Output</div>
                        <div className="flex flex-col items-center  text-sm gap-2">
                            <div><InlineMath math="pk" /></div>
                            <SquareGrid algorithm="mldsa"  size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} variableKey="publickey" onClick={() => {onSelectVariable("publickey")}} />
                        </div>
                        <div className="flex flex-col items-center  text-sm gap-2">
                            <div><InlineMath math="sk" /></div>
                            <SquareGrid algorithm="mldsa"  size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} variableKey="secretkey" onClick={() => {onSelectVariable("secretkey")}}/>
                        </div>
                    </div>
                </>}
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("home")}
                className="flex justify-start cursor-pointer mt-2"
            >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}