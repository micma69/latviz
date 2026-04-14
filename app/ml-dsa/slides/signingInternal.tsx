"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from "@heroicons/react/24/solid";
import SquareGrid from "@/components/ui/gridLattice";
import { DSASignSpyData } from "@/utils/createSpy";

type Step =
    | "y"
    | "w"
    | "w1"
    | "c"
    | "z"
    | "checks"
    | "h"
    | "done";

export default function SignInternal({
    spyData,
    onChangeStage,
}: {
    spyData: DSASignSpyData | null;
    onChangeStage: (stage: string) => void;
}) {
    const [step, setStep] = useState<Step>("y");
    const [playing, setPlaying] = useState(false);

    const steps: Step[] = useMemo(
        () => ["y", "w", "w1", "c", "z", "checks", "h", "done"],
        []
    );

    useEffect(() => {
        if (!playing) return;

        const t = setInterval(() => {
            setStep((prev) => {
                const idx = steps.indexOf(prev);
                if (idx >= steps.length - 1) {
                    setPlaying(false);
                    return prev;
                }
                return steps[idx + 1];
            });
        }, 900);

        return () => clearInterval(t);
    }, [playing, steps]);

    if (!spyData) return null;

    const isActive = (s: Step) => s === step;

    return (
        <div className="flex flex-col gap-6">

            {/* HEADER CONTROLS */}
            <div className="flex gap-2 items-center">
                <Button variant="secondary" size="sm" onClick={() => onChangeStage("home")}>
                    <ChevronLeftIcon className="w-4 h-4" /> BACK
                </Button>

                <Button variant="secondary" size="sm" onClick={() => setPlaying(!playing)}>
                    {playing ? (
                        <PauseIcon className="w-4 h-4" />
                    ) : (
                        <PlayIcon className="w-4 h-4" />
                    )}
                </Button>

                <Button variant="secondary" size="sm" onClick={() => setStep(steps[Math.max(0, steps.indexOf(step) - 1)])}>
                    <BackwardIcon className="w-4 h-4" />
                </Button>

                <Button variant="secondary" size="sm" onClick={() => setStep(steps[Math.min(steps.length - 1, steps.indexOf(step) + 1)])}>
                    <ForwardIcon className="w-4 h-4" />
                </Button>

                <div className="text-sm opacity-70">
                    κ = 0
                </div>
            </div>

            {/* STEP 1: y */}
            {isActive("y") && (
                <div className="flex flex-col gap-2">
                    <div className="text-lg">y = ExpandMask(ρ″, κ)</div>
                    <SquareGrid
                        rows={1}
                        cols={4}
                        rowsExpanded={8}
                        size={12}
                        colorData={spyData?.y ? spyData.y.flatMap(row => Array.from(row)) : []}
                        showValues
                    />
                </div>
            )}

            {/* STEP 2: w = A·y */}
            {isActive("w") && (
                <div className="flex flex-row items-center gap-4">
                    <div className="flex flex-col">
                        <div>A</div>
                        <SquareGrid rows={4} cols={4} rowsExpanded={8} size={10} colorData={spyData.A?.flatMap(inner => inner.flatMap(typed => Array.from(typed))) ?? []} showValues />
                    </div>

                    <div>×</div>

                    <div className="flex flex-col">
                        <div>y</div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.y ? spyData.y.flatMap(row => Array.from(row)) : []} showValues />
                    </div>

                    <div>→</div>

                    <div className="flex flex-col">
                        <div>w</div>
                        <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.w ? spyData.w.flatMap(row => Array.from(row)) : []} showValues />
                    </div>
                </div>
            )}

            {/* STEP 3: w1 */}
            {isActive("w1") && (
                <div className="flex flex-col gap-2">
                    <div>w → HighBits(w) = w1</div>
                    <SquareGrid
                        rows={1}
                        cols={4}
                        rowsExpanded={8}
                        size={12}
                        colorData={spyData?.w1 ? spyData.w1.flatMap(row => Array.from(row)) : []}
                        showValues
                    />
                </div>
            )}

            {/* STEP 4: challenge c */}
            {isActive("c") && (
                <div className="flex flex-col gap-2">
                    <div>c̃ → c</div>
                    <SquareGrid
                        rows={1}
                        cols={4}
                        rowsExpanded={8}
                        size={12}
                        colorData={spyData?.c ? Array.from(spyData.c) : []}
                        showValues
                    />
                </div>
            )}

            {/* STEP 5: z */}
            {isActive("z") && (
                <div className="flex flex-col gap-2">
                    <div>z = y + ⟨cs1⟩</div>
                    <SquareGrid
                        rows={1}
                        cols={4}
                        rowsExpanded={8}
                        size={12}
                        colorData={spyData?.z ? spyData.z.flatMap(row => Array.from(row)) : []}
                        showValues
                    />
                </div>
            )}

            {/* STEP 6: checks */}
            {isActive("checks") && (
                <div className="flex flex-col gap-6">

                    <div className="text-lg">Validity Checks</div>

                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <div>r0</div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.r0 ? spyData.r0.flatMap(row => Array.from(row)) : []} showValues />
                        </div>

                        <div className="flex flex-col">
                            <div>ct0</div>
                            <SquareGrid rows={1} cols={4} rowsExpanded={8} size={12} colorData={spyData?.ct0 ? spyData.ct0.flatMap(row => Array.from(row)) : []} showValues />
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 7: h */}
            {isActive("h") && (
                <div className="flex flex-col gap-2">
                    <div>MakeHint → h</div>
                    <SquareGrid
                        rows={1}
                        cols={4}
                        rowsExpanded={8}
                        size={12}
                        colorData={spyData?.h ? spyData.h.flatMap(row => Array.from(row)) : []}
                        showValues
                    />
                </div>
            )}

            {/* STEP 8: done */}
            {isActive("done") && (
                <div className="flex flex-col gap-2">
                    <div className="text-lg">Signature Output</div>
                    <SquareGrid
                        rows={1}
                        cols={4}
                        rowsExpanded={8}
                        size={12}
                        colorData={spyData?.signature ? Array.from(spyData.signature) : []}
                        showValues
                    />
                </div>
            )}
        </div>
    );
}