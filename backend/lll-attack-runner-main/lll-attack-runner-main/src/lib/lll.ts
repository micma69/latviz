import { LLLStep } from './types'

export interface LLLResult {
  reducedBasis: number[][]
  iterations: number
  solutionVector?: number[]
  success: boolean
  steps?: LLLStep[]
}

function yieldToUI(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 0))
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, val, i) => sum + val * b[i], 0)
}

function vectorSubtract(a: number[], b: number[]): number[] {
  return a.map((val, i) => val - b[i])
}

function vectorScale(v: number[], scalar: number): number[] {
  return v.map(val => val * scalar)
}

function vectorAdd(a: number[], b: number[]): number[] {
  return a.map((val, i) => val + b[i])
}

function vectorNorm(v: number[]): number {
  return Math.sqrt(dotProduct(v, v))
}

function isNonZeroVector(v: number[]): boolean {
  return vectorNorm(v) > 1e-10
}

function gramSchmidt(basis: number[][]): { orthogonal: number[][], mu: number[][] } {
  const n = basis.length
  const orthogonal: number[][] = []
  const mu: number[][] = Array.from({ length: n }, () => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    let vec = [...basis[i]]
    
    for (let j = 0; j < i; j++) {
      const denom = dotProduct(orthogonal[j], orthogonal[j])
      if (Math.abs(denom) > 1e-10) {
        mu[i][j] = dotProduct(basis[i], orthogonal[j]) / denom
        vec = vectorSubtract(vec, vectorScale(orthogonal[j], mu[i][j]))
      }
    }
    
    orthogonal.push(vec)
  }

  return { orthogonal, mu }
}

function lovaszCondition(orthogonal: number[][], k: number, delta: number, mu: number[][]): boolean {
  if (k <= 0 || k >= orthogonal.length) {
    return true // If k is out of bounds, consider satisfied
  }
  const kIndex = k
  const kPrev = kIndex - 1
  const uK = orthogonal[kIndex] ?? []
  const uKPrev = orthogonal[kPrev] ?? []
  const muKPrev = mu[kIndex]?.[kPrev] ?? 0

  const left = dotProduct(uK, uK)
  const right = (delta - muKPrev * muKPrev) * dotProduct(uKPrev, uKPrev)
  return left >= right
}

function generateGSOCalculations(basis: number[][], orthogonal: number[][], mu: number[][]): string[] {
  const calculations: string[] = []
  const n = basis.length

  calculations.push("Gram-Schmidt Orthogonalization Process:")
  calculations.push("")

  for (let i = 0; i < n; i++) {
    calculations.push(`Step ${i + 1}: Computing orthogonal vector u_${i}`)
    calculations.push(`Input vector: b_${i} = [${basis[i].map(v => v.toFixed(4)).join(', ')}]`)

    let currentVec = [...basis[i]]
    calculations.push(`Initial: u_${i} = b_${i} = [${currentVec.map(v => v.toFixed(4)).join(', ')}]`)

    for (let j = 0; j < i; j++) {
      const denom = dotProduct(orthogonal[j], orthogonal[j])
      const numer = dotProduct(basis[i], orthogonal[j])
      const mu_ij = numer / denom

      calculations.push("")
      calculations.push(`Subtract projection onto u_${j}:`)
      calculations.push(`μ_${i},${j} = (b_${i} · u_${j}) / (u_${j} · u_${j})`)
      calculations.push(`μ_${i},${j} = (${numer.toFixed(4)}) / (${denom.toFixed(4)}) = ${mu_ij.toFixed(4)}`)
      calculations.push(`u_${i} = u_${i} - μ_${i},${j} × u_${j}`)
      calculations.push(`u_${i} = [${currentVec.map(v => v.toFixed(4)).join(', ')}] - ${mu_ij.toFixed(4)} × [${orthogonal[j].map(v => v.toFixed(4)).join(', ')}]`)

      currentVec = vectorSubtract(currentVec, vectorScale(orthogonal[j], mu_ij))
      calculations.push(`u_${i} = [${currentVec.map(v => v.toFixed(4)).join(', ')}]`)
    }

    calculations.push("")
    calculations.push(`Final: u_${i} = [${orthogonal[i].map(v => v.toFixed(4)).join(', ')}]`)
    calculations.push("")
  }

  calculations.push("μ matrix:")
  for (let i = 0; i < n; i++) {
    calculations.push(`μ_${i} = [${mu[i].map(v => v.toFixed(4)).join(', ')}]`)
  }

  return calculations
}

