"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";
import { DSASignSpyData } from '@/utils/createSpy';
import { Button } from "@/components/ui/button";

export default function SignOuter({
    onSelectVariable,
    onChangeStage,
    spyData 
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DSASignSpyData | null;
}) {
    useEffect(() => {
        onSelectVariable("explanation");
    }, []);

    return (
        <div className="flex flex-col gap-6 items-center h-full w-full justify-center">
            <div className="flex flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="sk" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="ctx" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.ctx ? Array.from(spyData.ctx) : []} showValues={true} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-8" />
            <div className="flex flex-row gap-6">
                <SquareGrid rows={1} cols={1} size={12} colorData={[0]} showValues={true} />
                <SquareGrid rows={1} cols={1} size={12} colorData={spyData?.ctx ? [spyData.ctx.length] : []} showValues={true} />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="ctx" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.ctx ? Array.from(spyData.ctx) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    concatenated
                    <ArrowLongRightIcon className="size-8" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M'" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.M ? Array.from(spyData.M) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="sk" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M'" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.M ? Array.from(spyData.M) : []} showValues={true} />
                </div>
                <div className="cursor-pointer"><InlineMath math="rand" /></div>
                <div className="flex flex-col items-center gap-2">
                    input
                    <ArrowLongRightIcon className="size-8" />
                </div>
                <div onClick={() => {
                    onChangeStage("sign1");
                }} className="flex rounded-lg bg-white p-3 font-mono text-sm h-24 items-center justify-center cursor-pointer">
                    Internal Signing
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("home")}
                className="cursor-pointer"
                >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}