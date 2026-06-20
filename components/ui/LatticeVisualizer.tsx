'use client'

import React, { useState, useEffect, useRef, useMemo } from "react"
import * as d3 from "d3"
import * as THREE from "three"
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const MIN_DIM = 2
const MAX_DIM = 3
const MAX_BASIS = 4
const VECTOR_COLORS = ["#22d3ee", "#fb7185", "#fbbf24", "#a78bfa"]
const SUBSCRIPTS = ["₁", "₂", "₃", "₄", "₅", "₆"]

type Vec = number[]
type LatticePoint = { coords: Vec; coeffs: number[] }

function defaultVector(dim: number, index: number): Vec {
  const v = new Array(dim).fill(0)
  v[Math.min(index, dim - 1)] = 1
  return v
}

function resizeVector(v: Vec, dim: number): Vec {
  if (v.length === dim) return v
  if (v.length < dim) return [...v, ...new Array(dim - v.length).fill(0)]
  return v.slice(0, dim)
}

// All integer linear combinations of the basis with coefficients in [-range, range]
function generateLatticePoints(basis: Vec[], range: number): LatticePoint[] {
  const dim = basis.length
  if (dim === 0) return []
  const coeffOptions = Array.from({ length: range * 2 + 1 }, (_, i) => i - range)

  let combos: number[][] = [[]]
  for (let d = 0; d < dim; d++) {
    const next: number[][] = []
    for (const combo of combos) {
      for (const c of coeffOptions) next.push([...combo, c])
    }
    combos = next
  }

  return combos.map((combo) => {
    const coords = new Array(dim).fill(0)
    combo.forEach((c, i) => {
      basis[i].forEach((val, j) => {
        coords[j] += c * val
      })
    })
    return { coords, coeffs: combo }
  })
}

function formatNumber(n: number): string {
  const rounded = Math.round(n * 10000) / 10000
  if (Number.isInteger(rounded)) return rounded.toString()
  return rounded.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")
}

// Describe a point as a human-readable combination, e.g. "2·b₁ − b₂"
function formatCombination(coeffs: number[]): string {
  if (coeffs.every((c) => c === 0)) return "the origin — every coefficient is 0"

  const terms = coeffs
    .map((c, i) => {
      if (c === 0) return null
      const label = `b${SUBSCRIPTS[i] ?? i + 1}`
      const abs = Math.abs(c)
      const coefStr = abs === 1 ? "" : `${abs}·`
      return `${c < 0 ? "−" : ""}${coefStr}${label}`
    })
    .filter((t): t is string => t !== null)

  let result = terms[0]
  for (let i = 1; i < terms.length; i++) {
    result += terms[i].startsWith("−") ? ` − ${terms[i].slice(1)}` : ` + ${terms[i]}`
  }
  return result
}

