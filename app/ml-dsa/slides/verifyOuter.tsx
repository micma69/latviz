"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import SquareGrid from "@/components/ui/gridLattice";
import { DSAVerifySpyData } from '@/utils/createSpy';
import { Button } from "@/components/ui/button";

export default function VerifyOuter({
    onSelectVariable,
    onChangeStage,
    spyData,
    step
}: { 
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DSAVerifySpyData | null;
    step: number;
}) {
    useEffect(() => {
        onSelectVariable("explanation");
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="pk" /></div>
                            <SquareGrid algorithm="mldsa"  size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} variableKey="publickey" onClick={() => onSelectVariable("publickey")} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="M" /></div>
                            <SquareGrid algorithm="mldsa"  size={12} colorData={(spyData?.msg ? Array.from(spyData.msg) : []).slice(2)} showValues={true} variableKey="message_verify" onClick={() => onSelectVariable("message_verify")} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="ctx" /></div>
                            <SquareGrid algorithm="mldsa"  size={12} colorData={spyData?.ctx ? Array.from(spyData.ctx) : []} showValues={true} variableKey="ctx_verify" onClick={() => onSelectVariable("ctx_verify")} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="\sigma" /></div>
                            <SquareGrid algorithm="mldsa"  size={12} colorData={spyData?.signature ? Array.from(spyData.signature) : []} showValues={true} variableKey="signature" onClick={() => onSelectVariable("signature")} />
                        </div>
                    </div>
            </div>
            {step >= 2 && <>
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <SquareGrid algorithm="mldsa" rows={1} cols={1} colsExpanded={1} rowsExpanded={1} size={12} colorData={[0]} showValues={true} showTooltip={false} />
                    <SquareGrid algorithm="mldsa" rows={1} cols={1} colsExpanded={1} rowsExpanded={1} size={12} colorData={spyData?.ctx ? [spyData.ctx.length] : []} showValues={true} variableKey="ctx_length_verify" />
                    <div><InlineMath math="M" /></div>
                    <div><InlineMath math="ctx" /></div>
                    {step >= 3 && <>
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="M'" /></div>
                            <SquareGrid algorithm="mldsa" size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} variableKey="Mp_verify" onClick={() => onSelectVariable("Mp_verify")} />
                        </div>
                    </>}
                </div>
            </>}
            {step >= 4 && <>
                <ArrowLongDownIcon className="size-6" />
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div><InlineMath math="pk, M', \sigma" /></div>
                    </div>
                    <ArrowLongRightIcon className="size-6" />
                    <div
                        onClick={() => {
                            onSelectVariable("verify1");
                            onChangeStage("verify1");
                        }}
                        className="rounded-lg bg-white p-4  text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                    >
                        Internal Verifying
                    </div>
                    {step >= 5 && <>
                        <ArrowLongRightIcon className="size-6" />
                        <div
                            className={`
                                rounded-lg p-4  text-sm flex items-center justify-center 
                                w-64 shadow-sm border-2 transition-all duration-200
                                ${spyData?.result 
                                    ? 'bg-green-50 border-green-500 text-green-700 hover:bg-green-100' 
                                    : 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100'
                                }
                            `}
                        >
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
                    </>}
                </div>
            </>}
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