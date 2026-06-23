'use client';

import React, { useState, useEffect } from 'react';
import * as pqc from '@/lib/modified-pqc/ml-dsa-modified';
import Link from "next/link";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, KeyIcon, PencilSquareIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VariableDisplay, MatrixDisplay } from "@/components/ui/varDisplay";
import * as utils from '@/lib/modified-pqc/utils';
import { DSAKeygenSpyData, DSASignSpyData, DSAVerifySpyData, createDSASpy } from '@/utils/createSpy';
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
        keygen0: 3,
        keygen1: 9,
        sign0: 6,
        sign1: 7,
        sign2: 1,
        verify0: 5,
        verify1: 10,
    };

    const startAnimation = () => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        setAnimationStep(0);
        setAnimationComplete(false);
        
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setAnimationStep(currentStep);
            
            setAnimationComplete(currentStep >= 3);
            
            if (currentStep >= 4) {
                clearInterval(interval);
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
    const [currentIterationIndex, setCurrentIterationIndex] = useState(0);

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

    const handleIterationChange = (index: number) => {
        setCurrentIterationIndex(index);
    };

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

                algorithm.verify(keys.publicKey, msgBytes, signature);
                break;
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
                    <h2 className="text-2xl font-bold mb-4 text-white flex items-center justify-center">Module Lattice Based Digital Signature Standard (ML-DSA)</h2>
                    <p className="text-slate-300 leading-relaxed mb-4">
                        ML-DSA is a{" "}
                    <Link href="/glossary#latticedef" className="text-blue-400 hover:text-blue-300 underline">
                       lattice-based
                    </Link>{" "}
                    digital signature algorithm standardized by NIST's FIPS 204 publication that provides a quantum resistant method to generate and verify digital signatures. It's set to replace current digital signature algorithms such as RSA (Rivest-Shamir-Adleman) and ECDSA (Elliptic Curve Digital Signature Algorithm) that are quantum vulnerable.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                        ML-DSA is based on the hardness of the{" "}
                    <Link href="/glossary#latticeproblems" className="text-blue-400 hover:text-blue-300 underline">
                        MLWE (Module Learning With Errors)
                    </Link>{" "}
                    problem, which is itself based on the idea of inferring a linear function over noisy data. The problem is considered to be quantum resistant, which carries over to ML-DSA.
                    </p>
                </div>
                <div className="rounded-xl bg-slate-800 p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-white">ML-DSA Digital Signature Process</h2>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
                        {!isAnimating && animationStep === 0 && (
                            <div className="flex flex-row gap-4 h-[575px]">
                                <div className="bg-emerald-50 rounded-lg p-4 flex-1 border border-emerald-200 flex flex-col gap-4 justify-center">
                                    <h3 className="font-semibold text-xl text-emerald-800 text-center mb-2">Key Generation</h3>
                                    <KeyIcon className="size-15 text-emerald-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-emerald-700">Creates a key pair: <strong>private key</strong> (sign) and <strong>public key</strong> (verify)</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-4 flex-1 border border-blue-200 flex flex-col gap-4 justify-center">
                                    <h3 className="font-semibold text-xl text-blue-800 text-center mb-2">Signing</h3>
                                    <PencilSquareIcon className="size-15 text-blue-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-blue-700">Signs a message using the <strong>private key</strong> to produce a digital signature</p>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-4 flex-1 border border-amber-200 flex flex-col gap-4 justify-center">
                                    <h3 className="font-semibold text-xl text-amber-800 text-center mb-2">Verification</h3>
                                    <CheckCircleIcon className="size-15 text-amber-600 mx-auto mb-2" />
                                    <p className="text-sm text-center text-amber-700">Validates the signature using the <strong>public key</strong> to confirm authenticity</p>
                                </div>
                            </div>
                        )}
                        {(isAnimating || animationStep > 0) && ( 
                            <>
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
                                                                <DocumentTextIcon className="size-5 text-white mx-auto" />
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
                                                                <PencilSquareIcon className="size-5 text-white mx-auto" />
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
                                                                <DocumentTextIcon className="size-5 text-white mx-auto" />
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1">Message</p>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="w-12 h-8 bg-purple-400 rounded border-2 border-purple-600 mx-auto flex items-center justify-cente">
                                                                <PencilSquareIcon className="size-5 text-white mx-auto" />
                                                            </div>
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
                        </>)}
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

                                    {vizStage === "keygen0" && <KeygenOuter onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} step={step} />}
                                    {vizStage === "keygen1" && <KeygenInternal onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={keygenSpyData} step={step} />}
                                    {vizStage === "sign0" && <SignOuter onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={signSpyData} step={step} />}
                                    {vizStage === "sign1" && <SignInternal onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={signSpyData} step={step} />}
                                    {vizStage === "sign2" && <SignLoop onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={signSpyData} onIterationChange={handleIterationChange} />}
                                    {vizStage === "verify0" && <VerifyOuter onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={verifySpyData} step={step} />}
                                    {vizStage === "verify1" && <VerifyInternal onSelectVariable={setSelectedVariable} onChangeStage={setVizStage} spyData={verifySpyData} step={step} />}
                                    
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
                                <div className="flex rounded-xl bg-slate-100 dark:bg-zinc-900 h-[360px] items-center justify-center p-2">
                                        {(vizStage === null || selectedVariable === null) &&
                                            <div className="text-center">
                                                <p className="mb-2">Click a variable to see it in full!</p>
                                                <p>Hover over it to see a short description!</p>
                                            </div>
                                        }

                                        {/* ── KEYGEN ── */}
                                        {selectedVariable === "xi_keygen" &&
                                            <VariableDisplay 
                                                math="\xi \in \{0,1\}^{256}"
                                                description="32 byte seed"
                                                data={keygenSpyData?.seed}
                                                variableKey="xi_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rho_keygen" &&
                                            <VariableDisplay 
                                                math="\rho \in \{0,1\}^{256}"
                                                description="32 byte seed for A generation"
                                                data={keygenSpyData?.rho}
                                                variableKey="rho_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rhop_keygen" &&
                                            <VariableDisplay 
                                                math="\rho' \in \{0,1\}^{512}"
                                                description="64 byte seed for K and s₁, s₂"
                                                data={keygenSpyData?.rhoPrime}
                                                variableKey="rhop_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "K_keygen" &&
                                            <VariableDisplay 
                                                math="K \in \{0,1\}^{256}"
                                                description="32 byte key for signing"
                                                data={keygenSpyData?.K}
                                                variableKey="K_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "A_keygen" &&
                                            <MatrixDisplay 
                                                math="A \in \mathbb{Z}_q^{k \times \ell}"
                                                description="k×ℓ matrix of polynomials"
                                                matrix={keygenSpyData?.A}
                                                variableKey="A_keygen"
                                            />
                                        }

                                        {selectedVariable === "s1_keygen" &&
                                            <VariableDisplay 
                                                math="s_1 \in S_\eta^\ell"
                                                description="ℓ polynomials, coefficients in [-η, η]"
                                                data={keygenSpyData?.s1?.[0]}
                                                variableKey="s1_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "s2_keygen" &&
                                            <VariableDisplay 
                                                math="s_2 \in S_\eta^k"
                                                description="k polynomials, coefficients in [-η, η]"
                                                data={keygenSpyData?.s2?.[0]}
                                                variableKey="s2_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t_keygen" &&
                                            <VariableDisplay 
                                                math="t = As_1 + s_2 \in \mathbb{Z}_q^k"
                                                description="k polynomials, public key component"
                                                data={keygenSpyData?.t?.[0]}
                                                variableKey="t_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t0_keygen" &&
                                            <VariableDisplay 
                                                math="t_0 \in \mathbb{Z}_q^k"
                                                description="low bits of t, stored in secret key"
                                                data={keygenSpyData?.t0?.[0]}
                                                variableKey="t0_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t1_keygen" &&
                                            <VariableDisplay 
                                                math="t_1 = \lfloor t / 2^d \rfloor"
                                                description="high bits of t, stored in public key"
                                                data={keygenSpyData?.t1?.[0]}
                                                variableKey="t1_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "tr_keygen" &&
                                            <VariableDisplay 
                                                math="\mathrm{tr} \in \{0,1\}^{512}"
                                                description="64 byte hash of public key"
                                                data={keygenSpyData?.tr}
                                                variableKey="tr_keygen"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "publickey" &&
                                            <VariableDisplay 
                                                math="pk = (\rho, t_1)"
                                                description="public key (32 + 32k bytes)"
                                                data={keygenSpyData?.pk}
                                                variableKey="publickey"
                                                cols={8}
                                            />
                                        }

                                        {selectedVariable === "secretkey" &&
                                            <VariableDisplay 
                                                math="sk = (\rho, K, \mathrm{tr}, s_1, s_2, t_0)"
                                                description="secret key"
                                                data={keygenSpyData?.sk}
                                                variableKey="secretkey"
                                                cols={8}
                                            />
                                        }

                                        {/* ── SIGNING ── */}
                                        {selectedVariable === "message_sign" &&
                                            <VariableDisplay 
                                                math="M \in \{0,1\}^*"
                                                description="input message (variable length)"
                                                data={signSpyData?.msg?.slice ? signSpyData.msg.slice(2) : signSpyData?.msg}
                                                variableKey="message_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rnd_sign" &&
                                            <VariableDisplay 
                                                math="\mathrm{rnd} \in \{0,1\}^{256}"
                                                description="32 byte random for context hashing"
                                                data={signSpyData?.rnd}
                                                variableKey="rnd_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "ctx_sign" &&
                                            <VariableDisplay 
                                                math="\mathrm{ctx}"
                                                description="context string (variable bytes)"
                                                data={signSpyData?.ctx}
                                                variableKey="ctx_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "M_sign" &&
                                            <VariableDisplay 
                                                math="M = \rho \| \mathrm{tr} \| M"
                                                description="prehashed message (64 bytes)"
                                                data={signSpyData?.M}
                                                variableKey="M_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "Mp_sign" &&
                                            <VariableDisplay 
                                                math="M' = H(M, \mathrm{ctx})"
                                                description="hashed message with context (64 bytes)"
                                                data={signSpyData?.msg}
                                                variableKey="Mp_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rho_sign" &&
                                            <VariableDisplay 
                                                math="\rho"
                                                description="32 byte seed from public key"
                                                data={signSpyData?.rho}
                                                variableKey="rho_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "K_sign" &&
                                            <VariableDisplay 
                                                math="K"
                                                description="32 byte key from secret key"
                                                data={signSpyData?.K}
                                                variableKey="K_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "tr_sign" &&
                                            <VariableDisplay 
                                                math="\mathrm{tr}"
                                                description="64 byte hash from secret key"
                                                data={signSpyData?.tr}
                                                variableKey="tr_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "s1_sign" &&
                                            <VariableDisplay 
                                                math="s_1 \in S_\eta^\ell"
                                                description="ℓ polynomials from secret key"
                                                data={signSpyData?.s1?.[0]}
                                                variableKey="s1_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "s2_sign" &&
                                            <VariableDisplay 
                                                math="s_2 \in S_\eta^k"
                                                description="k polynomials from secret key"
                                                data={signSpyData?.s2?.[0]}
                                                variableKey="s2_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t0_sign" &&
                                            <VariableDisplay 
                                                math="t_0"
                                                description="low bits from secret key"
                                                data={signSpyData?.t0?.[0]}
                                                variableKey="t0_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "A_sign" &&
                                            <MatrixDisplay 
                                                math="A \in \mathbb{Z}_q^{k \times \ell}"
                                                description="matrix from public key"
                                                matrix={signSpyData?.A}
                                                variableKey="A_sign"
                                            />
                                        }

                                        {selectedVariable === "mu_sign" &&
                                            <VariableDisplay 
                                                math="\mu \in \{0,1\}^{512}"
                                                description="64 byte hash of tr ∥ M'"
                                                data={signSpyData?.mu}
                                                variableKey="mu_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "rhop_sign" &&
                                            <VariableDisplay 
                                                math="\rho''"
                                                description="64 byte seed for y sampling"
                                                data={signSpyData?.rhoPrime}
                                                variableKey="rhop_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "y_loop" &&
                                            <VariableDisplay 
                                                math="y \leftarrow S_{\gamma_1-1}^\ell"
                                                description="random mask, fresh per iteration"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.y?.[0]}
                                                variableKey="y_loop"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "w_loop" &&
                                            <VariableDisplay 
                                                math="w = A \cdot y"
                                                description="k polynomials"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.w?.[0]}
                                                variableKey="w_loop"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "w1_loop" &&
                                            <VariableDisplay 
                                                math="w_1 = \text{HighBits}(w)"
                                                description="high bits of w"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.w1?.[0]}
                                                variableKey="w1_loop"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "tildec_loop" &&
                                            <VariableDisplay 
                                                math="\tilde{c} \in \{0,1\}^{256}"
                                                description="32 byte hash of μ ∥ w₁"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.cTilde}
                                                variableKey="tildec_loop"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "c_loop" &&
                                            <VariableDisplay 
                                                math="c \in B_{60}"
                                                description="challenge with 60 ±1 entries"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.c}
                                                variableKey="c_loop"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "z_sign" &&
                                            <VariableDisplay 
                                                math="z = y + c s_1"
                                                description="ℓ polynomials"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.z?.[0]}
                                                variableKey="z_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "r0_sign" &&
                                            <VariableDisplay 
                                                math="r_0 = \text{LowBits}(w - c s_2)"
                                                description="low bits for rejection check"
                                                data={signSpyData?.iterations?.[currentIterationIndex]?.r0?.[0]}
                                                variableKey="r0_sign"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "signature" &&
                                            <VariableDisplay 
                                                math="\sigma = (z, h, \tilde{c})"
                                                description="final signature (~4-5 KB)"
                                                data={signSpyData?.signature}
                                                variableKey="signature"
                                                cols={8}
                                            />
                                        }

                                        {/* ── VERIFY ── */}
                                        {selectedVariable === "M_verify" &&
                                            <VariableDisplay 
                                                math="M"
                                                description="input message"
                                                data={signSpyData?.msg?.slice ? signSpyData.msg.slice(2) : signSpyData?.msg}
                                                variableKey="M_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "message_verify" &&
                                            <VariableDisplay 
                                                math="M"
                                                description="input message"
                                                data={signSpyData?.msg?.slice ? signSpyData.msg.slice(2) : signSpyData?.msg}
                                                variableKey="message_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "ctx_verify" &&
                                            <VariableDisplay 
                                                math="\mathrm{ctx}"
                                                description="context string"
                                                data={verifySpyData?.ctx}
                                                variableKey="ctx_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "Mp_verify" &&
                                            <VariableDisplay 
                                                math="M' = H(\rho \| \mathrm{tr} \| M, \mathrm{ctx})"
                                                description="prehashed message (64 bytes)"
                                                data={verifySpyData?.msg}
                                                variableKey="Mp_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "A_verify" &&
                                            <MatrixDisplay 
                                                math="A \in \mathbb{Z}_q^{k \times \ell}"
                                                description="matrix from public key"
                                                matrix={verifySpyData?.A}
                                                variableKey="A_verify"
                                            />
                                        }

                                        {selectedVariable === "rho_verify" &&
                                            <VariableDisplay 
                                                math="\rho"
                                                description="seed from public key"
                                                data={verifySpyData?.rho}
                                                variableKey="rho_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "t1_verify" &&
                                            <VariableDisplay 
                                                math="t_1"
                                                description="high bits from public key"
                                                data={verifySpyData?.t1?.[0]}
                                                variableKey="t1_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "tr_verify" &&
                                            <VariableDisplay 
                                                math="\mathrm{tr}"
                                                description="64 byte hash from public key"
                                                data={verifySpyData?.tr}
                                                variableKey="tr_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "mu_verify" &&
                                            <VariableDisplay 
                                                math="\mu \in \{0,1\}^{512}"
                                                description="64 byte hash of tr ∥ M"
                                                data={verifySpyData?.mu}
                                                variableKey="mu_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "tildec_verify" &&
                                            <VariableDisplay 
                                                math="\tilde{c}"
                                                description="hash from verification"
                                                data={verifySpyData?.cTilde}
                                                variableKey="tildec_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "z_verify" &&
                                            <VariableDisplay 
                                                math="z"
                                                description="signature component"
                                                data={verifySpyData?.z?.[0]}
                                                variableKey="z_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "h_verify" &&
                                            <VariableDisplay 
                                                math="h"
                                                description="hint vector (up to 80 bits)"
                                                data={verifySpyData?.h?.[0]}
                                                variableKey="h_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "c_verify" &&
                                            <VariableDisplay 
                                                math="c \in B_{60}"
                                                description="challenge with 60 ±1 entries"
                                                data={verifySpyData?.c}
                                                variableKey="c_verify"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "wapprox" &&
                                            <VariableDisplay 
                                                math="w' = A z - c t_1 \cdot 2^d"
                                                description="reconstructed w"
                                                data={verifySpyData?.wPrime?.[0]}
                                                variableKey="wapprox"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "wp1" &&
                                            <VariableDisplay 
                                                math="w_1' = \text{HighBits}(w')"
                                                description="high bits of reconstructed w"
                                                data={verifySpyData?.w1?.[0]}
                                                variableKey="wp1"
                                                cols={4}
                                            />
                                        }

                                        {selectedVariable === "tildecp_verify" &&
                                            <VariableDisplay 
                                                math="\tilde{c}' = H(\mu \| w_1')"
                                                description="recomputed hash"
                                                data={verifySpyData?.cTilde}
                                                variableKey="tildecp_verify"
                                                cols={4}
                                            />
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