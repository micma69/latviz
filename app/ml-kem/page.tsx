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
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[3fr_1fr] gap-6 bg-zinc-200 p-6 dark:bg-black">
            <main className="rounded-2xl bg-white dark:bg-zinc-900 shadow-xl p-10">

            </main>
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl sticky top-6 flex items-center justify-center">
                <div className="bg-secondary-800 p-3 rounded-lg font-mono text-sm h-[600px] overflow-y-auto">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => executeMLKEM("768")}
                    >
                        TEST ML-KEM
                    </Button>
                </div>
            </div>
        </div>
    );
}