function generateReduceCalculations(k: number, j: number, oldVector: number[], newVector: number[], basisJ: number[], muKJ: number, q: number): string[] {
  const calculations: string[] = []

  calculations.push("Basis Size Reduction:")
  calculations.push("")
  calculations.push(`Reducing vector b_${k} using vector b_${j}`)
  calculations.push("")
  calculations.push("Step 1: Check Lovasz coefficient")
  calculations.push(`μ_${k},${j} = ${muKJ.toFixed(4)}`)
  calculations.push(`|μ_${k},${j}| = ${Math.abs(muKJ).toFixed(4)} ${Math.abs(muKJ) > 0.5 ? '>' : '≤'} 0.5`)
  calculations.push("")
  calculations.push("Step 2: Calculate reduction coefficient")
  calculations.push(`q = round(μ_${k},${j}) = round(${muKJ.toFixed(4)}) = ${q}`)
  calculations.push("")
  calculations.push("Step 3: Perform reduction")
  calculations.push(`b_${k} = b_${k} - q × b_${j}`)
  calculations.push(`b_${k} = [${oldVector.map(v => v.toFixed(4)).join(', ')}] - ${q} × [${basisJ.map(v => v.toFixed(4)).join(', ')}]`)
  calculations.push(`b_${k} = [${newVector.map(v => v.toFixed(4)).join(', ')}]`)

  return calculations
}

function generateSwapCalculations(k: number, oldBasisK: number[], oldBasisKMinus1: number[], newBasisK: number[], newBasisKMinus1: number[], orthogonal: number[][], delta: number, mu: number[][]): string[] {
  const calculations: string[] = []

  calculations.push("Basis Swap Operation:")
  calculations.push("")
  calculations.push(`Checking Lovasz condition at k = ${k}`)
  calculations.push("")
  calculations.push("Step 1: Calculate Lovasz condition")

  const kIndex = k
  const kPrev = kIndex - 1
  const uK = orthogonal[kIndex] ?? []
  const uKPrev = orthogonal[kPrev] ?? []
  const muKPrev = mu[kIndex]?.[kPrev] ?? 0

  const left = dotProduct(uK, uK)
  const right = (delta - muKPrev * muKPrev) * dotProduct(uKPrev, uKPrev)

  calculations.push(`Left side: ||u_${kIndex}||² = ${left.toFixed(4)}`)
  calculations.push(`Right side: (δ - μ_${kIndex},${kPrev}²) × ||u_${kPrev}||²`)
  calculations.push(`Right side: (${delta} - ${muKPrev.toFixed(4)}²) × ${dotProduct(uKPrev, uKPrev).toFixed(4)}`)
  calculations.push(`Right side: ${(delta - muKPrev * muKPrev).toFixed(4)} × ${dotProduct(uKPrev, uKPrev).toFixed(4)} = ${right.toFixed(4)}`)
  calculations.push("")
  calculations.push(`Condition: ${left.toFixed(4)} ${left >= right ? '≥' : '<'} ${right.toFixed(4)}`)
  calculations.push(`Lovasz condition ${left >= right ? 'satisfied' : 'not satisfied'}`)
  calculations.push("")
  calculations.push("Step 2: Perform swap")
  calculations.push(`Since Lovasz condition is not satisfied, swap b_${kIndex} and b_${kPrev}`)
  calculations.push(`Before swap:`)
  calculations.push(`b_${kPrev} = [${oldBasisKMinus1.map(v => v.toFixed(4)).join(', ')}]`)
  calculations.push(`b_${kIndex} = [${oldBasisK.map(v => v.toFixed(4)).join(', ')}]`)
  calculations.push(`After swap:`)
  calculations.push(`b_${kPrev} = [${newBasisKMinus1.map(v => v.toFixed(4)).join(', ')}]`)
  calculations.push(`b_${kIndex} = [${newBasisK.map(v => v.toFixed(4)).join(', ')}]`)
  calculations.push("")
  calculations.push(`Set k = max(1, ${kIndex} - 1) = ${Math.max(1, kPrev)}`)

  return calculations
}

