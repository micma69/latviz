'use client' 

import { runLLL, parseBasisFromString } from "@/backend/lll-attack-runner-main/lll-attack-runner-main/src/lib/lll"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import React, { useState } from "react";
import * as d3 from "d3";

export default function LLLPage() {
  const [input, setInput] = useState('')
  const [initialBasis, setInitialBasis] = useState<number[][] | null>(null)
  const [result, setResult] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const delta = 0.75

  const handleProcess = () => {
    setError('')
    setResult(null)
    setSteps([])
    setCurrentStep(0)
    
    const parsed = parseBasisFromString(input)
    
    if (!parsed) {
      setError('Invalid matrix format. Please enter numbers separated by spaces or commas on each line.')
      setInitialBasis(null)
      return
    }

    setInitialBasis(parsed)
    
    try {
      setLoading(true)
      const lllResult = runLLL(parsed, delta, true)
      setResult(lllResult)
      if (lllResult.steps) {
        setSteps(lllResult.steps)
        setCurrentStep(0)
      }
    } catch (err) {
      setError(`Error running LLL algorithm: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setInput('')
    setInitialBasis(null)
    setResult(null)
    setError('')
  }

  const formatMatrix = (matrix: number[][]): string => {
    return matrix.map(row => 
      row.map(val => val.toFixed(6)).join('\t')
    ).join('\n')
  }

  const nextStep = () => setCurrentStep(i => Math.min(i + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(i => Math.max(i - 1, 0))

  const computeGSO = (basis: number[][]) => {
    if (!basis || !Array.isArray(basis) || basis.length === 0) {
      return { orthogonal: [], mu: [] }
    }

    const n = basis.length
    for (let i = 0; i < n; i++) {
      if (!basis[i] || !Array.isArray(basis[i])) {
        return { orthogonal: [], mu: [] }
      }
    }

    const orthogonal: number[][] = []
    const mu: number[][] = Array(n).fill(0).map(() => Array(n).fill(0))

    for (let i = 0; i < n; i++) {
      let vec = [...basis[i]]

      for (let j = 0; j < i; j++) {
        if (!orthogonal[j] || orthogonal[j].length === 0) continue
        const denom = orthogonal[j].reduce((sum, val, idx) => sum + val * orthogonal[j][idx], 0)
        if (Math.abs(denom) > 1e-10) {
          const numer = basis[i].reduce((sum, val, idx) => sum + val * (orthogonal[j][idx] ?? 0), 0)
          mu[i][j] = numer / denom
          vec = vec.map((val, idx) => val - (orthogonal[j][idx] ?? 0) * mu[i][j])
        }
      }

      orthogonal.push(vec)
    }

    return { orthogonal, mu }
  }

  const computeLovaszStatus = (basis: number[][]) => {
    const { orthogonal, mu } = computeGSO(basis)
    if (!orthogonal || !mu) return true

    const currentStepData = steps[currentStep]
    if (!currentStepData || currentStepData.k <= 0 || orthogonal.length === 0) {
      return true
    }

    const k = currentStepData.k
    if (k >= orthogonal.length || k - 1 < 0 || !orthogonal[k] || !orthogonal[k - 1]) {
      return true
    }

    const left = orthogonal[k].reduce((sum, val) => sum + val * val, 0)
    const right = (delta - (mu[k][k - 1] ?? 0) ** 2) * orthogonal[k - 1].reduce((sum, val) => sum + val * val, 0)
    return left >= right
  }

  const getCurrentBasis = () => {
    if (steps.length > 0 && currentStep < steps.length) {
      return steps[currentStep].basis
    }
    return initialBasis
  }

  const getCurrentStepDescription = () => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      switch (step.action) {
        case 'reduce':
          return 'Basis size reduction'
        case 'swap':
          return 'Basis swap'
        case 'complete':
          return currentStep === 0 ? 'Initial basis' : 'Finished'
        default:
          return step.description
      }
    }
    return 'Not started'
  }

  const getStepDetails = () => {
    const step = steps[currentStep]
    if (!step) {
      return 'No step data available.'
    }

    const basis = step.basis || []
    const prevBasis = currentStep > 0 ? (steps[currentStep - 1]?.basis || []) : []
    const gso = computeGSO(basis)
    const k = step.k

    let actionDetail = ''

    if (step.action === 'reduce' && prevBasis.length > 0) {
      const changedIndex = k
      const oldVec = prevBasis[changedIndex] || []
      const newVec = basis[changedIndex] || []
      actionDetail = `Reduction: k=${k}, previous vector=${JSON.stringify(oldVec)}, current vector=${JSON.stringify(newVec)}.`
    } else if (step.action === 'swap' && prevBasis.length > 0) {
      actionDetail = `Swap: k=${k}, swapped basis rows ${k - 1} and ${k}.` 
    } else if (step.action === 'complete') {
      actionDetail = currentStep === 0 ? 'Initial basis step.' : 'Reduction complete.'
    } else {
      actionDetail = step.description || 'Step info unavailable.'
    }

    const gsoLines = [
      `Gram-Schmidt orthogonalization (current basis):`,
      ...gso.orthogonal.map((v, i) => `u_${i} = [${v.map(f => f.toFixed(6)).join(', ')}]`),
      `mu matrix values:`,
      ...gso.mu.map((row, i) => `mu_${i} = [${row.map(f => f.toFixed(6)).join(', ')}]`),
      `Lovasz condition at k=${k}: ${computeLovaszStatus(basis) ? 'Satisfied' : 'Not satisfied'}`,
    ]

    return `${actionDetail}\n\n${gsoLines.join('\n')}`
  }

  const drawVectors = (basis: number[][]) => {
    const max = d3.max(basis.flat().map(Math.abs)) ?? 1
    const scale = d3.scaleLinear().domain([-max, max]).range([-100, 100])
    return basis.map((v, idx) => (
      <g key={idx}>
        <line
          x1={scale(0)} y1={scale(0)}
          x2={scale(v[0])} y2={scale(v[1])}
          stroke="cyan" strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
      </g>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">LLL Algorithm Visualizer</h1>
        <p className="text-slate-300 mb-8">Enter a matrix to reduce it using the Lenstra–Lenstra–Lovász (LLL) algorithm</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Input Matrix</h2>
            <p className="text-slate-400 text-sm mb-3">
              Enter numbers separated by spaces or commas, one row per line:
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example:&#10;1 0 0&#10;0 1 0&#10;0 0 1&#10;&#10;Or with commas:&#10;1, 2, 3&#10;4, 5, 6"
              className="w-full h-48 p-4 bg-slate-700 text-white border border-slate-600 rounded font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleProcess}
                disabled={!input.trim() || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Processing...' : 'Process Matrix'}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="flex-1"
              >
                Clear
              </Button>
            </div>

            {/* Initial Matrix Section */}
            {initialBasis && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Initial Matrix</h3>
                <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto max-h-32 font-mono">
                  {formatMatrix(initialBasis)}
                </pre>
              </div>
            )}

            {/* Initial Basis Section */}
            {initialBasis && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Initial Basis (δ = {delta})</h3>
                <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto max-h-32 font-mono">
                  {formatMatrix(initialBasis)}
                </pre>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Process and Result</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.success ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {result.success ? 'Success' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    <span className="font-semibold">Iterations:</span> {result.iterations}
                  </p>
                </div>

                {steps.length > 0 && (
                  <div className="flex items-center justify-between mb-6">
                    <Button onClick={prevStep} disabled={currentStep === 0} className="bg-blue-600 hover:bg-blue-700">
                      ◀ Back
                    </Button>
                    <span className="text-sm text-slate-300 font-medium">
                      Step {currentStep + 1} / {steps.length}
                    </span>
                    <Button onClick={nextStep} disabled={currentStep === steps.length - 1} className="bg-blue-600 hover:bg-blue-700">
                      Next ▶
                    </Button>
                  </div>
                )}

                {/* Graph */}
                {steps.length > 0 && (
                  <div className="mb-4">
                    <svg width={220} height={220} viewBox="-110 -110 220 220" className="mx-auto">
                      <defs>
                        <marker id="arrowhead" viewBox="0 -5 10 10" refX="8" refY="0"
                                markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M0,-5L10,0L0,5" fill="cyan" />
                        </marker>
                      </defs>
                      <rect x={-110} y={-110} width={220} height={220}
                            fill="transparent" stroke="slategray" strokeWidth={0.5} />
                      {drawVectors(getCurrentBasis() || [])}
                    </svg>
                  </div>
                )}

                {/* Lovasz Status */}
                {steps.length > 0 && (
                  <div className="mb-4 p-3 bg-slate-900 rounded border">
                    <h4 className="text-white font-semibold mb-2">Lovasz Status</h4>
                    <div className="flex items-center gap-2">
                      {computeLovaszStatus(getCurrentBasis() || []) ? (
                        <>
                          <span className="text-green-400 text-xl">✓</span>
                          <span className="text-green-400 text-sm">Satisfied</span>
                        </>
                      ) : (
                        <>
                          <span className="text-red-400 text-xl">✗</span>
                          <span className="text-red-400 text-sm">Not Satisfied</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Current Step */}
                {steps.length > 0 && (
                  <div className="mb-4 p-3 bg-slate-900 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Step</h4>
                      <button
                        onClick={() => setShowCalc(true)}
                        className="text-xs px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
                      >
                        Show Calculations
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{getCurrentStepDescription()}</p>
                    <p className="text-slate-400 text-xs">Possible step types: Gram Schmidt, basis size reduction, Lovasz Condition Checking, basis swap, next iteration, Finished.</p>
                  </div>
                )}

                {showCalc && (
                  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Calculation Details</h4>
                        <button onClick={() => setShowCalc(false)} className="text-white text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-500">Close</button>
                      </div>
                      <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono">{getStepDetails()}</pre>
                    </div>
                  </div>
                )}

                <h4 className="text-white font-semibold mb-2">Current Basis</h4>
                <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto max-h-48 font-mono mb-4">
                  {formatMatrix(getCurrentBasis() || [])}
                </pre>

                {result.solutionVector && currentStep === steps.length - 1 && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Shortest Vector Found</h4>
                    <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto font-mono">
                      {result.solutionVector.map((v: number) => v.toFixed(6)).join(', ')}
                    </pre>
                  </div>
                )}
              </div>
            )}



            {!result && initialBasis && !loading && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 text-slate-400 text-center">
                Click "Process Matrix" to run the LLL algorithm
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-700 text-slate-400 text-sm">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}