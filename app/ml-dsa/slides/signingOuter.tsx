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
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                    <div className="text-blue-700 font-semibold text-lg">Input</div>
                        <div className="flex flex-row gap-4 items-center">
                            <div className="flex flex-col items-center gap-2">
                                <div><InlineMath math="sk" /></div>
                                <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} onClick={() => onSelectVariable("secretkey")} variableKey="secretkey" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div><InlineMath math="M" /></div>
                                <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={(spyData?.msg ? Array.from(spyData.msg) : []).slice(2)} showValues={true} onClick={() => onSelectVariable("message_sign")} variableKey="message_sign" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <div><InlineMath math="ctx" /></div>
                                <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.ctx ? Array.from(spyData.ctx) : []} showValues={true} onClick={() => onSelectVariable("ctx_sign")} variableKey="ctx_sign" />
                            </div>
                        </div>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div className="flex flex-col items-center gap-2">
                        <div><InlineMath math="rnd" /></div>
                        <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rnd ? Array.from(spyData.rnd) : []} showValues={true} variableKey="rnd_sign" onClick={() => onSelectVariable("rnd_sign")} />
                    </div>
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <SquareGrid algorithm="mldsa" rows={1} cols={1} size={12} colorData={[0]} showValues={true} showTooltip={false} />
                <SquareGrid algorithm="mldsa" rows={1} cols={1} size={12} colorData={spyData?.ctx ? [spyData.ctx.length] : []} showValues={true} variableKey="ctx_length" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="ctx" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.ctx ? Array.from(spyData.ctx) : []} showValues={true} onClick={() => onSelectVariable("ctx_sign")} variableKey="ctx_sign" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={(spyData?.msg ? Array.from(spyData.msg) : []).slice(2)} showValues={true} variableKey="M_sign" onClick={() => onSelectVariable("M_sign")} />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="M'" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.M ? Array.from(spyData.M) : []} showValues={true} variableKey="Mp_sign" onClick={() => onSelectVariable("Mp_sign")} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="sk, M', rnd" /></div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div
                    onClick={() => {
                        onSelectVariable("sign1");
                        onChangeStage("sign1");
                    }}
                    className="rounded-lg bg-white p-4  text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                >
                    Internal Signing
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                    <div className="text-green-700 font-semibold text-lg">Output</div>
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="\sigma" /></div>
                        <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.signature ? Array.from(spyData.signature) : []} showValues={true} onClick={() => onSelectVariable("signature")} variableKey="signature" />
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