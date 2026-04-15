'use client' 

import { runLLL, parseBasisFromString } from "@/backend/lll-attack-runner-main/lll-attack-runner-main/src/lib/lll"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as THREE from "three";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type ThreeDSceneProps = {
  basis: number[][]
}

function ThreeDScene({ basis }: ThreeDSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = 380
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    const maxCoord = Math.max(1, ...basis.flat().map(Math.abs))
    const cameraDistance = Math.max(5, maxCoord * 2.5)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(cameraDistance, cameraDistance, cameraDistance)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    scene.add(directionalLight)

    const gridSize = maxCoord * 2 + 2
    const gridDivisions = Math.max(4, Math.ceil(maxCoord * 2))
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x4b5563, 0x1f2937)
    scene.add(gridHelper)

    const axesHelper = new THREE.AxesHelper(maxCoord * 1.5 + 1)
    scene.add(axesHelper)

    const vectorGroup = new THREE.Group()
    const colors = [
      0x00ffff, // light blue
      0xff0000, // red
      0xffff00, // yellow
      0x800080, // purple
      0xff69b4, // pink
      0x00ff00, // green
      0xffffff, // white
      0xffa500, // orange
      0xff4500, // orange red
      0xdaa520, // goldenrod
      0x98fb98, // pale green
      0xf0e68c, // khaki
      0xdda0dd, // plum
      0xb0e0e6, // powder blue
      0xff6347, // tomato
      0x32cd32  // lime green
    ]

    basis.forEach((vector, index) => {
      const [x = 0, y = 0, z = 0] = vector
      const direction = new THREE.Vector3(x, y, z)
      const length = Math.max(direction.length(), 0.1)
      const lineMaterial = new THREE.LineBasicMaterial({ color: colors[index % colors.length], linewidth: 3 })
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), direction])
      const line = new THREE.Line(lineGeometry, lineMaterial)
      vectorGroup.add(line)

      const coneSize = Math.max(maxCoord * 0.08, 0.15)
      const coneGeometry = new THREE.ConeGeometry(coneSize, coneSize * 1.5, 16)
      const coneMaterial = new THREE.MeshStandardMaterial({ color: colors[index % colors.length] })
      const cone = new THREE.Mesh(coneGeometry, coneMaterial)
      cone.position.copy(direction)
      cone.lookAt(0, 0, 0)
      cone.rotateX(Math.PI)
      vectorGroup.add(cone)
    })

    scene.add(vectorGroup)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 0, 0)
    controls.update()

    let requestId = 0
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      requestId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      const newWidth = container.clientWidth
      renderer.setSize(newWidth, height)
      camera.aspect = newWidth / height
      camera.updateProjectionMatrix()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(requestId)
      controls.dispose()
      scene.traverse((object) => {
        const obj = object as THREE.Object3D;
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => (material as THREE.Material).dispose())
            } else {
              (obj.material as THREE.Material).dispose()
            }
          }
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [basis])

  return <div ref={containerRef} className="w-full h-[380px] rounded border border-slate-700 bg-slate-950" />
}

