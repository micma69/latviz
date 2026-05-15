"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
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
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="pk" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="M" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="\sigma" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.signature ? Array.from(spyData.signature) : []} showValues={true} />
                        </div>
                    </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <InlineMath math="\rho" />
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="A" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues={true} />
                    </div>  
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="pk" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="tr" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.tr ? Array.from(spyData.tr) : []} showValues={true} />
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="tr, M'" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center gap-2">
                        <InlineMath math="\mu" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues />
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <InlineMath math="\sigma" />
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
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.h[0] ? Array.from(spyData.h[0]) : []} showValues/>
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
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
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <InlineMath math="Az - ct_1 \cdot 2^d " />
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center gap-2">
                        <InlineMath math="w'_{approx}" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.wPrime[0] ? Array.from(spyData.wPrime[0]) : []} showValues />
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <InlineMath math="h, w'_{approx}" />
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center gap-2">
                        <InlineMath math="w'_1" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.w1[0] ? Array.from(spyData.w1[0]) : []} showValues />
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <InlineMath math="\mu, w'_1" />
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center gap-2">
                        <InlineMath math="\tilde{c}'" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.cTilde ? Array.from(spyData.cTilde) : []} showValues />
                    </div>
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div
                    className={`
                        rounded-lg p-4 font-mono text-sm flex items-center justify-center 
                        w-64 shadow-sm border-2 transition-all duration-200
                        ${spyData?.result 
                            ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100' 
                            : 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100'
                        }
                    `}
                >
                    <div className="flex flex-col items-center gap-2">
                        <div><InlineMath math="\tilde{c} = \tilde{c}'" /> AND <InlineMath math="\|z\|_\infty < \gamma_1 - \beta" /></div>
                        {spyData?.result ? (
                            <>
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Valid</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Not Valid</span>
                            </>
                        )}

                    </div>
                </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("verify0")}
                className="flex justify-start cursor-pointer mt-2"
            >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}