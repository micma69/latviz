"use client";

import React, { useEffect } from "react";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ArrowLongRightIcon, ArrowLongDownIcon } from "@heroicons/react/24/solid";
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
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="sk" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} onClick={() => onSelectVariable("secretkey")} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="M" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.msg ? Array.from(spyData.msg) : []} showValues={true} onClick={() => onSelectVariable("message_sign")} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="rnd" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rnd ? Array.from(spyData.rnd) : []} showValues={true} onClick={() => onSelectVariable("rnd_sign")} />
                        </div>
                    </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="sk" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="\rho" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues={true} onClick={() => onSelectVariable("rho_sign")} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="K" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} onClick={() => onSelectVariable("K_sign")} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="tr" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.tr ? Array.from(spyData.tr) : []} showValues={true} onClick={() => onSelectVariable("tr_sign")} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="s_1" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s1[0] ? Array.from(spyData.s1[0]) : []} showValues={true} onClick={() => onSelectVariable("s1_sign")} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="s_2" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s2[0] ? Array.from(spyData.s2[0]) : []} showValues={true} onClick={() => onSelectVariable("s2_sign")} />
                </div>
                <div className="flex flex-col gap-2 items-center">
                    <InlineMath math="t_0" />
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t0[0] ? Array.from(spyData.t0[0]) : []} showValues={true} onClick={() => onSelectVariable("t0_sign")} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="\rho" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="A" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []} showValues={true} onClick={() => onSelectVariable("A_sign")} />
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="tr, M'" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center gap-2">
                        <div><InlineMath math="\mu" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.mu ? Array.from(spyData.mu) : []} showValues={true} onClick={() => onSelectVariable("mu_sign")} />
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="K, rnd, \mu" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center gap-2">
                        <div><InlineMath math="\rho''" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rhoPrime ? Array.from(spyData.rhoPrime) : []} showValues={true} onClick={() => onSelectVariable("rhop_sign")} />
                    </div>
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div
                onClick={() => {
                    onSelectVariable("sign2");
                    onChangeStage("sign2");
                }}
                className="rounded-lg bg-white p-4 font-mono text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
            >
                Valid Signature Generation Loop
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                <div className="text-green-700 font-semibold text-lg">Output</div>
                <div className="flex flex-col items-center font-mono text-sm gap-2">
                    <div><InlineMath math="\sigma" /></div>
                    <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.signature ? Array.from(spyData.signature) : []} showValues={true} onClick={() => onSelectVariable("signature")} />
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("sign0")}
                className="flex justify-start cursor-pointer mt-2"
            >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}