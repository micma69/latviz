"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";
import { DSAVerifySpyData } from '@/utils/createSpy';
import { Button } from "@/components/ui/button";

export default function VerifyInternal({
    onSelectVariable,
    onChangeStage,
    spyData 
}: { onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DSAVerifySpyData | null;
}) {
    useEffect(() => {
        onSelectVariable("explanation");
    }, []);

    return (
        <div className="flex flex-col gap-6 items-center h-full w-full justify-center">
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="pk" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="t_1" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t1[0] ? Array.from(spyData.t1[0]) : []} showValues />
                </div>
            </div>
            {/* σ → (c~, z, h) */}
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\sigma" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.signature ? Array.from(spyData.signature) : []} showValues />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\tilde{c}" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.cTilde ? Array.from(spyData.cTilde) : []} showValues />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="z" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.z[0] ? Array.from(spyData.z[0]) : []} showValues />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="h" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.h[0] ? Array.from(spyData.h[0]) : []} showValues />
                </div>
            </div>
            {/* ρ → A */}
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="A" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues />
                </div>
            </div>
            {/* pk → tr → μ */}
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="pk" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="tr" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.tr ? Array.from(spyData.tr) : []} showValues />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\mu" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues />
                </div>
            </div>
            {/* c~ → c */}
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\tilde{c}" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.cTilde ? Array.from(spyData.cTilde) : []} showValues />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="c" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues />
                </div>
            </div>
            {/* Core equation */}
            <div className="flex flex-row items-center gap-4">
                <div>(</div>
                <div className="flex flex-col">
                    <InlineMath math="A" />
                </div>
                <InlineMath math="\cdot" />
                <div className="flex flex-col">
                    <InlineMath math="z" />
                </div>
                <InlineMath math="-" />
                <div className="flex flex-col">
                    <InlineMath math="c \cdot t_1" />
                </div>
                <div>)</div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="w'" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.wPrime[0] ? Array.from(spyData.wPrime[0]) : []} showValues />
                </div>
            </div>
            {/* UseHint */}
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col">
                    <InlineMath math="w'" />
                </div>
                <div className="flex flex-col">
                    <InlineMath math="h" />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="w'_1" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.w1[0] ? Array.from(spyData.w1[0]) : []} showValues />
                </div>
            </div>
            {/* Final hash */}
            <div className="flex flex-row items-center gap-4">
                <div className="flex flex-col">
                    <InlineMath math="\mu" />
                </div>
                <div className="flex flex-col">
                    <InlineMath math="w'_1" />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <InlineMath math="\tilde{c}'" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.cTilde ? Array.from(spyData.cTilde) : []} showValues />
                </div>
            </div>

            {/* Result */}
            <div className="flex flex-row items-center gap-4 justify-center">
                <InlineMath math="\tilde{c} \stackrel{?}{=} \tilde{c}'" />
                <span>AND</span>
                <InlineMath math="\|z\|_\infty < \gamma_1 - \beta" />
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("verify0")}
                className="flex justify-start cursor-pointer"
                >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div> 
    );
}