export function runLLL(basis: number[][], delta: number = 0.75, captureSteps: boolean = false): LLLResult {
  if (basis.length === 0 || basis[0].length === 0) {
    return { reducedBasis: basis, iterations: 0, success: false }
  }

  const n = basis.length
  const reducedBasis = basis.map(row => [...row])
  let iterations = 0
  const dimension = n
  const maxIterations = dimension >= 40 ? 5000 : dimension >= 20 ? 8000 : 10000
  const steps: LLLStep[] = []
  const startTime = Date.now()
  const timeoutMs = dimension >= 40 ? 30000 : dimension >= 20 ? 45000 : 60000

  if (captureSteps) {
    steps.push({
      iteration: 0,
      basis: reducedBasis.map(row => [...row]),
      k: 1,
      action: 'complete',
      description: 'Initial basis'
    })
  }

  let k: number = 1
  let stuckCounter = 0
  let lastK = k
  let lastYieldTime = Date.now()

  while (k < n && iterations < maxIterations) {
    iterations++
    
    const now = Date.now()
    if (now - startTime > timeoutMs) {
      console.warn(`LLL timeout after ${timeoutMs}ms at iteration ${iterations}`)
      break
    }
    
    if (k === lastK) {
      stuckCounter++
      if (stuckCounter > 200) {
        console.warn(`LLL stuck at k=${k} for 200 iterations`)
        break
      }
    } else {
      stuckCounter = 0
      lastK = k
    }

    const { orthogonal, mu } = gramSchmidt(reducedBasis)

    if (captureSteps && steps.length < 100) {
      const gsoCalculations = generateGSOCalculations(reducedBasis, orthogonal, mu)
      steps.push({
        iteration: iterations,
        basis: reducedBasis.map(row => [...row]),
        k,
        action: 'gso',
        description: `Gram-Schmidt Orthogonalization at k=${k}`,
        calculations: gsoCalculations
      })
    }

    for (let j = k - 1; j >= 0; j--) {
      const muKJ = mu[k]?.[j] ?? 0
      if (Math.abs(muKJ) > 0.5) {
        const q = Math.round(muKJ)
        const oldVector = [...reducedBasis[k]]
        reducedBasis[k] = vectorSubtract(reducedBasis[k], vectorScale(reducedBasis[j], q))

        if (captureSteps && steps.length < 100) {
          const reduceCalculations = generateReduceCalculations(k, j, oldVector, reducedBasis[k], reducedBasis[j], muKJ, q)
          steps.push({
            iteration: iterations,
            basis: reducedBasis.map(row => [...row]),
            k,
            action: 'reduce',
            description: `Reduced vector ${k} using vector ${j}`,
            calculations: reduceCalculations
          })
        }
      }
    }

    const { orthogonal: newOrthogonal, mu: newMu } = gramSchmidt(reducedBasis)

    if (lovaszCondition(newOrthogonal, k, delta, newMu)) {
      k++
    } else {
      const oldBasisK: number[] = [...reducedBasis[k]]
      const oldBasisKMinus1: number[] = [...reducedBasis[k - 1]]
      const temp = reducedBasis[k]
      reducedBasis[k] = reducedBasis[k - 1]
      reducedBasis[k - 1] = temp
      
      if (captureSteps && steps.length < 100) {
        const swapCalculations = generateSwapCalculations(k, oldBasisK, oldBasisKMinus1, reducedBasis[k], reducedBasis[k - 1], newOrthogonal, delta, newMu)
        steps.push({
          iteration: iterations,
          basis: reducedBasis.map(row => [...row]),
          k,
          action: 'swap',
          description: `Swapped vectors ${k} and ${k - 1}`,
          calculations: swapCalculations
        })
      }

      k = Math.max(1, k - 1)
    }
  }

  if (captureSteps) {
    steps.push({
      iteration: iterations,
      basis: reducedBasis.map(row => [...row]),
      k,
      action: 'complete',
      description: 'Reduction complete'
    })
  }

  const nonZeroVectors = reducedBasis.filter(isNonZeroVector)
  const shortestVector = nonZeroVectors.length > 0
    ? nonZeroVectors.reduce((shortest, vec) => {
        const currentNorm = vectorNorm(vec)
        const shortestNorm = vectorNorm(shortest)
        return currentNorm < shortestNorm ? vec : shortest
      }, nonZeroVectors[0])
    : undefined

  const hasZeroVector = reducedBasis.some(vec => 
    vec.every(val => Math.abs(val) < 1e-10)
  )

  const isReduced = iterations < maxIterations

  return {
    reducedBasis,
    iterations,
    solutionVector: shortestVector,
    success: isReduced && !hasZeroVector,
    steps: captureSteps ? steps : undefined
  }
}

export function findShortVector(reducedBasis: number[][]): number[] | undefined {
  const nonZeroVectors = reducedBasis.filter(isNonZeroVector)
  if (nonZeroVectors.length === 0) {
    return undefined
  }
  return nonZeroVectors.reduce((shortest, vec) => {
    const currentNorm = vectorNorm(vec)
    const shortestNorm = vectorNorm(shortest)
    return currentNorm < shortestNorm ? vec : shortest
  }, nonZeroVectors[0])
}

export function validateBasis(basis: number[][]): { valid: boolean; error?: string } {
  if (basis.length === 0) {
    return { valid: false, error: 'Basis cannot be empty' }
  }

  const cols = basis[0].length
  if (basis.some(row => row.length !== cols)) {
    return { valid: false, error: 'All rows must have the same length' }
  }

  if (basis.some(row => row.some(val => !isFinite(val)))) {
    return { valid: false, error: 'All values must be finite numbers' }
  }

  return { valid: true }
}

export function parseBasisFromString(input: string): number[][] | null {
  try {
    const lines = input.trim().split('\n').filter(line => line.trim())
    const basis = lines.map(line => {
      const values = line.trim().split(/[\s,]+/).map(val => {
        const num = parseFloat(val)
        if (!isFinite(num)) throw new Error('Invalid number')
        return num
      })
      return values
    })

    const validation = validateBasis(basis)
    if (!validation.valid) return null

    return basis
  } catch {
    return null
  }
}

export function formatBasis(basis: number[][]): string {
  return basis.map(row => row.map(val => val.toString().padStart(8)).join(' ')).join('\n')
}
