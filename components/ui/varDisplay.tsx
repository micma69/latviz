"use client";

import React, { useState } from "react";
import { InlineMath } from 'react-katex';
import { Button } from "@/components/ui/button";
import SquareGrid from "@/components/ui/gridLattice";

const formatArray = (data: any): string => {
    if (!data) return "[]";
    
    if (data instanceof Uint8Array || data instanceof Int32Array || data instanceof Uint16Array) {
        return `[${Array.from(data).join(", ")}]`;
    }
    
    if (Array.isArray(data)) {
        return `[${data.join(", ")}]`;
    }
    
    return "[]";
};

const previewArray = (data: any, count = 16): string => {
    if (!data) return "[]";
    
    let arr: any[];
    if (data instanceof Uint8Array || data instanceof Int32Array || data instanceof Uint16Array) {
        arr = Array.from(data);
    } else if (Array.isArray(data)) {
        arr = data;
    } else {
        return "[]";
    }
    
    if (arr.length <= count) return `[${arr.join(", ")}]`;
    return `[${arr.slice(0, count).join(", ")}, ...] (${arr.length} total)`;
};

const getArrayLength = (data: any): number => {
    if (!data) return 0;
    if (data instanceof Uint8Array || data instanceof Int32Array || data instanceof Uint16Array) {
        return data.length;
    }
    if (Array.isArray(data)) return data.length;
    return 0;
};

// For 1D arrays
export const VariableDisplay = ({ 
    math, 
    description, 
    data, 
    variableKey,
    cols = 4,
    rows = undefined
}: { 
    math: string; 
    description?: string; 
    data: any;
    variableKey: string;
    cols?: number;
    rows?: number;
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'array'>('grid');
    const [expandedArray, setExpandedArray] = useState(false);
    
    let arrayData: number[] = [];
    if (data) {
        if (data instanceof Uint8Array || data instanceof Int32Array || data instanceof Uint16Array) {
            arrayData = Array.from(data);
        } else if (Array.isArray(data) && typeof data[0] === 'number') {
            arrayData = data;
        }
    }
    
    const calculatedRows = rows || Math.ceil(arrayData.length / cols);
    
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Centered description/math above */}
            <div className="text-center">
                <InlineMath math={math} />
                {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
            </div>
            
            {arrayData.length === 0 ? (
                <div className="text-gray-400 text-sm p-4">No data available</div>
            ) : viewMode === 'grid' ? (
                <div className="overflow-y-auto max-h-48 w-full flex justify-center">
                    <SquareGrid 
                        algorithm="mldsa" 
                        rows={calculatedRows}
                        cols={cols} 
                        size={20} 
                        colorData={arrayData} 
                        showValues 
                        variableKey={variableKey} 
                        showTooltip={false}
                    />
                </div>
            ) : (
                <div className={`rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 h-48 w-full`}>
                    <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono">
                        <div className="text-gray-500 mb-2 flex items-center gap-2 flex-wrap">
                            <span>[{getArrayLength(data)} elements]</span>
                            {!expandedArray && getArrayLength(data) > 16 && (
                                <button 
                                    onClick={() => setExpandedArray(true)}
                                    className="text-blue-500 hover:text-blue-700 text-xs underline"
                                >
                                    show all
                                </button>
                            )}
                            {expandedArray && (
                                <button 
                                    onClick={() => setExpandedArray(false)}
                                    className="text-blue-500 hover:text-blue-700 text-xs underline"
                                >
                                    collapse
                                </button>
                            )}
                        </div>
                        <div className="break-all whitespace-pre-wrap">
                            {expandedArray 
                                ? formatArray(data)
                                : previewArray(data, 16)
                            }
                        </div>
                    </div>
                </div>
            )}
            
            {arrayData.length > 0 && (
                <div className="flex gap-2 mt-2">
                    <Button
                        size="sm"
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        onClick={() => setViewMode('grid')}
                        className="text-xs h-7 px-2"
                    >
                        Grid
                    </Button>
                    <Button
                        size="sm"
                        variant={viewMode === 'array' ? 'default' : 'outline'}
                        onClick={() => {
                            setViewMode('array');
                            setExpandedArray(false);
                        }}
                        className="text-xs h-7 px-2"
                    >
                        Array
                    </Button>
                </div>
            )}
        </div>
    );
};