export default function LLLPage() {
  const [input, setInput] = useState('')
  const [initialBasis, setInitialBasis] = useState<number[][] | null>(null)
  const [result, setResult] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
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

  const vectorColors = [
    '#00ffff', // light blue
    '#ff0000', // red
    '#ffff00', // yellow
    '#800080', // purple
    '#ff69b4', // pink
    '#00ff00', // green
    '#ffffff', // white
    '#ffa500', // orange
    '#ff4500', // orange red
    '#daa520', // goldenrod
    '#98fb98', // pale green
    '#f0e68c', // khaki
    '#dda0dd', // plum
    '#b0e0e6', // powder blue
    '#ff6347', // tomato
    '#32cd32'  // lime green
  ]

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
        case 'gso':
          return 'Gram-Schmidt orthogonalization'
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

    // If the step has detailed calculations, use them
    if (step.calculations && step.calculations.length > 0) {
      return step.calculations.join('\n')
    }

    // Fallback to old format for backward compatibility
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
    } else if (step.action === 'gso') {
      actionDetail = `Gram-Schmidt orthogonalization computed for current basis.`
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
    const maxValue = d3.max(basis.flat().map(Math.abs)) ?? 1
    const max = typeof maxValue === 'number' ? maxValue : 1
    const scaleX = d3.scaleLinear().domain([-max, max]).range([-150, 150])
    const scaleY = d3.scaleLinear().domain([-max, max]).range([150, -150]) // Cartesian coordinates
    const gridSize = 10
    const gridLines = []
    const step = Math.max(1, Math.ceil(max / 10))
    const vectorFontSize = Math.max(6, 12 - Math.log10(Math.max(max, 1)) * 2)
    const axisFontSize = Math.max(6, 10 - Math.log10(Math.max(max, 1)) * 2)
    
    // Draw grid
    for (let i = -max; i <= max; i += 1) {
      const scaledXPos = scaleX(i)
      const scaledYPos = scaleY(i)
      gridLines.push(
        <line key={`vgrid-${i}`} x1={scaledXPos} y1={scaleY(-max)} x2={scaledXPos} y2={scaleY(max)} 
              stroke="slategray" strokeWidth={0.3} strokeDasharray="2,2" opacity={0.5} />
      )
      gridLines.push(
        <line key={`hgrid-${i}`} x1={scaleX(-max)} y1={scaledYPos} x2={scaleX(max)} y2={scaledYPos} 
              stroke="slategray" strokeWidth={0.3} strokeDasharray="2,2" opacity={0.5} />
      )
    }
    
    return { gridLines, vectorLines: basis.map((v, idx) => {
      const x0 = v[0] || 0
      const y0 = v[1] || 0
      const scaledX = scaleX(x0)
      const scaledY = scaleY(y0)
      const color = vectorColors[idx % vectorColors.length]
      return (
        <g key={idx}>
          <defs>
            <marker id={`arrowhead-${idx}`} viewBox="0 -5 10 10" refX="8" refY="0"
                    markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,-5L10,0L0,5" fill={color} />
            </marker>
          </defs>
          <line
            x1={scaleX(0)} y1={scaleY(0)}
            x2={scaledX} y2={scaledY}
            stroke={color} strokeWidth={2}
            markerEnd={`url(#arrowhead-${idx})`}
          />
          <text
            x={scaledX} y={scaledY - 10}
            textAnchor="middle" fontSize={vectorFontSize} fill={color} fontWeight="bold"
          >
            ({x0.toFixed(2)}, {y0.toFixed(2)})
          </text>
        </g>
      )
    }), scaleX, scaleY }
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
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <button
                        onClick={() => setViewMode('2d')}
                        className={`rounded px-3 py-1 text-sm font-medium ${viewMode === '2d' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        2D View
                      </button>
                      <button
                        onClick={() => setViewMode('3d')}
                        className={`rounded px-3 py-1 text-sm font-medium ${viewMode === '3d' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                      >
                        3D View
                      </button>
                      <p className="text-slate-400 text-xs ml-auto">Drag to rotate, scroll to zoom the 3D scene.</p>
                    </div>

                    {viewMode === '2d' ? (
                      (() => {
                        const { gridLines, vectorLines, scaleX, scaleY } = drawVectors(getCurrentBasis() || [])
                        const basis = getCurrentBasis() || []
                        const maxValue = d3.max(basis.flat().map(Math.abs)) ?? 1
                        const max = typeof maxValue === 'number' ? maxValue : 1
                        const step = Math.max(1, Math.ceil(max / 10))
                        const axisFontSize = Math.max(6, 10 - Math.log10(Math.max(max, 1)) * 2)
                        const axisLabels = []
                        
                        // Generate axis labels
                        for (let i = -Math.ceil(max); i <= Math.ceil(max); i += step) {
                          if (i !== 0) {
                            const posX = scaleX(i)
                            const posY = scaleY(i)
                            axisLabels.push(
                              <text key={`xlabel-${i}`} x={posX} y={170} textAnchor="middle" fontSize={axisFontSize} fill="white">
                                {i}
                              </text>
                            )
                            axisLabels.push(
                              <text key={`ylabel-${i}`} x={-165} y={posY} textAnchor="end" fontSize={axisFontSize} fill="white" dominantBaseline="middle">
                                {i}
                              </text>
                            )
                          }
                        }
                        
                        return (
                          <svg width="100%" height={400} viewBox={`-180 -180 360 360`} className="border border-slate-700 rounded bg-slate-950">
                            <defs>
                            </defs>
                            
                            {/* Grid lines */}
                            {gridLines}
                            
                            {/* X-axis */}
                            <line x1={scaleX(-max-1)} y1={scaleY(0)} x2={scaleX(max+1)} y2={scaleY(0)} 
                                  stroke="white" strokeWidth={1} />
                            {/* Y-axis */}
                            <line x1={scaleX(0)} y1={scaleY(-max-1)} x2={scaleX(0)} y2={scaleY(max+1)} 
                                  stroke="white" strokeWidth={1} />
                            
                            {/* Axis labels */}
                            {axisLabels}
                            
                            {/* Vectors */}
                            {vectorLines}
                          </svg>
                        )
                      })()
                    ) : (
                      <ThreeDScene basis={getCurrentBasis() || []} />
                    )}
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