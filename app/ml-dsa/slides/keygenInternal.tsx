"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ArrowLongRightIcon, ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid';
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
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                    <div className="text-blue-700 font-semibold text-lg">Input</div>
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="\xi" /></div>
                            <SquareGrid
                                rows={1} cols={4} rowsExpanded={8} size={12}
                                colorData={spyData?.seed ? Array.from(spyData.seed) : []}
                                showValues onClick={() => onSelectVariable("d")}
                            />
                        </div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="\rho" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rho ? Array.from(spyData.rho) : []} showValues onClick={() => {onSelectVariable("rho")}} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="\rho'" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.rhoPrime ? Array.from(spyData.rhoPrime) : []} showValues onClick={() => {onSelectVariable("rho_prime")}} />
                        </div>
                        <div className="flex flex-col gap-2 items-center">
                            <InlineMath math="K" />
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.K ? Array.from(spyData.K) : []} showValues={true} />
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
                    <InlineMath math="\rho'" />
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="s_1" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.s1[0] ? Array.from(spyData.s1[0]).map(v => v + 2) : []} displayData={spyData?.s1[0] ? Array.from(spyData.s1[0]) : []} showValues={true} />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="s_2" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12}colorData={spyData?.s2[0] ? Array.from(spyData.s2[0]).map(v => v + 2) : []} displayData={spyData?.s2[0] ? Array.from(spyData.s2[0]) : []} showValues={true} />
                    </div>
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="(A \cdot s_1) + s_2" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="t" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t[0] ? Array.from(spyData.t[0]) : []} showValues={true} />
                    </div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="t_0" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t0[0] ? Array.from(spyData.t0[0]) : []} showValues={true} />
                    </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div className="flex flex-col gap-2 items-center">
                        <InlineMath math="t_1" />
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.t1[0] ? Array.from(spyData.t1[0]) : []} showValues={true} />
                    </div>
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                    <div className="text-green-700 font-semibold text-lg">Output</div>
                    <div className="flex flex-row gap-4 items-center">
                        <div><InlineMath math="\rho, t_1" /></div>
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="pk" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.pk ? Array.from(spyData.pk) : []} showValues={true} />
                        </div>
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
                <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                    <div className="text-green-700 font-semibold text-lg">Output</div>
                    <div className="flex flex-row gap-4 items-center">
                        <div><InlineMath math="\rho, K, tr, s_1, s_2, t_0" /></div>
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="sk" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.sk ? Array.from(spyData.sk) : []} showValues={true} />
                        </div>
                    </div>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("keygen0")}
                className="flex justify-start cursor-pointer mt-2"
            >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}