// For 2D arrays/matrices
export const MatrixDisplay = ({ 
    math, 
    description, 
    matrix, 
    variableKey,
    maxHeight = "h-48"
}: { 
    math: string; 
    description?: string; 
    matrix: any[][] | undefined;
    variableKey: string;
    maxHeight?: string;
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'array'>('grid');
    const [expandedArray, setExpandedArray] = useState(false);
    
    let flatData: number[] = [];
    let fullMatrixData = [];
    
    if (matrix) {
        // Flatten entire matrix for array view
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j]) {
                    if (matrix[i][j] instanceof Uint8Array || matrix[i][j] instanceof Int32Array || matrix[i][j] instanceof Uint16Array) {
                        fullMatrixData.push({
                            position: `[${i}][${j}]`,
                            data: Array.from(matrix[i][j])
                        });
                        // For grid preview, just take first element
                        if (i === 0 && j === 0 && flatData.length === 0) {
                            flatData = Array.from(matrix[i][j]);
                        }
                    } else if (Array.isArray(matrix[i][j])) {
                        fullMatrixData.push({
                            position: `[${i}][${j}]`,
                            data: matrix[i][j]
                        });
                        if (i === 0 && j === 0 && flatData.length === 0) {
                            flatData = matrix[i][j];
                        }
                    }
                }
            }
        }
    }
    
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {/* Centered description/math above */}
            <div className="text-center flex-shrink-0">
                <InlineMath math={math} />
                {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
            </div>
            
            {/* Grid or Array content */}
            {viewMode === 'grid' ? (
                <div className={`overflow-y-auto ${maxHeight} w-full flex justify-center items-center gap-2 flex-wrap`}>
                    <SquareGrid 
                        algorithm="mldsa" 
                        rows={Math.ceil(flatData.length / 4)} 
                        cols={4} 
                        size={20} 
                        colorData={flatData} 
                        showValues 
                        variableKey={variableKey} 
                    />
                </div>
            ) : (
                <div className={`rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 ${maxHeight} w-full`}>
                    <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono">
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                            <div className="text-gray-500">
                                {fullMatrixData.length} polynomials
                            </div>
                            <button 
                                onClick={() => setExpandedArray(!expandedArray)} 
                                className="text-blue-500 hover:text-blue-700 text-xs underline"
                            >
                                {expandedArray ? "collapse all" : "expand all"}
                            </button>
                        </div>
                        
                        {expandedArray ? (
                            fullMatrixData.map((item, idx) => (
                                <div key={idx} className="mb-4 pb-2 border-b border-gray-300 dark:border-gray-700 last:border-0">
                                    <div className="font-bold text-gray-600 mb-1">A{item.position}:</div>
                                    <div className="break-all whitespace-pre-wrap">
                                        [{item.data.join(", ")}]
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Preview - show just first polynomial
                            <div>
                                <div className="font-bold text-gray-600 mb-1">A[0][0] (preview):</div>
                                <div className="break-all whitespace-pre-wrap">
                                    [{flatData.slice(0, 16).join(", ")}...] ({flatData.length} coefficients)
                                </div>
                                {fullMatrixData.length > 1 && (
                                    <div className="text-gray-400 mt-2 text-xs">
                                        ... and {fullMatrixData.length - 1} more polynomials
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Buttons beneath */}
            <div className="flex gap-2 mt-2">
                <Button size="sm" variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')} className="text-xs h-7 px-2">Grid</Button>
                <Button size="sm" variant={viewMode === 'array' ? 'default' : 'outline'} onClick={() => setViewMode('array')} className="text-xs h-7 px-2">Array</Button>
            </div>
        </div>
    );
};

// For displaying a single value/number
export const ValueDisplay = ({ 
    math, 
    description, 
    value,
    maxHeight = "h-48"
}: { 
    math: string; 
    description?: string; 
    value: any;
    maxHeight?: string;
}) => {
    let displayValue = "No data";
    if (value !== undefined) {
        if (typeof value === 'object') {
            try {
                displayValue = JSON.stringify(value, (key, val) => {
                    if (val instanceof Uint8Array || val instanceof Int32Array || val instanceof Uint16Array) {
                        return Array.from(val);
                    }
                    return val;
                }, 2);
            } catch {
                displayValue = value.toString();
            }
        } else {
            displayValue = value.toString();
        }
    }
    
    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-center flex-shrink-0">
                <InlineMath math={math} />
                {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
            </div>
            
            <div className={`rounded-lg bg-slate-100 dark:bg-zinc-900 p-3 ${maxHeight} w-full`}>
                <div className="overflow-y-auto rounded-xl bg-slate-200 dark:bg-zinc-800 p-4 h-full text-xs font-mono">
                    <div className="break-all whitespace-pre-wrap">
                        {displayValue}
                    </div>
                </div>
            </div>
        </div>
    );
};