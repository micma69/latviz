"use client";

import React, { useEffect, useMemo, useState } from "react";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ArrowLongRightIcon } from "@heroicons/react/24/solid";
import SquareGrid from "@/components/ui/gridLattice";
import { DSASignSpyData } from "@/utils/createSpy";

export default function SignInternal({
    spyData,
    onChangeStage,
    onSelectVariable,
}: {
    spyData: DSASignSpyData | null;
    onChangeStage: (stage: string) => void;
    onSelectVariable: (variable: string) => void;
}) {
    useEffect(() => {
            onSelectVariable("explanation");
        }, []);
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="sk" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M'" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="rnd" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rnd ? Array.from(spyData.rnd) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div><InlineMath math="sk" /></div>
                <div className="flex flex-col items-center gap-2">
                    decode
                    <ArrowLongRightIcon className="size-8" />
                </div>
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
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
                </div>
                <div className="flex flex-row gap-6">
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="tr" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.tr ? Array.from(spyData.tr) : []} showValues={true} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div><InlineMath math="M'" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        append + hash
                        <ArrowLongRightIcon className="size-8" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div><InlineMath math="\mu" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues={true} />
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="K" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="rnd" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rnd ? Array.from(spyData.rnd) : []} showValues={true} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="\mu" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues={true} />
                </div>
                <ArrowLongRightIcon className="size-8" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="\rho''" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} />
                </div>
            </div>
            <div className="flex flex-row gap-6">
                <div onClick={() => {
                    onChangeStage("sign2");
                }} className="flex rounded-lg bg-white p-3 font-mono text-sm h-24 items-center justify-center cursor-pointer">
                    Valid Signature Generation Loop
                </div>
                <div className="flex flex-col items-center gap-2">
                    generates
                    <ArrowLongRightIcon className="size-8" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="\sigma" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.signature ? Array.from(spyData.signature) : []} showValues={true} />
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("sign0")}
                className="flex justify-start cursor-pointer"
                >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}