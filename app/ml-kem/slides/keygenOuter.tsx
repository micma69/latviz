"use client"
import React, { useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { ArrowLongDownIcon, ChevronLeftIcon } from '@heroicons/react/24/solid';
import { Button } from "@/components/ui/button";
import SquareGrid from "@/components/ui/gridLattice";
import { KeygenSpyData } from '@/utils/createSpy';

export default function KeygenVisualization({
    onSelectVariable,
    onChangeStage,
    spyData,
    step,
}: {
    onSelectVariable: (variable: string) => void;
    onChangeStage: (stage: string) => void;
    spyData: KeygenSpyData | null;
    step: number;
}) {
    useEffect(() => {
        onSelectVariable("keygenBase0");
    }, []);

    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 font-mono">
            <div className="flex flex-col gap-2 items-center justify-center bg-blue-100 rounded-xl p-5 w-fit border-2 border-blue-300">
                <div className="text-blue-700 font-semibold text-lg">Input</div>
                <div className="flex flex-row gap-8 items-center justify-center">
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="d" /></div>
                        <SquareGrid algorithm="mlkem"
                            rows={1} cols={4} rowsExpanded={8} size={12}
                            colorData={spyData?.d ? Array.from(spyData.d) : []}
                            showValues variableKey="d" onClick={() => onSelectVariable("d")}
                        />
                    </div>
                    <div className="flex flex-col items-center  text-sm gap-2">
                        <div><InlineMath math="z" /></div>
                        <SquareGrid algorithm="mlkem"
                            rows={1} cols={4} rowsExpanded={8} size={12}
                            colorData={spyData?.z ? Array.from(spyData.z) : []}
                            showValues variableKey="z_keygen" onClick={() => onSelectVariable("z_keygen")}
                        />
                    </div>
                </div>
            </div>
            {step >= 2 && <>
                <ArrowLongDownIcon className="size-6" />
                <div
                    onClick={() => {
                        onSelectVariable("keygenBase1");
                        onChangeStage("keygen1");
                    }}
                    className="rounded-lg bg-white p-4  text-sm flex cursor-pointer items-center justify-center w-64 shadow-sm border-2 border-gray-300"
                >
                    Kyber-PKE Key Generation
                </div>
            </>}
            {step >= 3 && <>
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-4 items-center">
                        <ArrowLongDownIcon className="size-6" />
                        <div className="flex flex-col gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                            <div className="flex flex-col items-center  text-sm gap-2">
                                <div><InlineMath math="ek_{PKE}" /></div>
                                <SquareGrid algorithm="mlkem"
                                    rows={1} cols={4} rowsExpanded={8} size={12}
                                    colorData={spyData?.ekPKE ? Array.from(spyData.ekPKE) : []}
                                    showValues variableKey="ekPKE_keygen" onClick={() => onSelectVariable("ekPKE_keygen")}
                                />
                            </div>
                        </div>
                        {step >= 4 && <>
                            <ArrowLongDownIcon className="size-6" />
                            <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                                <div className="text-green-700 font-semibold text-lg">Output</div>
                                <div className="flex flex-col items-center  text-sm gap-2">
                                    <div>Encapsulation Key <InlineMath math="ek" /></div>
                                    <SquareGrid algorithm="mlkem"
                                        rows={8} cols={8} size={4}
                                        colorData={spyData?.publicKey}
                                        showValues showTooltip
                                        variableKey="encapskey_keygen" onClick={() => onSelectVariable("encapskey_keygen")}
                                    />
                                </div>
                            </div>
                        </>}
                    </div>
                    <div className="flex flex-col gap-4 items-center">
                        <ArrowLongDownIcon className="size-6" />
                        <div className="flex flex-col gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                            <div className="flex flex-col items-center  text-sm gap-2">
                                <div><InlineMath math="dk_{PKE}" /></div>
                                <SquareGrid algorithm="mlkem"
                                    rows={1} cols={4} rowsExpanded={8} size={12}
                                    colorData={spyData?.dkPKE ? Array.from(spyData.dkPKE) : []}
                                    showValues variableKey="dkPKE_keygen" onClick={() => onSelectVariable("dkPKE_keygen")}
                                />
                            </div>
                        </div>
                        {step >= 4 && <>
                            <ArrowLongDownIcon className="size-6" />
                            <div className="flex flex-col gap-2 items-center justify-center bg-green-100 rounded-xl p-5 w-fit border-2 border-green-300">
                                <div className="text-green-700 font-semibold text-lg">Output</div>
                                <div className="flex flex-col items-center  text-sm gap-2">
                                    <div>Decapsulation Key <InlineMath math="dk" /></div>
                                    <SquareGrid algorithm="mlkem"
                                    rows={8} cols={8} size={4}
                                    colorData={spyData?.secretKey}
                                    showValues showTooltip
                                    variableKey="decapskey_keygen"
                                    onClick={() => onSelectVariable("decapskey_keygen")}
                                    />
                                </div>
                            </div>
                        </>}
                    </div>
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