function sameCoeffs(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

// ---------- 2D view ----------

function Lattice2D({
  basis,
  range,
  selectedPoint,
  onSelectPoint,
}: {
  basis: Vec[]
  range: number
  selectedPoint: LatticePoint | null
  onSelectPoint: (p: LatticePoint) => void
}) {
  const points = useMemo(() => generateLatticePoints(basis, range), [basis, range])
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const maxExtent = useMemo(() => {
    const flat = [...points.flatMap((p) => p.coords), ...basis.flat()].map(Math.abs)
    return Math.max(1, d3.max(flat) ?? 1)
  }, [points, basis])

  const size = 320
  const scaleX = d3.scaleLinear().domain([-maxExtent - 0.5, maxExtent + 0.5]).range([-size, size])
  const scaleY = d3.scaleLinear().domain([-maxExtent - 0.5, maxExtent + 0.5]).range([size, -size])

  const gridStep = Math.max(1, Math.ceil(maxExtent / 8))
  const gridLines = []
  for (let i = -Math.ceil(maxExtent); i <= Math.ceil(maxExtent); i += gridStep) {
    gridLines.push(
      <line key={`v-${i}`} x1={scaleX(i)} y1={scaleY(-maxExtent - 1)} x2={scaleX(i)} y2={scaleY(maxExtent + 1)}
            stroke="#334155" strokeWidth={0.5} strokeDasharray="2,2" />
    )
    gridLines.push(
      <line key={`h-${i}`} x1={scaleX(-maxExtent - 1)} y1={scaleY(i)} x2={scaleX(maxExtent + 1)} y2={scaleY(i)}
            stroke="#334155" strokeWidth={0.5} strokeDasharray="2,2" />
    )
  }

  return (
    <svg width="100%" height={400} viewBox={`${-size - 30} ${-size - 30} ${size * 2 + 60} ${size * 2 + 60}`}
         className="rounded border border-slate-700 bg-slate-950">
      {gridLines}
      <line x1={scaleX(-maxExtent - 1)} y1={scaleY(0)} x2={scaleX(maxExtent + 1)} y2={scaleY(0)} stroke="#64748b" strokeWidth={1} />
      <line x1={scaleX(0)} y1={scaleY(-maxExtent - 1)} x2={scaleX(0)} y2={scaleY(maxExtent + 1)} stroke="#64748b" strokeWidth={1} />

      {/* lattice points */}
      {points.map((p, i) => {
        const isOrigin = p.coeffs.every((c) => c === 0)
        const isHovered = hoverIdx === i
        const isSelected = !!selectedPoint && sameCoeffs(selectedPoint.coeffs, p.coeffs)
        const baseR = isOrigin ? 4 : 2.5
        const r = isSelected ? baseR + 3 : isHovered ? baseR + 2 : baseR
        const fill = isSelected ? "#38bdf8" : isHovered ? "#fde68a" : isOrigin ? "#ffffff" : "#94a3b8"

        return (
          <circle
            key={i}
            cx={scaleX(p.coords[0] ?? 0)}
            cy={scaleY(p.coords[1] ?? 0)}
            r={r}
            fill={fill}
            stroke={isSelected ? "#0ea5e9" : "none"}
            strokeWidth={isSelected ? 1.5 : 0}
            style={{ cursor: "pointer", transition: "r 80ms ease, fill 80ms ease" }}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
            onClick={() => onSelectPoint(p)}
          />
        )
      })}

      {/* basis vectors */}
      {basis.map((v, idx) => {
        const color = VECTOR_COLORS[idx % VECTOR_COLORS.length]
        return (
          <g key={idx}>
            <defs>
              <marker id={`lattice-arrow-${idx}`} viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,-5L10,0L0,5" fill={color} />
              </marker>
            </defs>
            <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(v[0] ?? 0)} y2={scaleY(v[1] ?? 0)}
                  stroke={color} strokeWidth={2.5} markerEnd={`url(#lattice-arrow-${idx})`} />
          </g>
        )
      })}
    </svg>
  )
}

// ---------- 3D view ----------

