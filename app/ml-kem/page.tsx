'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MLKEMPage() {
    const [securityLevel, setSecurityLevel] = useState("ml_kem768");
    const [aliceKeys, setAliceKeys] = useState<any>(null);
    const [cipherText, setCipherText] = useState<any>(null);
    const [sharedSecret, setsharedSecret] = useState<any>(null);
    const [decapsulatedSecret, setDecapsulatedSecret] = useState<Uint8Array | null>(null);
    const [output, setOutput] = useState<string[]>([]);

      // Expanded states
    const [expandedPublicKey, setExpandedPublicKey] = useState(false);
    const [expandedSecretKey, setExpandedSecretKey] = useState(false);
    const [expandedCipherText, setExpandedCipherText] = useState(false);
    const [expandedSharedSecret, setExpandedSharedSecret] = useState(false);
    const [expandedDecapsulatedSecret, setExpandedDecapsulatedSecret] = useState(false);

      // Instead of binary visualization states, we'll use lattice states
    const [showLatticePublicKey, setShowLatticePublicKey] = useState(false);
    const [showLatticeSecretKey, setShowLatticeSecretKey] = useState(false);
    const [showLatticeCipherText, setShowLatticeCipherText] = useState(false);
    const [showLatticeSharedSecret, setShowLatticeSharedSecret] = useState(false);
    const [showLatticeDecapsulatedSecret, setShowLatticeDecapsulatedSecret] = useState(false);

    const addOutput = (message: string) => {
        setOutput(prev => [...prev, message]);
    };

    useEffect(() => {
        setAliceKeys(null);
        setCipherText(null);
        setsharedSecret(null);
        setOutput(["Security level changed."]);
    }, [securityLevel]);

    const mlKemLevels = [
        { label: 'ML-KEM-512 (128-bit security)', value: 'ml_kem512' },
        { label: 'ML-KEM-768 (192-bit security)', value: 'ml_kem768' },
        { label: 'ML-KEM-1024 (256-bit security)', value: 'ml_kem1024' }
    ];

    const operations = [
        'Key Generation',
        'Encapsulation',
        'Decapsulation',
    ];

    const executeMLKEM = async (operation: string) => {
        const kem = pqc.ml_kem[securityLevel];

        switch (operation) {
            case "Key Generation": {
                const keys = kem.keygen();
                setAliceKeys(keys);
                setCipherText(null);
                setsharedSecret(null);
                addOutput("Key pair generated.");
                addOutput(`Public key length: ${keys.publicKey.length} bytes`);
                addOutput(`Secret key length: ${keys.secretKey.length} bytes`);
                break;
            }

            case "Encapsulation": {
                if (!aliceKeys) {
                    console.log("Generate keys first!");
                    return;
                }

                const result = kem.encapsulate(aliceKeys.publicKey);
                setCipherText(result.cipherText);
                setsharedSecret(result.sharedSecret);
                addOutput("Encapsulation complete.");
                addOutput(`Ciphertext length: ${result.cipherText.length} bytes`);
                }
                break;

            case "Decapsulation": {
                if (!aliceKeys || !cipherText) {
                    console.log("Need keys and ciphertext first!");
                    return;
                }

                const aliceShared = kem.decapsulate(
                    cipherText,
                    aliceKeys.secretKey
                );

                setDecapsulatedSecret(aliceShared);

                const match =
                    Buffer.from(aliceShared).toString("hex") ===
                    Buffer.from(sharedSecret).toString("hex");

                addOutput("Decapsulation complete.");
                addOutput(`Secrets match: ${match ? "YES" : "NO"}`);  
                break;
            }
        }
    };

    const formatArray = (bytes: Uint8Array | null) => {
    if (!bytes) return "";
    return `[${Array.from(bytes).join(", ")}]`;
    };

    const previewArray = (bytes: Uint8Array | null, count = 5) => {
        if (!bytes) return "";
        const arr = Array.from(bytes.slice(0, count));
        return `[${arr.join(", ")}, ...]`;
    };

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6 bg-zinc-200 p-6 dark:bg-black">
            <div className="flex flex-col gap-4">
                <Link href="/">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-fit text-sm"
                    >
                        ← Back
                    </Button>
                </Link>
                <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5">
                    <div className="rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full flex items-center justify-center text-zinc-500 text-sm">
                        FOR THE VISUALIZATION
                    </div>
                </main>
            </div>
            <div className="p-6 sticky top-6 h-[calc(100vh-3rem)] flex flex-col gap-4">
                <div className="rounded-xl bg-zinc-900 text-green-400 font-mono text-xs shadow-xl p-6 h-48 overflow-y-auto">
                    {output.length === 0 ? (
                        <div className="text-zinc-500">...</div>
                    ) : (
                        output.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))
                    )}
                </div>
                <div className="overflow-y-auto flex flex-col gap-4 pr-2">
                    <div className="flex flex-col items-center gap-4 rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5">
                        Select Security Level
                        <Select value={securityLevel} onValueChange={setSecurityLevel}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Security Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {mlKemLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                        <div className="flex flex-row gap-x-4">
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => executeMLKEM("Key Generation")}
                            >
                                Key Generation
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                            >
                                Start Animation
                            </Button>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                            Public Key
                            <div className="rounded-2xl bg-slate-100 dark:bg-zinc-900 p-3 h-40">
                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">
                                    {!aliceKeys ? (
                                        <div className="text-zinc-500">No key generated</div>
                                    ) : (
                                        <>
                                            <div className="break-all">
                                                {expandedPublicKey
                                                    ? formatArray(aliceKeys.publicKey)
                                                    : previewArray(aliceKeys.publicKey)}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpandedPublicKey(!expandedPublicKey)}
                                            >
                                                {expandedPublicKey ? "Collapse" : "Expand"}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                            Secret Key
                            <div className="rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                    {!aliceKeys ? (
                                        <div className="text-zinc-500">No key generated</div>
                                    ) : (
                                        <>
                                            <div className="break-all">
                                                {expandedSecretKey
                                                    ? formatArray(aliceKeys.secretKey)
                                                    : previewArray(aliceKeys.secretKey)}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpandedSecretKey(!expandedSecretKey)}
                                            >
                                                {expandedSecretKey ? "Collapse" : "Expand"}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                        <div className="flex flex-row gap-x-4">
                            <Button
                                variant="secondary"
                                size="lg"
                                disabled={!aliceKeys}
                                onClick={() => executeMLKEM("Encapsulation")}
                            >
                                Encapsulation
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                disabled={!aliceKeys}
                            >
                                Start Animation
                            </Button>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                            <div className="flex flex-col gap-y-2 w-full">
                                Cipher Text
                                <div className="rounded-2xl bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                    <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">
                                        {!cipherText ? (
                                            <div className="text-zinc-500">No ciphertext generated</div>
                                        ) : (
                                            <>
                                                <div className="break-all">
                                                    {expandedCipherText
                                                        ? formatArray(cipherText)
                                                        : previewArray(cipherText)}
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setExpandedCipherText(!expandedCipherText)}
                                                >
                                                    {expandedCipherText ? "Collapse" : "Expand"}
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-y-2 w-full">
                                Shared Secret
                                <div className="rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                    <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                        {!sharedSecret ? (
                                            <div className="text-zinc-500">No secret generated</div>
                                        ) : (
                                            <>
                                                <div className="break-all">
                                                    {expandedSharedSecret
                                                        ? formatArray(sharedSecret)
                                                        : previewArray(sharedSecret)}
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setExpandedSharedSecret(!expandedSharedSecret)}
                                                >
                                                    {expandedSharedSecret ? "Collapse" : "Expand"}
                                                </Button>
                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                        <div className="flex flex-row gap-x-4">
                            <Button
                                variant="secondary"
                                size="lg"
                                disabled={!cipherText}
                                onClick={() => executeMLKEM("Decapsulation")}
                            >
                                Decapsulation
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                disabled={!cipherText}
                            >
                                Start Animation
                            </Button>
                        </div>
                        <div className="flex flex-col gap-y-2 w-full">
                            Decapsulated Secret
                            <div className="rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48">
                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                    {!decapsulatedSecret ? (
                                        <div className="text-zinc-500">No key generated</div>
                                    ) : (
                                        <>
                                            <div className="break-all">
                                                {expandedDecapsulatedSecret
                                                    ? formatArray(decapsulatedSecret)
                                                    : previewArray(decapsulatedSecret)}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpandedDecapsulatedSecret(!expandedDecapsulatedSecret)}
                                            >
                                                {expandedDecapsulatedSecret ? "Collapse" : "Expand"}
                                            </Button>
                                        </>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}