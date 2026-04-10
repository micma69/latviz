'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from '@/lib/modified-pqc/ml-dsa-modified';
import Link from "next/link";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as utils from '@/lib/modified-pqc/utils';
import { DSAKeygenSpyData, DSASignSpyData, DSAVerifySpyData, createDSASpy } from '@/utils/createSpy';

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
    
        const [flow, setFlow] = useState<Record<string, unknown> | null>(null);
        const [animationStep, setAnimationStep] = useState(0);
        const [animationComplete, setAnimationComplete] = useState(false);
    
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
            const spy = createDSASpy();
            const algorithm = pqc.ml_dsa[securityLevel as keyof typeof pqc.ml_dsa](spy);
            const msgBytes = utils.utf8ToBytes(message);
    
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
    
                case "Complete Flow": {
                    const signerKeys = algorithm.keygen();
                    const signature = algorithm.sign(signerKeys.secretKey, msgBytes);
                    const isValid = algorithm.verify(signerKeys.publicKey, msgBytes, signature);
    
                    setFlow({
                        message: message,
                        publicKey: Array.from(signerKeys.publicKey).slice(0, 10).concat([0]).slice(0, 10),
                        secretKey: Array.from(signerKeys.secretKey).slice(0, 10).concat([0]).slice(0, 10),
                        signature: Array.from(signature).slice(0, 10).concat([0]).slice(0, 10),
                        isValid: isValid,
                        keyGeneration: {
                            publicKey: Array.from(signerKeys.publicKey),
                            secretKey: Array.from(signerKeys.secretKey),
                            publicKeySize: signerKeys.publicKey.length,
                            secretKeySize: signerKeys.secretKey.length
                        },
                        signing: {
                            message: message,
                            signature: Array.from(signature),
                            signatureSize: signature.length
                        },
                        verification: {
                            message: message,
                            publicKey: Array.from(signerKeys.publicKey),
                            signature: Array.from(signature),
                            isValid: isValid
                        },
                    });
                    
                    return {
                        publicKey: Array.from(signerKeys.publicKey),
                        secretKey: Array.from(signerKeys.secretKey),
                        signature: Array.from(signature),
                        message: message,
                        isValid: isValid,
                        keyGeneration: {
                            publicKey: Array.from(signerKeys.publicKey),
                            secretKey: Array.from(signerKeys.secretKey),
                            publicKeySize: signerKeys.publicKey.length,
                            secretKeySize: signerKeys.secretKey.length,
                        },
                        signing: {
                            message: message,
                            signature: Array.from(signature),
                            signatureSize: signature.length,
                        },
                        verification: {
                            message: message,
                            publicKey: Array.from(signerKeys.publicKey),
                            signature: Array.from(signature),
                            isValid: isValid,
                        },
                    };
                }
    
                default:
                    addOutput("Unknown operation");
            }
        };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 pb-8 border-b border-slate-700 text-slate-400 text-sm">
                    <Link href="/" className="text-blue-400 hover:text-blue-300">
                        ← Back
                    </Link>
                </div>
                {/* prolly add explalations here later */}
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">Key Exchange Flow Visualization</h2>
                    {flow && (
                    <section className="mb-12">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                        {/* Flow diagram */}
                        <div className="flex flex-col md:flex-row items-center justify-center w-full">
                            {/* Alice Side */}
                            <div className="w-full md:w-5/12 p-4">
                            <div className={`bg-blue-50 rounded-xl border border-blue-200 p-6 transition-all duration-500 
                                ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-blue-900">Alice</h3>
                                </div>
                                
                                <div className="space-y-4">
                                <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 
                                    ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-blue-800 mb-2">1. Generates Key Pair</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                    <p><strong>Encapsulation Key:</strong> {Array.isArray(flow.alicePublicKey) ? 
                                        `[${flow.alicePublicKey.join(', ')}${flow.alicePublicKey.length < 10 ? '' : '...'}]` : 
                                        flow.alicePublicKey as React.ReactNode}</p>
                                    <p><strong>Decapsulation Key:</strong> {Array.isArray(flow.alicePrivateKey) ? 
                                        `[${flow.alicePrivateKey.join(', ')}${flow.alicePrivateKey.length < 10 ? '' : '...'}]` :  
                                        flow.alicePrivateKey as React.ReactNode}</p>
                                    </div>
                                </div>
                                
                                <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 delay-700
                                    ${animationStep >= 4 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-blue-800 mb-2">4. Decapsulates Shared Secret</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                    <p><strong>Shared Secret:</strong> {Array.isArray(flow.aliceSharedSecret) ? 
                                        `[${flow.aliceSharedSecret.join(', ')}${flow.aliceSharedSecret.length < 10 ? '' : '...'}]` : 
                                        flow.aliceSharedSecret as React.ReactNode}</p>
                                    {animationComplete && (flow.secretsMatch as boolean) && (
                                        <p className="mt-2 text-green-600 font-semibold">✓ Matches Bob&apos;s secret</p>
                                    )}
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            
                            {/* Middle Arrows */}
                            <div className="w-full md:w-2/12 py-4 flex flex-col items-center justify-center">
                            <div className={`hidden md:block w-full h-0.5 bg-secondary-200 my-2 transition-all duration-700 
                                ${animationStep >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                            <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                            
                            <div className={`bg-white rounded-full p-3 shadow-md transition-all duration-700 
                                ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            
                            <div className={`hidden md:block w-full h-0.5 bg-secondary-200 my-2 transition-all duration-700 
                                ${animationStep >= 3 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                            <div className="md:hidden h-20 w-0.5 bg-secondary-200 my-2"></div>
                            </div>
                            
                            {/* Bob Side */}
                            <div className="w-full md:w-5/12 p-4">
                            <div className={`bg-green-50 rounded-xl border border-green-200 p-6 transition-all duration-500 
                                ${animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                <div className="flex items-center mb-4">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                    <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-green-900">Bob</h3>
                                </div>
                                
                                <div className="space-y-4">
                                <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                    ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-green-800 mb-2">2. Receives Alice&apos;s Encapsulation Key</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                        From encapsulation key, extract the encryption key. Encrypt plaintext into ciphertext, generate shared secret key from encapsulation key.
                                    </div>
                                </div>
                                
                                <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                    ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                    <p className="text-sm font-medium text-green-800 mb-2">3. Encapsulates Shared Secret</p>
                                    <div className="text-xs space-y-1 text-secondary-800">
                                    <p><strong>Ciphertext:</strong> {Array.isArray(flow.cipherText) ? 
                                        `[${flow.cipherText.join(', ')}${flow.cipherText.length < 10 ? '' : '...'}]` : 
                                        flow.cipherText as React.ReactNode}</p>
                                    <p><strong>Shared Secret:</strong> {Array.isArray(flow.bobSharedSecret) ? 
                                        `[${flow.bobSharedSecret.join(', ')}${flow.bobSharedSecret.length < 10 ? '' : '...'}]` : 
                                        flow.bobSharedSecret as React.ReactNode}</p>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        
                        <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all duration-700 
                        ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="flex items-start">
                            <svg className="h-6 w-6 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                            <p className="font-semibold text-yellow-800 mb-1">Security Note:</p>
                            <p className="text-sm text-yellow-700">
                                During an actual key exchange, only the public key and ciphertext would be transmitted across 
                                the network. The shared secret and private key remain confidential to each party.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>
                    )}
                        {/*<div className="rounded-xl">
                            <p className="font-semibold text-yellow-800 mb-1"> Extra Notes:</p>
                            <p className="text-sm text-yellow-700">
                                During an actual key exchange, only the public key and ciphertext would be transmitted across the network. The shared secret and private key remain confidential to each party.</p>
                        </div>*/}
                        <div className="flex justify-center">
                            <Button
                                variant="secondary"
                                size="lg"
                                // /onClick={() => executeMLKEM("Complete Flow")}
                            >
                                WORK IN PROGRESS
                            </Button>
                        </div>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-DSA Full Visualization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr]">
                        <div className="flex flex-col gap-4">
                            <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5">
                                <div className="rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full">
                                    vizstage
                                </div>
                            </main>
                            <div className="rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-4 h-48">
                                selected variable
                            </div>
                        </div>
                        <div className="p-6 sticky h-[calc(100vh-3rem)] flex flex-col gap-4">
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
                                            {mlDsaLevels.map((level) => (
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
                </div>
            </div>
        </div> 
    );
}