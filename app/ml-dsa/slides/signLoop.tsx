"use client";

import React, { useEffect, useState } from "react";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ArrowLongRightIcon, ArrowLongDownIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import SquareGrid from "@/components/ui/gridLattice";
import { DSASignSpyData } from "@/utils/createSpy";

export default function SignLoop({
    spyData,
    onChangeStage,
    onSelectVariable,
}: {
    spyData: DSASignSpyData | null;
    onChangeStage: (stage: string) => void;
    onSelectVariable: (variable: string) => void;
}) {
    const [iterationIndex, setIterationIndex] = useState(0);
    
    useEffect(() => {
        onSelectVariable("explanation");
    }, []);
    
    // Get current iteration from the iterations array
    const currentIteration = spyData?.iterations?.[iterationIndex];
    const totalIterations = spyData?.iterations?.length || 0;
    const isLastIteration = iterationIndex === totalIterations - 1;
    const isAccepted = currentIteration?.accepted === true;
    
    const goToPrevious = () => {
        if (iterationIndex > 0) {
            setIterationIndex(iterationIndex - 1);
        }
    };
    
    const goToNext = () => {
        if (iterationIndex < totalIterations - 1) {
            setIterationIndex(iterationIndex + 1);
        }
    };
    
    if (!spyData || !spyData.iterations || totalIterations === 0) {
        return (
            <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4">
                <div className="text-gray-500">No iteration data available</div>
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
    
    return (
        <div className="flex flex-col items-center gap-4 h-full w-full justify-center px-4 overflow-y-auto py-4">
            {/* Iteration selector */}
            <div className="flex flex-row gap-4 items-center justify-center bg-gray-100 rounded-xl p-3 w-fit border-2 border-gray-300">
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={goToPrevious}
                    disabled={iterationIndex === 0}
                >
                    Previous
                </Button>
                <div className="font-mono text-sm font-semibold">
                    Iteration {iterationIndex + 1} / {totalIterations} 
                    <span className="ml-2 text-gray-500">(κ = {currentIteration?.kappa})</span>
                </div>
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={goToNext}
                    disabled={isLastIteration}
                >
                    Next
                </Button>
            </div>
            
            <ArrowLongDownIcon className="size-6" />
            
            {/* ρ'' + κ → y */}
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="\rho''" /></div>
                <div><InlineMath math=", \kappa" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="y \in R_q^\ell" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                               colorData={currentIteration?.y?.[0] ? Array.from(currentIteration.y[0]) : []} 
                               showValues={true} variableKey="y_loop" onClick={() => onSelectVariable("y_loop")} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            {/* w = A·y */}
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="A \cdot y" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="w" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                               colorData={currentIteration?.w?.[0] ? Array.from(currentIteration.w[0]) : []} 
                               showValues={true} variableKey="w_loop" onClick={() => onSelectVariable("w_loop")} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            {/* w₁ = HighBits(w) */}
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="\text{HighBits}(w)" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="w_1" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                               colorData={currentIteration?.w1?.[0] ? Array.from(currentIteration.w1[0]) : []} 
                               showValues={true} variableKey="w1_loop" onClick={() => onSelectVariable("w1_loop")} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            {/* c̃ and c */}
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="\tilde{c} = H(\mu \| \mathbf{w}_1)" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                               colorData={currentIteration?.cTilde ? Array.from(currentIteration.cTilde) : []} 
                               showValues={true} variableKey="tildec_loop" onClick={() => onSelectVariable("tildec_loop")} />
                </div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="c = \text{SampleInBall}(\tilde{c})" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                               colorData={currentIteration?.c ? Array.from(currentIteration.c) : []} 
                               showValues={true} variableKey="c_loop" onClick={() => onSelectVariable("c_loop")} />
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            {/* z = y + c·s₁ with norm check */}
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="y + \langle c s_1 \rangle" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="z" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                               colorData={currentIteration?.z?.[0] ? Array.from(currentIteration.z[0]) : []} 
                               showValues={true} variableKey="z_sign" onClick={() => onSelectVariable("z_sign")} />
                    {currentIteration?.zNormInf !== undefined && (
                        <div className={`text-xs font-mono ${currentIteration.zNormInf >= 131072 ? 'text-red-600' : 'text-green-600'}`}>
                            ||z||∞ = {currentIteration.zNormInf}
                        </div>
                    )}
                </div>
            </div>
            <ArrowLongDownIcon className="size-6" />
            {/* r₀ = LowBits(w - c·s₂) with norm check */}
            <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                <div><InlineMath math="\text{LowBits}(\mathbf{w} - \langle c \mathbf{s}_2 \rangle)" /></div>
                <ArrowLongRightIcon className="size-6" />
                <div className="flex flex-col items-center gap-2">
                    <div><InlineMath math="r_0" /></div>
                    <SquareGrid algorithm="mldsa" rows={1} cols={4} rowsExpanded={8} size={12} 
                                colorData={currentIteration?.r0?.[0] ? Array.from(currentIteration.r0[0]) : [] } 
                                showValues={true} variableKey="r0_sign" onClick={() => onSelectVariable("r0_sign")} />
                    {currentIteration?.r0NormInf !== undefined && (
                        <div className={`text-xs font-mono ${currentIteration.r0NormInf >= 95232 ? 'text-red-600' : 'text-green-600'}`}>
                            ||r₀||∞ = {currentIteration.r0NormInf}
                        </div>
                    )}
                </div>
            </div>
            
            {/* If accepted, show hint generation */}
            {isAccepted && currentIteration?.h && (
                <>
                    <ArrowLongDownIcon className="size-6" />
                    
                    <div className="flex flex-row gap-2 items-center justify-center bg-purple-100 rounded-xl p-5 w-fit border-2 border-purple-300">
                        <div><InlineMath math="\text{MakeHint}(-\langle c t_0 \rangle, w - \langle c s_2 \rangle + -\langle c t_0 \rangle)" /></div>
                        <ArrowLongRightIcon className="size-6" />
                        <div className="flex flex-col items-center gap-2">
                            <div><InlineMath math="h" /></div>
                            <div className="text-xs font-mono">
                                Hamming weight: {currentIteration.hammingWeight} / 80
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Status indicator */}
            {currentIteration?.rejected && (
                <div className="text-red-600 font-mono text-sm flex items-center gap-2 bg-red-50 rounded-lg px-4 py-2">
                    <ArrowPathIcon className="size-5" /> 
                    REJECTED: {currentIteration.reason}
                </div>
            )}
            {isAccepted && (
                <div className="text-green-600 font-mono text-sm flex items-center gap-2 bg-green-50 rounded-lg px-4 py-2">
                    ✓ ACCEPTED → signature generated
                </div>
            )}

            {/* Iteration selector */}
            <div className="flex flex-row gap-4 items-center justify-center bg-gray-100 rounded-xl p-3 w-fit border-2 border-gray-300">
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={goToPrevious}
                    disabled={iterationIndex === 0}
                >
                    Previous
                </Button>
                <div className="font-mono text-sm font-semibold">
                    Iteration {iterationIndex + 1} / {totalIterations} 
                    <span className="ml-2 text-gray-500">(κ = {currentIteration?.kappa})</span>
                </div>
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={goToNext}
                    disabled={isLastIteration}
                >
                    Next
                </Button>
            </div>
            
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("sign1")}
                className="flex justify-start cursor-pointer mt-4"
            >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}