function Lattice3D({
  basis,
  range,
  onSelectPoint,
}: {
  basis: Vec[]
  range: number
  onSelectPoint: (p: LatticePoint) => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const points = useMemo(() => generateLatticePoints(basis, range), [basis, range])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = 400
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f172a)

    const flatVals = [...points.flatMap((p) => p.coords), ...basis.flat()].map(Math.abs)
    const maxCoord = Math.max(1, ...flatVals)
    const cameraDistance = Math.max(5, maxCoord * 2.5)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(cameraDistance, cameraDistance, cameraDistance)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.8))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.position.set(5, 10, 7)
    scene.add(dirLight)

    const gridSize = maxCoord * 2 + 2
    const gridDivisions = Math.max(4, Math.ceil(maxCoord * 2))
    scene.add(new THREE.GridHelper(gridSize, gridDivisions, 0x4b5563, 0x1f2937))
    scene.add(new THREE.AxesHelper(maxCoord * 1.5 + 1))

    const pointSize = Math.max(maxCoord * 0.035, 0.06)
    const sphereGeometry = new THREE.SphereGeometry(pointSize, 12, 12)
    const originGeometry = new THREE.SphereGeometry(pointSize * 1.6, 14, 14)
    const pointMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8 })
    const originMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

    const pointMeshes: THREE.Mesh[] = []
    points.forEach((p) => {
      const [x = 0, y = 0, z = 0] = p.coords
      const isOrigin = p.coeffs.every((c) => c === 0)
      const mesh = new THREE.Mesh(isOrigin ? originGeometry : sphereGeometry, isOrigin ? originMaterial : pointMaterial)
      mesh.position.set(x, y, z)
      mesh.userData.point = p
      pointMeshes.push(mesh)
      scene.add(mesh)
    })

    // Hover / selection indicators — separate translucent spheres repositioned on demand,
    // rather than mutating the shared point materials.
    const indicatorGeometry = new THREE.SphereGeometry(pointSize * 2.4, 16, 16)
    const hoverIndicator = new THREE.Mesh(
      indicatorGeometry,
      new THREE.MeshBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0.5, depthWrite: false })
    )
    hoverIndicator.visible = false
    scene.add(hoverIndicator)

    const selectedIndicator = new THREE.Mesh(
      indicatorGeometry,
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.55, depthWrite: false })
    )
    selectedIndicator.visible = false
    scene.add(selectedIndicator)

    const vectorGroup = new THREE.Group()
    basis.forEach((v, idx) => {
      const [x = 0, y = 0, z = 0] = v
      const direction = new THREE.Vector3(x, y, z)
      const color = parseInt(VECTOR_COLORS[idx % VECTOR_COLORS.length].replace("#", "0x"), 16)
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), direction])
      const line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, linewidth: 3 }))
      vectorGroup.add(line)

      const coneSize = Math.max(maxCoord * 0.08, 0.15)
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(coneSize, coneSize * 1.5, 16),
        new THREE.MeshStandardMaterial({ color })
      )
      cone.position.copy(direction)
      // ConeGeometry's apex points along local +Y by default, so rotate +Y onto the
      // vector's own direction directly rather than routing through lookAt (which
      // aligns -Z, not +Y, and ends up apex-down for most vectors).
      if (direction.lengthSq() > 1e-12) {
        const apexAxis = new THREE.Vector3(0, 1, 0)
        cone.quaternion.setFromUnitVectors(apexAxis, direction.clone().normalize())
      }
      vectorGroup.add(cone)
    })
    scene.add(vectorGroup)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 0, 0)
    controls.update()

    // ---- hover & click picking ----
    const raycaster = new THREE.Raycaster()
    const mouseVec = new THREE.Vector2()
    let hoveredPoint: LatticePoint | null = null

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouseVec.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseVec.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(mouseVec, camera)
      const hits = raycaster.intersectObjects(pointMeshes)

      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh
        hoverIndicator.position.copy(hitMesh.position)
        hoverIndicator.visible = true
        hoveredPoint = hitMesh.userData.point as LatticePoint
        renderer.domElement.style.cursor = "pointer"
      } else {
        hoverIndicator.visible = false
        hoveredPoint = null
        renderer.domElement.style.cursor = "default"
      }
    }

    const handleClick = () => {
      if (!hoveredPoint) return
      selectedIndicator.position.copy(hoverIndicator.position)
      selectedIndicator.visible = true
      onSelectPoint(hoveredPoint)
    }

    renderer.domElement.addEventListener("pointermove", handlePointerMove)
    renderer.domElement.addEventListener("click", handleClick)

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
      renderer.domElement.removeEventListener("pointermove", handlePointerMove)
      renderer.domElement.removeEventListener("click", handleClick)
      cancelAnimationFrame(requestId)
      controls.dispose()
      scene.traverse((object) => {
        const obj = object as THREE.Object3D
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry?.dispose()
          const mat = obj.material
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
          else mat?.dispose()
        }
      })
      renderer.dispose()
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
    }
  }, [basis, points, onSelectPoint])

  return <div ref={containerRef} className="w-full h-[400px] rounded border border-slate-700 bg-slate-950" />
}

// ---------- main component ----------

