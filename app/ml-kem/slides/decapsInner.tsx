"use client"

import React, { useEffect, useState } from 'react';
import 'katex/dist/katex.min.css';
import SquareGrid from "@/components/ui/gridLattice"
import { InlineMath } from 'react-katex';
import { ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import { DecapsSpyData } from '@/utils/createSpy';

export default function DecapsulationVisualizationProcess({
  onSelectVariable,
  onChangeStage,
  spyData
}: { 
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: DecapsSpyData | null;
}) {
    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                    <div className="text-blue-700 font-semibold text-lg">Input</div>
                    <div className="flex flex-col gap-8 items-center justify-center">
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="dk_{PKE}" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []} showValues={true} onClick={() => onSelectVariable("dkPKE_decaps")} />
                        </div>
                    </div>
                    <div className="flex flex-row gap-8 items-center justify-center">
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="c" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.c ? Array.from(spyData.c) : []} showValues={true} onClick={() => onSelectVariable("ciphertext_decaps")} />
                        </div>
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="c_1" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.c1 ? Array.from(spyData.c1) : []} showValues={true} onClick={() => onSelectVariable("c1_decaps")} />
                        </div>
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="c_2" /></div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={8} size={12} colorData={spyData?.c2 ? Array.from(spyData.c2) : []} showValues={true} onClick={() => onSelectVariable("c2_decaps")} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6 items-center">
                    <div className="flex flex-row gap-4 items-center">
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                            <div className="flex flex-col gap-2 items-center">
                                <div><InlineMath math="u'" /></div>
                                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.u[0] ? Array.from(spyData.u[0]) : []} showValues onClick={() => onSelectVariable("u_decaps")} />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                            <div className="flex flex-col gap-2 items-center">
                                <div><InlineMath math="v'" /></div>
                                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.v ? Array.from(spyData.v) : []} showValues onClick={() => onSelectVariable("v_decaps")} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                            <div className="flex flex-col gap-2 items-center">
                                <div><InlineMath math="\hat{s}" /></div>
                                <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.sHat[0] ? Array.from(spyData.sHat[0]) : []} showValues onClick={() => onSelectVariable("s_decaps")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-4 items-center">
                <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                    <div><InlineMath math="v' - (\hat{s}^T \cdot u')" /></div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center">
                        <div><InlineMath math="w" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.w ? Array.from(spyData.w) : []} showValues onClick={() => onSelectVariable("w_decaps")} />
                    </div>
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                    <div className="text-green-700 font-semibold text-lg">Output</div>
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div className="font-mono text-sm"><InlineMath math="m" /></div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={4} colsExpanded={4} size={12} colorData={spyData?.m ? Array.from(spyData.m) : []} showValues onClick={() => onSelectVariable("m_decaps")} />
                    </div>
                </div>
            </div>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("decapsulation0")}
                className="flex justify-start cursor-pointer mt-2"
            >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}