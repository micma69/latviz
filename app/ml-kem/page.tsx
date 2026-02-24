'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ml_kem, utils } from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function MLKEMPage() {
    const executeMLKEM = async (securityLevel: string) => {
        const aliceKeys = ml_kem.ml_kem768.keygen();

        const { cipherText, sharedSecret: bobShared } = ml_kem.ml_kem768.encapsulate(aliceKeys.publicKey);

        const aliceShared = ml_kem.ml_kem768.decapsulate(cipherText, aliceKeys.secretKey);

        console.log('Alice shared secret:', aliceShared);
        console.log('Bob shared secret:', bobShared);
    }

    return (
        <div className="grid grid-cols-2 flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl m-4 flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">

            </main>
            <div className="flex min-h-screen w-full max-w-3xl m-4 flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Button variant="destructive" size="lg" onClick={() => executeMLKEM("768")}>
                    TEST ML-KEM
                </Button>
            </div>
        </div>
    );
}