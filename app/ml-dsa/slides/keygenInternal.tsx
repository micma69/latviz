"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";
import { DSAKeygenSpyData } from '@/utils/createSpy';
import { Button } from "@/components/ui/button";

export default function KeygenInternal({
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
        <div className="flex flex-col h-full items-center gap-4">
            <div className="flex flex-col gap-2 items-center">
                <div>𝜉</div>
                <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.seed ? Array.from(spyData.seed) : []} showValues={true} />
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 items-center">
                    <div>𝜉</div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.seed ? Array.from(spyData.seed) : []} showValues={true} />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="\rho'" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rhoPrime ? Array.from(spyData.rhoPrime) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="K" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div>(</div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="A" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues={true} />
                </div>
                <InlineMath math="\cdot" />
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="s_1" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s1[0] ? Array.from(spyData.s1[0]) : []} showValues={true} />
                </div>
                <div>)</div>
                <PlusIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="s_2" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s2[0] ? Array.from(spyData.s2[0]) : []} showValues={true} />
                </div>
                <ArrowLongRightIcon className="size-6" />
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="t_1" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t1[0] ? Array.from(spyData.t1[0]) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    encode
                    <ArrowLongRightIcon className="size-6" />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="pk" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-1">
                    hashing
                    <ArrowLongRightIcon className="size-6" />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="tr" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.tr ? Array.from(spyData.tr) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="K" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="tr" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.tr ? Array.from(spyData.tr) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="s_1" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s1[0] ? Array.from(spyData.s1[0]) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="s_2" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s2[0] ? Array.from(spyData.s2[0]) : []} showValues={true} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="t_0" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t0[0] ? Array.from(spyData.t0[0]) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-1">
                    encode
                    <ArrowLongRightIcon className="size-6" />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="sk" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} />
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("keygen0")}
                className="flex justify-start cursor-pointer"
                >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div> 
    );
}