export default function LatticeVisualizer() {
  const [basis, setBasis] = useState<Vec[]>([
    [1, 0],
    [0, 1],
  ])
  const [range, setRange] = useState(2)
  const [selectedPoint, setSelectedPoint] = useState<LatticePoint | null>(null)

  const dim = basis.length
  const tooManyDims = dim > MAX_DIM

  // A point selected under one basis/range doesn't mean anything once either changes.
  useEffect(() => {
    setSelectedPoint(null)
  }, [basis, range])

  const addVector = () => {
    if (basis.length >= MAX_BASIS) return
    const newDim = basis.length + 1
    const resized = basis.map((v) => resizeVector(v, newDim))
    setBasis([...resized, defaultVector(newDim, newDim - 1)])
  }

  const removeVector = (index: number) => {
    if (basis.length <= MIN_DIM) return
    const newDim = basis.length - 1
    const filtered = basis.filter((_, i) => i !== index)
    setBasis(filtered.map((v) => resizeVector(v, newDim)))
  }

  const updateComponent = (vecIndex: number, compIndex: number, value: string) => {
    const num = parseFloat(value)
    setBasis((prev) =>
      prev.map((v, i) => {
        if (i !== vecIndex) return v
        const next = [...v]
        next[compIndex] = Number.isNaN(num) ? 0 : num
        return next
      })
    )
  }

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-1 flex-col gap-4">
        {/* basis editor */}
        <div className="space-y-2">
          {basis.map((v, vecIdx) => (
            <div key={vecIdx} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: VECTOR_COLORS[vecIdx % VECTOR_COLORS.length] }} />
              <span className="text-slate-400 text-sm w-6">b{vecIdx + 1}</span>
              <div className="flex gap-1">
                {v.map((val, compIdx) => (
                  <input
                    key={compIdx}
                    type="number"
                    step="any"
                    value={val}
                    onChange={(e) => updateComponent(vecIdx, compIdx, e.target.value)}
                    className="w-16 p-1 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                  />
                ))}
              </div>
              <button
                onClick={() => removeVector(vecIdx)}
                disabled={basis.length <= MIN_DIM}
                className="ml-auto text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-400 text-sm px-2"
                title="Remove basis vector"
              >
                ✕
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={addVector}
              disabled={basis.length >= MAX_BASIS}
              className="text-sm text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:hover:text-blue-400"
            >
              + Add basis vector
            </button>
          </div>

          {!tooManyDims && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Show ±</span>
              <select
                value={range}
                onChange={(e) => setRange(parseInt(e.target.value))}
                className="bg-slate-700 text-white rounded border border-slate-600 px-1 py-0.5"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
              <span>combinations</span>
            </div>
          )}

          {/* selected point info */}
          {selectedPoint && (
            <div className="rounded border border-sky-700 bg-slate-900 p-4 text-sm">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-white">Selected point</h4>
                <button onClick={() => setSelectedPoint(null)} className="text-slate-400 hover:text-white text-xs">
                  ✕ Close
                </button>
              </div>
              <p className="font-mono text-sky-300">
                ({selectedPoint.coords.map((c) => formatNumber(c)).join(", ")})
              </p>
              <p className="text-slate-400 mt-1">= {formatCombination(selectedPoint.coeffs)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-[2] flex-col gap-4">
        {/* visualization */}
        {tooManyDims ? (
          <div className="rounded border border-slate-700 bg-slate-950 p-6 text-slate-300 text-sm leading-relaxed">
            With {dim} basis vectors, this lattice lives in {dim}-dimensional space. There's no real way to visualize objects beyond the third dimension (3D), so this visualization will only show lattices made from up to 3 basis vectors. 
          </div>
        ) : dim === MIN_DIM ? (
          <Lattice2D basis={basis} range={range} selectedPoint={selectedPoint} onSelectPoint={setSelectedPoint} />
        ) : (
          <Lattice3D basis={basis} range={range} onSelectPoint={setSelectedPoint} />
        )}

        {!tooManyDims && (
          <p className="text-slate-500 text-xs">
            The dots represent the integer combination of the basis vectors- in other words, they represent the lattice. The colored arrows are the basis vectors.
            Hover over point to highlight it, click to see what it's made of.
            {dim === 3 && " Drag to rotate, scroll to zoom."}
          </p>
        )}
      </div>
    </div>
  )
}
