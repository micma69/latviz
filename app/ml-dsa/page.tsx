'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ml_dsa, utils } from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"

export default function MLDSAPage() {
        const executeMLDSA = async (securityLevel: string) => {
            const keys = ml_dsa.ml_dsa65.keygen();

            const msg = utils.utf8ToBytes('Post Quantum Cryptography');
            const sig = ml_dsa.ml_dsa65.sign(keys.secretKey, msg);

            const isValid = ml_dsa.ml_dsa65.verify(keys.publicKey, msg, sig);
            console.log('Signature valid:', isValid);
        }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <Button variant="destructive" size="lg" onClick={() => executeMLDSA("65")}>
                    TEST ML-DSA
                </Button>
            </main>
        </div>
    );
}