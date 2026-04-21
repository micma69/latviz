'use client'

import { runLLL, parseBasisFromString } from "@/backend/lll-attack-runner-main/lll-attack-runner-main/src/lib/lll"
import { runBKZ } from "@/backend/lll-attack-runner-main/lll-attack-runner-main/src/lib/bkz";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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

  // Helper function to create text sprite
  const createTextSprite = (text: string, color: string, fontSize: number) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    context.font = `${fontSize}px Arial`
    const metrics = context.measureText(text)
    canvas.width = metrics.width + 20
    canvas.height = fontSize + 10

    context.fillStyle = 'rgba(0, 0, 0, 0.8)'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = color
    context.font = `${fontSize}px Arial`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(text, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(spriteMaterial)
    sprite.scale.set(canvas.width / 100, canvas.height / 100, 1)
    return sprite
  }

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

    // Calculate font sizes based on maxCoord
    const axisFontSize = Math.max(12, 24 - Math.log10(Math.max(maxCoord, 1)) * 4)
    const vectorFontSize = Math.max(10, 20 - Math.log10(Math.max(maxCoord, 1)) * 3)

    // Add axis labels
    const step = Math.max(1, Math.ceil(maxCoord / 5))
    for (let i = -Math.floor(maxCoord); i <= Math.floor(maxCoord); i += step) {
      if (i !== 0) {
        // X-axis labels
        const xLabel = createTextSprite(i.toString(), '#ffffff', axisFontSize)
        xLabel.position.set(i, -0.5, 0)
        scene.add(xLabel)

        // Y-axis labels
        const yLabel = createTextSprite(i.toString(), '#ffffff', axisFontSize)
        yLabel.position.set(-0.5, i, 0)
        scene.add(yLabel)

        // Z-axis labels
        const zLabel = createTextSprite(i.toString(), '#ffffff', axisFontSize)
        zLabel.position.set(0, -0.5, i)
        scene.add(zLabel)
      }
    }

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

      // Add vector coordinate label at the tip
      const colorHex = '#' + colors[index % colors.length].toString(16).padStart(6, '0')
      const coordText = `(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`
      const vectorLabel = createTextSprite(coordText, colorHex, vectorFontSize)
      vectorLabel.position.copy(direction).add(new THREE.Vector3(0, 0.5, 0))
      vectorGroup.add(vectorLabel)
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
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Sprite) {
          if (obj.geometry) obj.geometry.dispose()
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((material) => {
                if (material instanceof THREE.Material) {
                  material.dispose()
                  if ('map' in material && material.map instanceof THREE.Texture) {
                    material.map.dispose()
                  }
                }
              })
            } else {
              (obj.material as THREE.Material).dispose()
              if ('map' in obj.material && obj.material.map instanceof THREE.Texture) {
                obj.material.map.dispose()
              }
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

export default function BKZPage() {
  const [input, setInput] = useState('')
  const [initialBasis, setInitialBasis] = useState<number[][] | null>(null)
  const [result, setResult] = useState<any>(null)
  const [steps, setSteps] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [blockSize, setBlockSize] = useState(10)
  const [blockSizeInput, setBlockSizeInput] = useState('10')
  const [showBlockInfo, setShowBlockInfo] = useState(false)
  const [showBlockError, setShowBlockError] = useState(false)
  const [showCalc, setShowCalc] = useState(false)
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [delta, setDelta] = useState(0.99)
  const [deltaInput, setDeltaInput] = useState('0.99')

  const handleProcess = () => {
    setError('')
    setResult(null)
    setSteps([])
    setCurrentStep(0)
    setShowBlockError(false)
    
    const parsed = parseBasisFromString(input)
    
    if (!parsed) {
      setError('Invalid matrix format. Please enter numbers separated by spaces or commas on each line.')
      setInitialBasis(null)
      return
    }

    const parsedBlockSize = parseInt(blockSizeInput)
    if (Number.isNaN(parsedBlockSize) || parsedBlockSize < 2 || parsedBlockSize > 60) { // i set the upper limit to 60 because of the computational limitations
      setShowBlockError(true)
      return
    }

    const parsedDelta = parseFloat(deltaInput)
    if (Number.isNaN(parsedDelta) || parsedDelta < 0.25 || parsedDelta > 1.0) {
      setError('Invalid delta value. Please enter a value between 0.25 and 1.0')
      return
    }

    setInitialBasis(parsed)
    setBlockSize(parsedBlockSize)
    setDelta(parsedDelta)
    
    try {
      setLoading(true)
      const bkzResult = runBKZ(parsed, parsedBlockSize, parsedDelta, true, 50)
      setResult(bkzResult)
      if (bkzResult.steps) {
        setSteps(bkzResult.steps)
        setCurrentStep(0)
      }
    } catch (err) {
      setError(`Error running BKZ algorithm: ${err instanceof Error ? err.message : 'Unknown error'}`)
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

  const drawVectors = (basis: number[][]) => {
    const maxValue = d3.max(basis.flat().map(Math.abs)) ?? 1
    const max = typeof maxValue === 'number' ? maxValue : 1
    const scaleX = d3.scaleLinear().domain([-max, max]).range([-150, 150])
    const scaleY = d3.scaleLinear().domain([-max, max]).range([150, -150]) // Cartesian coordinates
    const step = Math.max(1, Math.ceil(max / 10))
    const vectorFontSize = Math.max(6, 12 - Math.log10(Math.max(max, 1)) * 2)
    const axisFontSize = Math.max(6, 10 - Math.log10(Math.max(max, 1)) * 2)
    
    // Draw grid
    const gridLines = []
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
    
    const vectorLines = basis.map((v, idx) => {
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
    })

    const axisLabels = []
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
    
    return { gridLines, vectorLines, axisLabels, scaleX, scaleY, max }
  }

  const getCurrentBasis = () => {
    if (steps.length > 0 && currentStep < steps.length) {
      return steps[currentStep].basis
    }
    return initialBasis
  }

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

  const getCurrentStepDescription = () => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      switch (step.action) {
        case 'start_lll_process':
          const lllNum1 = step.lllNumber || 1
          return `Start LLL Process #${lllNum1}`
        case 'complete_lll_process':
          const lllNum2 = step.lllNumber || 1
          return `Complete LLL Process #${lllNum2}`
        case 'svp_enumeration':
          return 'SVP Enumeration'
        case 'reduce':
          return 'Coefficient reduction'
        case 'swap':
          return 'Basis swap'
        case 'gso':
          return 'Gram-Schmidt orthogonalization'
        case 'lovasz_check':
          return 'Lovász condition check'
        case 'complete':
          // Only show "BKZ reduction finished" if it's the last step
          if (currentStep === steps.length - 1) {
            return 'BKZ reduction finished'
          }
          return currentStep === 0 ? 'Initial basis' : 'Iteration complete'
        default:
          return step.description || 'Processing step'
      }
    }
    return 'Not started'
  }

  const getStepDetails = () => {
    const step = steps[currentStep]
    if (!step) {
      return 'No step data available.'
    }

    if (step.calculations && step.calculations.length > 0) {
      return step.calculations.join('\n')
    }

    let actionDetail = ''
    let theoreticalExplanation = ''
    const k = step.k || 0

    if (step.action === 'svp_enumeration') {
      const blockStart = step.blockStart || 0
      const blockEnd = Math.min(blockStart + blockSize - 1, steps[currentStep]?.basis?.length - 1)
      actionDetail = `SVP Enumeration on block [${blockStart}...${blockEnd}]\n`
      theoreticalExplanation = `The Shortest Vector Problem (SVP) finds the shortest non-zero vector in a lattice.\nThis enumeration searches through linear combinations of basis vectors to find shorter vectors.\n`
      if (step.k !== undefined) {
        actionDetail += `Searching for vectors shorter than current b_${step.k}`
      }
    } else if (step.action === 'start_lll_process') {
      const lllNum = step.lllNumber || 1
      const blockStart = step.blockStart || 0
      actionDetail = `Starting LLL process #${lllNum} on block [${blockStart}...${Math.min(blockStart + blockSize - 1, steps[currentStep]?.basis?.length - 1)}]`
      theoreticalExplanation = `\nThe BKZ algorithm applies LLL to successive blocks of size β. This LLL process will reduce the current block.`
    } else if (step.action === 'complete_lll_process') {
      const lllNum = step.lllNumber || 1
      const blockStart = step.blockStart || 0
      actionDetail = `Completed LLL process #${lllNum} on block [${blockStart}...${Math.min(blockStart + blockSize - 1, steps[currentStep]?.basis?.length - 1)}]`
      theoreticalExplanation = `\The LLL process on this block is complete. The block vectors now satisfy the LLL conditions.`
    } else if (step.action === 'reduce') {
      actionDetail = `Coefficient reduction: Reducing basis vector b_${k} against b_${k-1}\n`
      theoreticalExplanation = `The coefficient reduction attempts to make |μ_{${k},${k-1}}| ≤ 0.5 by subtracting appropriate multiples of b_${k-1} from b_${k}.\n`
      if (step.coefficient !== undefined) {
        actionDetail += `Coefficient: μ = ${step.coefficient.toFixed(6)}`
        if (step.subtractAmount !== undefined) {
          actionDetail += `\nSubtracting ${step.subtractAmount} × b_${k-1} from b_${k}`
        }
      }
    } else if (step.action === 'swap') {
      actionDetail = `Basis swap: Swapping b_${k-1} and b_${k}`
      theoreticalExplanation = `When the Lovász condition fails, we swap the vectors. This is necessary for BKZ reduction.\nCondition failed: ||b_${k}*||² < (δ - μ²) ||b_${k-1}*||²`
      if (step.norm_k !== undefined && step.norm_k_prev !== undefined) {
        actionDetail += `\n||b_${k}*||² = ${step.norm_k.toFixed(6)}`
        actionDetail += `\n||b_${k-1}*||² = ${step.norm_k_prev.toFixed(6)}`
      }
    } else if (step.action === 'gso') {
      actionDetail = `Gram-Schmidt orthogonalization computed for current basis.`
      theoreticalExplanation = `GSO decomposes the basis into orthogonal vectors (u_i) and coefficients (μ_{i,j}).\nThis is used to compute the Lovász condition and norms.`
    } else if (step.action === 'lovasz_check') {
      actionDetail = `Lovász condition check at position k=${k}\n`
      theoreticalExplanation = `Check if ||b_${k}*||² ≥ (${delta.toFixed(2)} - μ²_{${k},${k-1}}) ||b_${k-1}*||²\nIf satisfied: continue. If not: swap required.\n`
      if (step.leftSide !== undefined && step.rightSide !== undefined) {
        const satisfied = step.leftSide >= step.rightSide
        actionDetail += `Left side:  ||b_${k}*||² = ${step.leftSide.toFixed(6)}\n`
        actionDetail += `Right side: (${delta.toFixed(2)} - μ²) ||b_${k-1}*||² = ${step.rightSide.toFixed(6)}\n`
        actionDetail += `Condition: ${satisfied ? '✓ SATISFIED' : '✗ NOT SATISFIED'}`
      }
    } else if (step.action === 'complete') {
      actionDetail = currentStep === 0 ? 'Initial basis step.' : 'BKZ reduction complete.'
      theoreticalExplanation = ``
    } else {
      actionDetail = step.description || 'Step info unavailable.'
    }

    const gso = computeGSO(steps[currentStep]?.basis || [])
    const gsoLines = [
      `\nGram-Schmidt orthogonalization (current basis):`,
      ...gso.orthogonal.slice(0, Math.min(5, gso.orthogonal.length)).map((v, i) => `u_${i} = [${v.map(f => f.toFixed(6)).join(', ')}]`),
      ...(gso.orthogonal.length > 5 ? [`... (${gso.orthogonal.length - 5} more vectors)`] : []),
      `\nmu matrix coefficients:`,
      ...gso.mu.slice(0, Math.min(5, gso.mu.length)).map((row, i) => `μ_${i} = [${row.map(f => f.toFixed(6)).join(', ')}]`),
      ...(gso.mu.length > 5 ? [`... (${gso.mu.length - 5} more rows)`] : []),
    ]

    return `${actionDetail}${theoreticalExplanation}\n${gsoLines.join('\n')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">BKZ Algorithm Visualizer</h1>
        <p className="text-slate-300 mb-8">Enter a matrix to reduce it using the Block Korkine-Zolotarev (BKZ) algorithm</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Input Matrix & Parameters</h2>
            
            {/* Block Size Input */}
            <div className="mb-4">
              <label className="block text-slate-300 text-sm mb-2">
                Block Size (β)
                <button
                  onClick={() => setShowBlockInfo(true)}
                  className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-500"
                  title="What is block size?"
                >
                  ?
                </button>
              </label>
              <input
                type="number"
                min="2"
                value={blockSizeInput}
                onChange={(e) => setBlockSizeInput(e.target.value)}
                className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-slate-400 text-xs mt-1">Size of blocks for LLL processes. Must be between 2 and 60.</p>
            </div>

            {/* Delta Input */}
            <div className="mb-4">
              <label className="block text-slate-300 text-sm mb-2">
                Delta Value (δ)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.25"
                max="1.0"
                value={deltaInput}
                onChange={(e) => setDeltaInput(e.target.value)}
                className="w-full p-2 bg-slate-700 text-white border border-slate-600 rounded font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="text-slate-400 text-xs mt-1">Controls reduction quality. Must be between 0.25 and 1.0</p>
            </div>

            {/* Matrix Input */}
            <p className="text-slate-400 text-sm mb-3">
              Enter numbers separated by spaces or commas, one row per line:
            </p>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example:&#10;1 0 0&#10;0 1 0&#10;0 0 1&#10;&#10;Or with commas:&#10;1, 2, 3&#10;4, 5, 6"
              className="w-full h-32 p-4 bg-slate-700 text-white border border-slate-600 rounded font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

            {/* Initial Basis Section */}
            {initialBasis && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Initial Basis (k = {blockSizeInput})</h3>
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
                    <span className="font-semibold">Block Size (β):</span> {blockSize} 
                  </p>
                  <p className="text-slate-400 text-sm">
                    <span className="font-semibold">Delta (δ):</span> {delta.toFixed(2)}
                  </p>
                  <p className="text-slate-400 text-sm">
                    <span className="font-semibold">Total LLL Processes:</span> {steps.filter(step => step.action === 'start_lll_process').length}
                  </p>
                  {steps.length > 0 && (steps[currentStep]?.lllNumber || steps[currentStep]?.action === 'svp_enumeration') && (
                    <p className="text-slate-400 text-sm">
                      <span className="font-semibold">Current Process:</span> {
                        steps[currentStep]?.action === 'svp_enumeration' 
                          ? 'SVP Enumeration' 
                          : `LLL process #${steps[currentStep].lllNumber}`
                        }
                    </p>
                  )}
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
                        const { gridLines, vectorLines, scaleX, scaleY, max, axisLabels } = drawVectors(getCurrentBasis() || [])
                        const basis = getCurrentBasis() || []
                        const maxValue = d3.max(basis.flat().map(Math.abs)) ?? 1
                        const maxVal = typeof maxValue === 'number' ? maxValue : 1
                        
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

                {/* Current Step Info */}
                {steps.length > 0 && (
                  <div className={`mb-4 p-3 rounded border ${
                    steps[currentStep]?.action === 'start_lll_process' ? 'bg-blue-900/30 border-blue-500' :
                    steps[currentStep]?.action === 'complete_lll_process' ? 'bg-green-900/30 border-green-500' :
                    steps[currentStep]?.action === 'svp_enumeration' ? 'bg-purple-900/30 border-purple-500' :
                    'bg-slate-900 border-slate-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">Step Phase</h4>
                      <button
                        onClick={() => setShowCalc(true)}
                        className="text-xs px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
                      >
                        Show Details
                      </button>
                    </div>
                    <p className={`text-sm mb-2 ${
                      steps[currentStep]?.action === 'start_lll_process' ? 'text-blue-300 font-semibold' :
                      steps[currentStep]?.action === 'complete_lll_process' ? 'text-green-300 font-semibold' :
                      steps[currentStep]?.action === 'svp_enumeration' ? 'text-purple-300 font-semibold' :
                      'text-slate-300'
                    }`}>
                      {getCurrentStepDescription()}
                    </p>
                    {(steps[currentStep]?.action === 'start_lll_process' || steps[currentStep]?.action === 'complete_lll_process' || steps[currentStep]?.action === 'svp_enumeration') && (
                      <p className="text-xs text-slate-400 mt-2">
                        Block: [{steps[currentStep]?.blockStart || steps[currentStep]?.k || 0}...{Math.min((steps[currentStep]?.blockStart || steps[currentStep]?.k || 0) + blockSize - 1, (steps[currentStep]?.basis?.length || 0) - 1)}]
                      </p>
                    )}
                  </div>
                )}

                {showCalc && (
                  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-2xl max-h-[85vh] overflow-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Step Details</h4>
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
                Click "Process Matrix" to run the BKZ algorithm
              </div>
            )}

            {showBlockInfo && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">About Block Size (β)</h4>
                    <button onClick={() => setShowBlockInfo(false)} className="text-white text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-500">Close</button>
                  </div>
                  <div className="text-slate-300 text-sm space-y-2">
                    <p><strong>Block Size (β)</strong> is the dimension of the blocks processed in each BKZ iteration.</p>
                    <p> Consider our technical limitations, we only permit block size between 2 to 60</p>
                    <p><strong>BKZ Iteration :</strong> For each block of size β, BKZ applies LLL to that block, then moves to the next position.</p>
                    <p><strong>Effect :</strong> Larger β gives progressively better reduction quality. However, the computational cost increases significantly with larger block sizes.</p>
                  </div>
                </div>
              </div>
            )}

            {showBlockError && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-red-950 border border-red-700 rounded-lg p-6 w-full max-w-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">Invalid Block Size</h4>
                    <button onClick={() => setShowBlockError(false)} className="text-white text-sm px-2 py-1 rounded bg-slate-700 hover:bg-slate-600">Close</button>
                  </div>
                  <p className="text-slate-200 text-sm">Invalid block size. The block size (β) must be between 2 and 60!</p>
                </div>
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