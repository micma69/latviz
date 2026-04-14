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
        <div className="flex flex-col h-full">
            <div className="flex flex-row gap-7 items-center h-full w-full justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div>𝜉</div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.seed ? Array.from(spyData.seed) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-1">
                    input
                    <ArrowLongRightIcon className="size-8" />
                </div>
                <div onClick={() => {
                    onChangeStage("keygen1");
                }} className="flex rounded-lg bg-white p-3 font-mono text-sm h-24 items-center justify-center cursor-pointer">
                    Internal Key Generation
                </div>
                <div className="flex flex-col items-center gap-1">
                    output
                    <ArrowLongRightIcon className="size-8" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="pk" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="sk" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} />
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("home")}
                className="flex justify-start cursor-pointer"
                >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div> 
    );
}