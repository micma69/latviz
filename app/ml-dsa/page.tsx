'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from '@/lib/modified-pqc/ml-dsa-modified';
import Link from "next/link";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as utils from '@/lib/modified-pqc/utils';
import { DSAKeygenSpyData, DSASignSpyData, DSAVerifySpyData, createDSASpy, SignIteration } from '@/utils/createSpy';
import SquareGrid from '@/components/ui/gridLattice';
import KeygenOuter from './slides/keygenOuter';
import SignOuter from './slides/signingOuter';
import VerifyOuter from './slides/verifyOuter';
import KeygenInternal from './slides/keygenInternal';
import SignInternal from './slides/signingInternal';
import VerifyInternal from './slides/verifyInternal';
import SignLoop from './slides/signLoop';

export default function MLDSAPage() {
    const [selectedVariable, setSelectedVariable] = useState<string | null>(null);
    const [vizStage, setVizStage] = useState<string | null>(null);
    const [securityLevel, setSecurityLevel] = useState<DsaSecurityLevel>('ml_dsa44');
    const [selectedParam, setSelectedParam] = useState<DsaParamKey>('q');
    const [keys, setKeys] = useState<any>(null);
    const [signature, setSignature] = useState<Uint8Array | null>(null);
    const [message, setMessage] = useState("");

    const [animationStep, setAnimationStep] = useState(0);
    const [animationComplete, setAnimationComplete] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const [step, setStep] = useState(1);
    useEffect(() => setStep(1), [vizStage]);

    const maxStep: Record<string, number> = {
        keygen0: 0,
        keygen1: 5,
        sign0: 4,
        sign1: 5,
        sign2: 0,
        verify0: 6,
        verify1: 5,
    };

    const startAnimation = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setAnimationStep(0);
        setAnimationComplete(false);
        
        setTimeout(() => {
            animateSequence();
        }, 500);
    };

    const animateSequence = () => {
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setAnimationStep(currentStep);
            
            if (currentStep >= 4) {
                clearInterval(interval);
                setAnimationComplete(true);
                setIsAnimating(false);
            }
        }, 1200);
    };

    const resetAnimation = () => {
        setAnimationStep(0);
        setAnimationComplete(false);
        setIsAnimating(false);
    };

    const [keygenSpyData, setKeygenSpyData] = useState<DSAKeygenSpyData | null>(null);
    const [signSpyData, setSignSpyData] = useState<DSASignSpyData | null>(null);
    const [verifySpyData, setVerifySpyData] = useState<DSAVerifySpyData | null>(null);

    const resetAll = (): void => {
        setKeys(null);
        setSignature(null);
        setKeygenSpyData(null);
        setSignSpyData(null);
        setVerifySpyData(null);
    }

    useEffect(() => {
        resetAll();
    }, [securityLevel]);


    const mlDsaLevels = [
        { label: 'ML-DSA-44 (128-bit security)', value: 'ml_dsa44' },
        { label: 'ML-DSA-65 (192-bit security)', value: 'ml_dsa65' },
        { label: 'ML-DSA-87 (256-bit security)', value: 'ml_dsa87' }
    ];

    const mlDsaParams = {
        ml_dsa44: { q: 8380417, zeta: 1753, d: 13, tau: 39, lambda: 128, gamma1: "2^{17}", gamma2: "\\frac{q-1}{88}", k: 4, l: 4, eta: 2, beta: 78, omega: 80 },
        ml_dsa65: { q: 8380417, zeta: 1753, d: 13, tau: 49, lambda: 192, gamma1: "2^{19}", gamma2: "\\frac{q-1}{32}", k: 6, l: 5, eta: 4, beta: 196, omega: 55 },
        ml_dsa87: { q: 8380417, zeta: 1753, d: 13, tau: 60, lambda: 256, gamma1: "2^{19}", gamma2: "\\frac{q-1}{32}", k: 8, l: 7, eta: 2, beta: 120, omega: 75 },
    } as const;

    type DsaSecurityLevel = keyof typeof mlDsaParams;
    type DsaParamKey = keyof typeof mlDsaParams.ml_dsa44;

    const currentParams = mlDsaParams[securityLevel as keyof typeof mlDsaParams];
    const currentParamValue = currentParams?.[selectedParam];

    const parameters = [
        { key: "q", label: "q" },
        { key: "zeta", label: "ζ" },
        { key: "d", label: "d" },
        { key: "tau", label: "τ" },
        { key: "lambda", label: "λ" },
        { key: "gamma1", label: "γ₁" },
        { key: "gamma2", label: "γ₂" },
        { key: "k", label: "k" },
        { key: "l", label: "l" },
        { key: "eta", label: "η" },
        { key: "beta", label: "β" },
        { key: "omega", label: "ω" },
    ];

    const executeMLDSA = async (operation: string) => {
        const spy = createDSASpy();
        const algorithm = pqc.ml_dsa[securityLevel as keyof typeof pqc.ml_dsa](spy);
        const msgBytes = utils.utf8ToBytes(message);

        spy.subscribe((stage, state) => {
            if (stage === 'keygen') setKeygenSpyData({ ...state.keygen } as DSAKeygenSpyData);
            if (stage === 'sign') setSignSpyData({ ...state.sign } as DSASignSpyData);
            if (stage === 'verify') setVerifySpyData({ ...state.verify } as DSAVerifySpyData);
        });

        switch (operation) {
            case "Key Generation": {
                const newKeys = algorithm.keygen();
                setKeys(newKeys);
                setSignature(null);
                break;
            }

            case "Sign Message": {
                if (!keys) {
                    return;
                }

                const sig = algorithm.sign(keys.secretKey, msgBytes);
                setSignature(sig);
                break;
            }

            case "Verify Signature": {
                if (!keys || !signature) {
                    return;
                }

                const valid = algorithm.verify(
                    keys.publicKey,
                    msgBytes,
                    signature
                );

                break;
            }

            case "Complete Flow": {
                const signerKeys = algorithm.keygen();
                const signature = algorithm.sign(signerKeys.secretKey, msgBytes);
                const isValid = algorithm.verify(signerKeys.publicKey, msgBytes, signature);
                
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
                return
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
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-DSA Digital Signature Process</h2>
                    
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        <div className="flex flex-col md:flex-row items-center justify-center mb-8">
                            {/* Flow diagram */}
                            <div className="flex flex-col md:flex-row items-center justify-center w-full">
                                
                                {/* Signer Side (Alice) */}
                                <div className="w-full md:w-5/12 p-4">
                                    <div className={`bg-blue-50 rounded-xl border border-blue-200 p-6 transition-all duration-500 
                                        ${animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                        <div className="flex items-center mb-4">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-blue-900">Signer (Alice)</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {/* Step 1: Generate Keys */}
                                            <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 
                                                ${animationStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-blue-800">1. Generates Key Pair</p>
                                                    {animationStep >= 1 && (
                                                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex justify-center space-x-4 mt-2">
                                                    <div className="text-center">
                                                        <div className="w-12 h-8 bg-yellow-400 rounded border-2 border-yellow-600 mx-auto flex items-center justify-center">
                                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Public Key</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-12 h-8 bg-gray-400 rounded border-2 border-gray-600 mx-auto flex items-center justify-center">
                                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Private Key</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Step 2: Sign Message */}
                                            <div className={`bg-white rounded-lg p-4 border border-blue-100 transition-all duration-500 delay-300
                                                ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-blue-800">2. Signs Message (with Private Key)</p>
                                                    {animationStep >= 2 && (
                                                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                
                                                {/* Visual flow of signing process */}
                                                <div className="flex justify-center items-center space-x-2 mt-3">
                                                    {/* Input: Message */}
                                                    <div className="text-center">
                                                        <div className="w-16 h-10 bg-gray-200 rounded border border-gray-300 mx-auto flex items-center justify-center">
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Message</p>
                                                    </div>
                                                    
                                                    {/* Arrow indicating flow */}
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                    
                                                    {/* Private Key (shown as input to signing) */}
                                                    <div className="text-center">
                                                        <div className="w-16 h-10 bg-gray-400 rounded border-2 border-gray-600 mx-auto flex items-center justify-center relative">
                                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Private Key</p>
                                                    </div>
                                                    
                                                    {/* Arrow */}
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                    
                                                    {/* Output: Signature */}
                                                    <div className="text-center">
                                                        <div className="w-16 h-10 bg-purple-400 rounded border-2 border-purple-600 mx-auto flex items-center justify-center">
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Signature</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Middle Arrows */}
                                <div className="w-full md:w-2/12 py-4 flex flex-col items-center justify-center relative">
                                    <div className={`hidden md:block w-full h-0.5 bg-blue-300 my-2 transition-all duration-700 
                                        ${animationStep >= 2 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}></div>
                                    <div className="md:hidden h-20 w-0.5 bg-blue-300 my-2"></div>
                                    
                                    {/* Text above the line */}
                                    {animationStep >= 2 && (
                                        <div className="absolute -top-6 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full whitespace-nowrap shadow-sm">
                                            Public Key + Signature + Message →
                                        </div>
                                    )}
                                    
                                    <div className={`bg-white rounded-full p-3 shadow-md transition-all duration-700 z-10
                                        ${animationStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                        </svg>
                                    </div>
                                </div>
                                
                                {/* Verifier Side (Bob) */}
                                <div className="w-full md:w-5/12 p-4">
                                    <div className={`bg-green-50 rounded-xl border border-green-200 p-6 transition-all duration-500 
                                        ${animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                                        <div className="flex items-center mb-4">
                                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-green-900">Verifier (Bob)</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {/* Step 3: Verify Signature */}
                                            <div className={`bg-white rounded-lg p-4 border border-green-100 transition-all duration-500 
                                                ${animationStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-sm font-medium text-green-800">3. Verifies Signature</p>
                                                    {animationStep >= 3 && (
                                                        <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="flex justify-center items-center space-x-3 mt-2">
                                                    <div className="text-center">
                                                        <div className="w-12 h-8 bg-yellow-400 rounded border-2 border-yellow-600 mx-auto flex items-center justify-center">
                                                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                            </svg>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Public Key</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-12 h-8 bg-gray-200 rounded border border-gray-300 mx-auto flex items-center justify-center">
                                                            <span className="text-xs text-gray-600">Msg</span>
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Message</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-12 h-8 bg-purple-400 rounded border-2 border-purple-600 mx-auto"></div>
                                                        <p className="text-xs text-gray-600 mt-1">Signature</p>
                                                    </div>
                                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div className="text-center">
                                                        <div className={`w-12 h-8 rounded border-2 mx-auto flex items-center justify-center
                                                            ${animationComplete ? 'bg-green-400 border-green-600' : 'bg-gray-200 border-gray-300'}`}>
                                                            {animationComplete ? (
                                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : (
                                                                <span className="text-xs text-gray-500">?</span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">Valid?</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Completion Message */}
                        <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 transition-all duration-700 
                            ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <div className="flex items-start">
                                <svg className="h-6 w-6 mr-2 text-green-500 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="font-semibold text-green-800 mb-1">✓ Signature Verified Successfully!</p>
                                    <p className="text-sm text-green-700 mb-2">
                                        Bob has confirmed that the message was genuinely signed by Alice and hasn't been tampered with. The signature provides authenticity (Alice really signed it) and integrity (the message hasn't changed).
                                    </p>
                                    <p className="text-sm text-green-700">
                                        (During an actual digital signature process, only the public key, message, and signature are transmitted. The private key remains confidential to the signer (Alice). Anyone with Alice's public key can verify her signatures, but only Alice can create them.)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-center gap-4 mt-6">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={startAnimation}
                            disabled={isAnimating}
                        >
                            {isAnimating ? "Animating..." : "Animate Digital Signature"}
                        </Button>
                        
                        {animationStep > 0 && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={resetAnimation}
                                disabled={isAnimating}
                            >
                                ↺ Reset
                            </Button>
                        )}
                    </div>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-DSA Full Visualization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-[2.5fr_1.5fr] gap-6">
                        <div className="flex flex-col gap-4">
                            <main className="flex-1 rounded-xl bg-white dark:bg-zinc-900 shadow-xl p-5 min-h-[620.65px]">
                                <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 p-5 h-full items-center justify-center">
                                    {(vizStage === null || vizStage === "home") && (
                                        <div className="flex flex-col gap-12 items-center justify-center">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => {if (!keygenSpyData) {executeMLDSA("Key Generation");} setVizStage("keygen0");}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Key Generation
                                            </Button>
                                            <div className="flex flex-col gap-4">
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    disabled={!keys || message.length === 0}
                                                    onClick={() => {if (!signSpyData) {executeMLDSA("Sign Message");} setVizStage("sign0");}}
                                                    className="cursor-pointer h-14 px-10 text-lg"
                                                >
                                                    Sign Message
                                                </Button>
                                                {keys && (
                                                    <div>
                                                        <textarea
                                                            value={message}
                                                            onChange={(e) => {setMessage(e.target.value); setSignSpyData(null); setSignature(null)}}
                                                            placeholder="Enter a message before signing!"
                                                            className="
                                                            w-full
                                                            min-h-[120px]
                                                            rounded-lg
                                                            border border-gray-300 dark:border-zinc-700
                                                            bg-white dark:bg-zinc-900
                                                            p-3
                                                            text-sm
                                                            text-gray-900 dark:text-gray-100
                                                            placeholder:text-gray-400
                                                            focus:outline-none
                                                            focus:ring-2
                                                            focus:ring-blue-500
                                                            focus:border-blue-500
                                                            resize-none
                                                            transition
                                                            "
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled={!signature}
                                                onClick={() => {if (!verifySpyData) {executeMLDSA("Verify Signature");} setVizStage("verify0");}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Verify Signature
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                disabled={!keygenSpyData}
                                                onClick={() => {resetAll()}}
                                                className="cursor-pointer h-14 px-10 text-lg"
                                            >
                                                Reset
                                            </Button>
                                        </div>
                                    )}

                                    {vizStage === "keygen0" && <KeygenOuter onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} />}
                                    {vizStage === "keygen1" && <KeygenInternal onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} />}
                                    {vizStage === "sign0" && <SignOuter onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={signSpyData} />}
                                    {vizStage === "sign1" && <SignInternal onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={signSpyData} />}
                                    {vizStage === "sign2" && <SignLoop onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={signSpyData} />}
                                    {vizStage === "verify0" && <VerifyOuter onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={verifySpyData} />}
                                    {vizStage === "verify1" && <VerifyInternal onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={verifySpyData} />}
                                    
                                </div>
                            </main>
                        </div>
                        <div className="relative">
                            <div className="sticky top-4 flex flex-col gap-4 h-[calc(100vh-3rem)]">
                                <div className="flex flex-col items-center rounded-xl bg-white gap-4 dark:bg-zinc-900 text-sm shadow-xl p-5">
                                    Select Security Level
                                    <Select value={securityLevel} onValueChange={setSecurityLevel as (value: string) => void}>
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
                                    {/* Clickable parameter row */}
                                    <div className="flex flex-wrap justify-center gap-1.5 w-full">
                                    {parameters.map((param) => (
                                        <button
                                        key={param.key}
                                        onClick={() => setSelectedParam(param.key as DsaParamKey)}
                                        className={`
                                            px-2 py-1 rounded-md text-[11px]  transition-all
                                            ${selectedParam === param.key 
                                            ? "bg-blue-600 text-white shadow-sm" 
                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                            }
                                        `}
                                        >
                                        {param.label}
                                        </button>
                                    ))}
                                    </div>

                                    {/* Value panel */}
                                    {currentParams && (
                                    <div className="w-full mt-1 p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
                                        <div className="text-base  font-bold break-all">
                                            <InlineMath math={String(currentParamValue)} />
                                        </div>
                                    </div>
                                    )}
                                </div>
                                <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 h-full items-center justify-center p-2">
                                    {(vizStage === null || selectedVariable === null) &&
                                        <div>Click a variable to see it in full!</div>
                                    }

                                    {/* ── KEYGEN ── */}
                                    {selectedVariable === "xi_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\xi \in \{0,1\}^{256}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.seed?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.seed ? Array.from(keygenSpyData.seed) : []} showValues variableKey='xi_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho \in \{0,1\}^{256}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.rho ? Array.from(keygenSpyData.rho) : []} showValues variableKey='rho_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rhop_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho' \in \{0,1\}^{512}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.rhoPrime?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.rhoPrime ? Array.from(keygenSpyData.rhoPrime) : []} showValues variableKey='rhop_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "K_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K \in \{0,1\}^{256}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.K?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.K ? Array.from(keygenSpyData.K) : []} showValues variableKey='K_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times \ell}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.A?.[0]?.[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.A?.[0]?.[0] ? Array.from(keygenSpyData.A[0][0]) : []} showValues variableKey='A_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s1_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="s_1 \in S_\eta^\ell" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.s1[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.s1[0] ? Array.from(keygenSpyData.s1[0]) : []} showValues variableKey='s1_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s2_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="s_2 \in S_\eta^k" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.s2[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.s2[0] ? Array.from(keygenSpyData.s2[0]) : []} showValues variableKey='s2_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="t = As_1 + s_2 \in \mathbb{Z}_q^k" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.t[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.t[0] ? Array.from(keygenSpyData.t[0]) : []} showValues variableKey='t_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t0_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="t_0 \in \mathbb{Z}_q^k" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.t0[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.t0[0] ? Array.from(keygenSpyData.t0[0]) : []} showValues variableKey='t0_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t1_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="t_1 \in \mathbb{Z}_q^k" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.t1[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.t1[0] ? Array.from(keygenSpyData.t1[0]) : []} showValues variableKey='t1_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "publickey" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="pk \in \mathbb{B}^{32 + 32k(\mathrm{bitlen}(q-1) - d)}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.pk?.length ?? 0) / 8)} cols={8} size={20} colorData={keygenSpyData?.pk ? Array.from(keygenSpyData.pk) : []} showValues variableKey='publickey' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "secretkey" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="sk \in \mathbb{B}^{32+32+64+32((\ell+k)\cdot\mathrm{bitlen}(2\eta)+d_k)}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.sk?.length ?? 0) / 8)} cols={8} size={20} colorData={keygenSpyData?.sk ? Array.from(keygenSpyData.sk) : []} showValues variableKey='secretkey' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "tr_keygen" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{tr} \in \{0,1\}^{512}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((keygenSpyData?.tr?.length ?? 0) / 4)} cols={4} size={20} colorData={keygenSpyData?.tr ? Array.from(keygenSpyData.tr) : []} showValues variableKey='tr_keygen' />
                                            </div>
                                        </div>
                                    }

                                    {/* ── SIGNING ── */}
                                    {selectedVariable === "message_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="M" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.msg?.length ?? 0) / 4)} cols={4} size={20} colorData={(signSpyData?.msg ? Array.from(signSpyData.msg) : []).slice(2)} showValues variableKey='message_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rnd_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{rnd} \in \{0,1\}^{256}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.rnd?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.rnd ? Array.from(signSpyData.rnd) : []} showValues variableKey='rnd_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ctx_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{ctx}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.ctx?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.ctx ? Array.from(signSpyData.ctx) : []} showValues variableKey='ctx_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "M_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="M" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.msg?.length ?? 0) / 4)} cols={4} size={20} colorData={(signSpyData?.msg ? Array.from(signSpyData.msg) : []).slice(2)} showValues variableKey='M_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "Mp_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="M'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.M?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.M ? Array.from(signSpyData.M) : []} showValues variableKey='Mp_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.rho ? Array.from(signSpyData.rho) : []} showValues variableKey='rho_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "K_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="K" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.K?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.K ? Array.from(signSpyData.K) : []} showValues variableKey='K_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "tr_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{tr}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.tr?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.tr ? Array.from(signSpyData.tr) : []} showValues variableKey='tr_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s1_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="s_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.s1[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.s1[0] ? Array.from(signSpyData.s1[0]) : []} showValues variableKey='s1_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "s2_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="s_2" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.s2[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.s2[0] ? Array.from(signSpyData.s2[0]) : []} showValues variableKey='s2_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t0_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="t_0" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.t0[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.t0[0] ? Array.from(signSpyData.t0[0]) : []} showValues variableKey='t0_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times \ell}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.A?.[0]?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.A?.[0]?.[0] ? Array.from(signSpyData.A[0][0]) : []} showValues variableKey='A_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "mu_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mu \in \{0,1\}^{512}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.mu?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.mu ? Array.from(signSpyData.mu) : []} showValues variableKey='mu_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rhop_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho''" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.rhoPrime?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.rhoPrime ? Array.from(signSpyData.rhoPrime) : []} showValues variableKey='rhop_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "y_loop" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="y \in S_{\gamma_1 - 1}^\ell" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.y?.[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.y?.[0] ? Array.from(signSpyData.y[0]) : []} showValues variableKey='y_loop' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "w_loop" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="w = Ay" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.w?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.w?.[0] ? Array.from(signSpyData.w[0]) : []} showValues variableKey='w_loop' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "w1_loop" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="w_1 = \mathrm{HighBits}(w)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.w1?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.w1?.[0] ? Array.from(signSpyData.w1[0]) : []} showValues variableKey='w1_loop' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "tildec_loop" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\tilde{c} \in \{0,1\}^{256}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.cTilde?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.cTilde ? Array.from(signSpyData.cTilde) : []} showValues variableKey='tildec_loop' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c_loop" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c \in B_{60}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.c?.length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.c ? Array.from(signSpyData.c) : []} showValues variableKey='c_loop' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "z_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="z = y + cs_1" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.z?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.z?.[0] ? Array.from(signSpyData.z[0]) : []} showValues variableKey='z_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "r0_sign" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="r_0 = \mathrm{LowBits}(w - cs_2)" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.r0?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={signSpyData?.r0?.[0] ? Array.from(signSpyData.r0[0]) : []} showValues variableKey='r0_sign' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "signature" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\sigma" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((signSpyData?.signature?.length ?? 0) / 8)} cols={8} size={20} colorData={signSpyData?.signature ? Array.from(signSpyData.signature) : []} showValues variableKey='signature' />
                                            </div>
                                        </div>
                                    }

                                    {/* ── VERIFY ── */}
                                    {selectedVariable === "M_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="M" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.msg?.length ?? 0) / 4)} cols={4} size={20} colorData={(verifySpyData?.msg ? Array.from(verifySpyData.msg) : []).slice(2)} showValues variableKey='M_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "message_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="M" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.msg?.length ?? 0) / 4)} cols={4} size={20} colorData={(verifySpyData?.msg ? Array.from(verifySpyData.msg) : []).slice(2)} showValues variableKey='message_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "ctx_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{ctx}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.ctx?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.ctx ? Array.from(verifySpyData.ctx) : []} showValues variableKey='ctx_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "Mp_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="M'" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.msg?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.msg ? Array.from(verifySpyData.msg) : []} showValues variableKey='Mp_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "A_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="A \in \mathbb{Z}_q^{k \times \ell}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.A?.[0]?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.A?.[0]?.[0] ? Array.from(verifySpyData.A[0][0]) : []} showValues variableKey='A_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "rho_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\rho" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.rho?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.rho ? Array.from(verifySpyData.tr) : []} showValues variableKey='rho_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "t1_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{t_1}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.t1[0]?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.t1[0] ? Array.from(verifySpyData.t1[0]) : []} showValues variableKey='t1_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "tr_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mathrm{tr}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.tr?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.tr ? Array.from(verifySpyData.tr) : []} showValues variableKey='tr_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "mu_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\mu \in \{0,1\}^{512}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.mu?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.mu ? Array.from(verifySpyData.mu) : []} showValues variableKey='mu_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "tildec_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\tilde{c}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.cTilde?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.cTilde ? Array.from(verifySpyData.cTilde) : []} showValues variableKey='tildec_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "z_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="z" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.z?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.z?.[0] ? Array.from(verifySpyData.z[0]) : []} showValues variableKey='z_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "h_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="h" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.h?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.h?.[0] ? Array.from(verifySpyData.h[0]) : []} showValues variableKey='h_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "c_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="c \in B_{60}" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.c?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.c ? Array.from(verifySpyData.c) : []} showValues variableKey='c_verify' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "wapprox" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="w' \approx Az - ct_1 \cdot 2^d" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.wPrime?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.wPrime?.[0] ? Array.from(verifySpyData.wPrime[0]) : []} showValues variableKey='wapprox' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "wp1" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="w_1' = \mathrm{UseHint}(h, w')" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.w1?.[0].length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.w1?.[0] ? Array.from(verifySpyData.w1[0]) : []} showValues variableKey='wp1' />
                                            </div>
                                        </div>
                                    }

                                    {selectedVariable === "tildecp_verify" &&
                                        <div className="flex flex-col items-center gap-4">
                                            <div><InlineMath math="\tilde{c}' = H(\mu \| w_1')" /></div>
                                            <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                                                <SquareGrid algorithm="mldsa" rows={Math.ceil((verifySpyData?.cTilde?.length ?? 0) / 4)} cols={4} size={20} colorData={verifySpyData?.cTilde ? Array.from(verifySpyData.cTilde) : []} showValues variableKey='tildecp_verify' />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col rounded-xl bg-white dark:bg-zinc-900 h-48 items-center justify-center p-2">
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-zinc-800 rounded-full px-2 py-1 shadow-sm">
                                        <button 
                                            onClick={() => setStep(s => s - 1)} 
                                            disabled={step <= 1}
                                            className={`
                                                p-2 rounded-full transition-all duration-200
                                                ${step <= 1 
                                                    ? "text-gray-400 cursor-not-allowed opacity-50" 
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:shadow-md active:scale-95 cursor-pointer"
                                                }
                                            `}
                                            aria-label="Previous step"
                                        >
                                            <ChevronLeftIcon className="size-5" />
                                        </button>
                                        <div className="min-w-[60px] text-center">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Step {step}
                                            </span>
                                            <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5">
                                                / {maxStep[vizStage ?? ""] ?? 1}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => setStep(s => s + 1)} 
                                            disabled={step >= (maxStep[vizStage ?? ""] ?? 1)}
                                            className={`
                                                p-2 rounded-full transition-all duration-200
                                                ${step >= (maxStep[vizStage ?? ""] ?? 1)
                                                    ? "text-gray-400 cursor-not-allowed opacity-50" 
                                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:shadow-md active:scale-95 cursor-pointer"
                                                }
                                            `}
                                            aria-label="Next step"
                                        >
                                            <ChevronRightIcon className="size-5" />
                                        </button>
                                    </div>
                                    <div className="flex gap-1.5 mt-3">
                                        {Array.from({ length: maxStep[vizStage ?? ""] ?? 1 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`
                                                    h-1.5 rounded-full transition-all duration-200
                                                    ${i + 1 === step 
                                                        ? "w-4 bg-blue-500" 
                                                        : "w-1.5 bg-gray-300 dark:bg-zinc-600"
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        </div> 
    );
}