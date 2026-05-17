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
    spyData 
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DSAKeygenSpyData | null;
}) {
    useEffect(() => {
        onSelectVariable("explanation");
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                    <div className="text-blue-700 font-semibold text-lg">Input</div>
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="\xi" /></div>
                            <SquareGrid
                                rows={1} cols={4} rowsExpanded={8} size={12}
                                colorData={spyData?.seed ? Array.from(spyData.seed) : []}
                                showValues onClick={() => onSelectVariable("xi_keygen")}
                            />
                        </div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div
                    onClick={() => {
                        onSelectVariable("keygen1");
                        onChangeStage("keygen1");
                    }}
                    className="rounded-lg bg-white p-4 font-mono text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                >
                    Internal Key Generation
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                    <div className="text-green-700 font-semibold text-lg">Output</div>
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div><InlineMath math="pk" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} onClick={() => {onSelectVariable("publicKey")}} />
                    </div>
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div><InlineMath math="sk" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} onClick={() => {onSelectVariable("secretKey")}}/>
                    </div>
                </div>
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