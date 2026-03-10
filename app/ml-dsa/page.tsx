'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from 'pqc';
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MLDSAPage() {

    const [securityLevel, setSecurityLevel] = useState("ml_dsa65");
    const [output, setOutput] = useState<string[]>([]);
    const [keys, setKeys] = useState<any>(null);
    const [signature, setSignature] = useState<Uint8Array | null>(null);
    const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
    const [message, setMessage] = useState("");

    const [expandedPublicKey, setExpandedPublicKey] = useState(false);
    const [expandedSecretKey, setExpandedSecretKey] = useState(false);
    const [expandedSignature, setExpandedSignature] = useState(false);

    const addOutput = (msg: string) => {
        setOutput(prev => [...prev, msg]);
    };

    useEffect(() => {
        setKeys(null);
        setSignature(null);
        setVerifyResult(null);
        setOutput(["Security level changed."]);
    }, [securityLevel]);

    const mlDsaLevels = [
        { label: 'ML-DSA-44 (128-bit security)', value: 'ml_dsa44' },
        { label: 'ML-DSA-65 (192-bit security)', value: 'ml_dsa65' },
        { label: 'ML-DSA-87 (256-bit security)', value: 'ml_dsa87' }
    ];

    const formatArray = (bytes: Uint8Array | null) => {
        if (!bytes) return "";
        return `[${Array.from(bytes).join(", ")}]`;
    };

    const previewArray = (bytes: Uint8Array | null, count = 5) => {
        if (!bytes) return "";
        const arr = Array.from(bytes.slice(0, count));
        return `[${arr.join(", ")}, ...]`;
    };

    const executeMLDSA = async (operation: string) => {
        const algorithm = pqc.ml_dsa[securityLevel];
        const msgBytes = pqc.utils.utf8ToBytes(message);

        switch (operation) {
            case "Key Generation": {
                const newKeys = algorithm.keygen();
                setKeys(newKeys);
                setSignature(null);
                setVerifyResult(null);
                addOutput("Key pair generated.");
                addOutput(`Public key length: ${newKeys.publicKey.length} bytes`);
                addOutput(`Secret key length: ${newKeys.secretKey.length} bytes`);
                break;
            }

            case "Sign Message": {
                if (!keys) {
                    addOutput("Generate keys first.");
                    return;
                }

                const sig = algorithm.sign(keys.secretKey, msgBytes);
                setSignature(sig);
                setVerifyResult(null);
                addOutput("Message signed.");
                addOutput(`Signature length: ${sig.length} bytes`);
                break;
            }

            case "Verify Signature": {
                if (!keys || !signature) {
                    addOutput("Need keys and signature first.");
                    return;
                }

                const valid = algorithm.verify(
                    keys.publicKey,
                    msgBytes,
                    signature
                );

                setVerifyResult(valid);
                addOutput(`Signature valid: ${valid ? "YES" : "NO"}`);
                break;
            }

            default:
                addOutput("Unknown operation");
        }
    };

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6 bg-zinc-200 p-6 dark:bg-black">
            <div className="flex flex-col gap-4">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="w-fit text-sm">
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
                                {mlDsaLevels.map(level => (
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
                                onClick={() => executeMLDSA("Key Generation")}
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
                                    {!keys ? (
                                        <div className="text-zinc-500">No key generated</div>
                                    ) : (
                                        <>
                                            <div className="break-all">
                                                {expandedPublicKey
                                                    ? formatArray(keys.publicKey)
                                                    : previewArray(keys.publicKey)}
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
                            <div className="rounded-2xl bg-slate-100 dark:bg-zinc-900 p-3 h-40">
                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">

                                    {!keys ? (
                                        <div className="text-zinc-500">No key generated</div>
                                    ) : (
                                        <>
                                            <div className="break-all">
                                                {expandedSecretKey
                                                    ? formatArray(keys.secretKey)
                                                    : previewArray(keys.secretKey)}
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
                    <div className="flex flex-col gap-2 rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5">
                        Message to Sign
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter message..."
                            className="rounded-md p-2 bg-slate-100 dark:bg-zinc-800"
                        />
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={!keys || message.length === 0}
                            onClick={() => executeMLDSA("Sign Message")}
                        >
                            Sign Message
                        </Button>
                        <div className="flex flex-col gap-y-2 w-full">
                            Signature
                            <div className="rounded-2xl bg-slate-100 dark:bg-zinc-900 p-3 h-40">
                                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono flex flex-col gap-2">
                                    {!signature ? (
                                        <div className="text-zinc-500">No signature generated</div>
                                    ) : (
                                        <>
                                            <div className="break-all">
                                                {expandedSignature
                                                    ? formatArray(signature)
                                                    : previewArray(signature)}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setExpandedSignature(!expandedSignature)}
                                            >
                                                {expandedSignature ? "Collapse" : "Expand"}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-zinc-900 font-mono text-sm shadow-xl p-5 gap-y-4">
                        <Button
                            variant="secondary"
                            size="lg"
                            disabled={!signature}
                            onClick={() => executeMLDSA("Verify Signature")}
                        >
                            Verify Signature
                        </Button>
                        {verifyResult !== null && (
                            <div className={`text-lg font-bold ${verifyResult ? "text-green-500" : "text-red-500"}`}>
                                {verifyResult ? "Signature Valid" : "Signature Invalid"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}