"use client"

import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ArrowLongRightIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import SquareGrid from "@/components/ui/gridLattice";
import { KeygenSpyData } from '@/utils/createSpy';

export default function KeygenVisualizationProcess({
  onSelectVariable,
  onChangeStage,
  spyData
}: {
  onSelectVariable: (variable: string) => void;
  onChangeStage: (stage: string) => void;
  spyData: KeygenSpyData | null;
}) {
    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>   
                <div className="flex flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div><InlineMath math="d" /></div>
                        <SquareGrid
                            rows={1} cols={4} rowsExpanded={8} size={12}
                            colorData={spyData?.d ? Array.from(spyData.d) : []}
                            showValues onClick={() => onSelectVariable("d")}
                        />
                    </div>
                    <ArrowLongRightIcon className="size-6" />
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div><InlineMath math="\rho" /></div>
                        <SquareGrid
                            rows={1} cols={4} rowsExpanded={8} size={12}
                            colorData={spyData?.rho ? Array.from(spyData.rho) : []}
                            showValues onClick={() => onSelectVariable("rho")}
                        />
                    </div>
                    <div className="flex flex-col items-center font-mono text-sm gap-2">
                        <div><InlineMath math="\sigma" /></div>
                        <SquareGrid
                            rows={1} cols={4} rowsExpanded={8} size={12}
                            colorData={spyData?.sigma ? Array.from(spyData.sigma) : []}
                            showValues onClick={() => onSelectVariable("sigma")}
                        />
                    </div>
                </div>            
            </div>
            <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4 items-center">
                    <ArrowLongDownIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="A" /></div>
                            <SquareGrid
                                rows={1} cols={4} rowsExpanded={8} size={12}
                                colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []}
                                showValues onClick={() => onSelectVariable("A")}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <ArrowLongDownIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="e" /></div>
                            <SquareGrid
                                rows={1} cols={4} rowsExpanded={8} size={12}
                                colorData={spyData?.eHat[0] ? Array.from(spyData.eHat[0]) : []}
                                showValues onClick={() => onSelectVariable("e")}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <ArrowLongDownIcon className="size-6" />
                    <div className="flex flex-col gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                        <div className="flex flex-col items-center font-mono text-sm gap-2">
                            <div><InlineMath math="s" /></div>
                            <SquareGrid
                                rows={1} cols={4} rowsExpanded={8} size={12}
                                colorData={spyData?.sHat[0] ? Array.from(spyData.sHat[0]) : []}
                                showValues onClick={() => onSelectVariable("s")}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-row gap-2 items-center justify-center bg-orange-100 rounded-xl p-5 w-fit border-2 border-orange-300">
                <div><InlineMath math="A \cdot s + e" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center font-mono text-sm gap-2">
                    <div><InlineMath math="t" /></div>
                    <SquareGrid
                        rows={1} cols={4} rowsExpanded={8} size={12}
                        colorData={spyData?.A?.[0]?.[0] ? Array.from(spyData.A[0][0]) : []}
                        showValues onClick={() => onSelectVariable("A")}
                    />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                <div className="text-green-700 font-semibold text-lg">Output</div>
                <div className="flex flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center justify-center font-mono text-sm gap-2">
                        <InlineMath math="ek_{PKE}" />
                        <SquareGrid
                            rows={8} cols={8} size={4}
                            colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []}
                            showValues showTooltip
                            onClick={() => onSelectVariable("encapskey")}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center font-mono text-sm gap-2">
                        <InlineMath math="dk_{PKE}" />
                        <SquareGrid
                            rows={8} cols={8} size={4}
                            colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []}
                            showValues showTooltip
                            onClick={() => onSelectVariable("decapskey")}
                        />
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
