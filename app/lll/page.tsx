'use client'

import { runLLL, parseBasisFromString } from "@/backend/lll-attack-runner-main/lll-attack-runner-main/src/lib/lll"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import React, { useState } from "react";

export default function LLLPage() {
  const [input, setInput] = useState('')
  const [initialBasis, setInitialBasis] = useState<number[][] | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleProcess = () => {
    setError('')
    setResult(null)
    
    const parsed = parseBasisFromString(input)
    
    if (!parsed) {
      setError('Invalid matrix format. Please enter numbers separated by spaces or commas on each line.')
      setInitialBasis(null)
      return
    }

    setInitialBasis(parsed)
    
    try {
      setLoading(true)
      const lllResult = runLLL(parsed, 0.75, true)
      setResult(lllResult)
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
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {initialBasis && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Initial Matrix</h3>
                <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto max-h-48 font-mono">
                  {formatMatrix(initialBasis)}
                </pre>
              </div>
            )}

            {result && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">Algorithm Results</h3>
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

                <h4 className="text-white font-semibold mb-2">Reduced Basis</h4>
                <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto max-h-48 font-mono mb-4">
                  {formatMatrix(result.reducedBasis)}
                </pre>

                {result.solutionVector && (
                  <div>
                    <h4 className="text-white font-semibold mb-2">Shortest Vector Found</h4>
                    <pre className="bg-slate-900 p-4 rounded text-slate-300 text-xs overflow-auto font-mono">
                      {result.solutionVector.map(v => v.toFixed(6)).join(', ')}
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