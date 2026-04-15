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
        <div className="flex flex-col gap-6">
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onChangeStage("sign0")}
                className="flex justify-start cursor-pointer"
                >
                <ChevronLeftIcon className="size-6" /> BACK
            </Button>
        </div>
    );
}