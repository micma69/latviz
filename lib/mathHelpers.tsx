//This code was created in order to help LLL and BKZ modules render better calculation 
// details, such as rendering indexing symbols for variables.

import type { ReactNode } from 'react'

const mathSubscriptPattern = /(μ|mu|u|b)_(\{([^}]+)\}|[A-Za-z0-9,-]+)/g

function renderMathLine(line: string): ReactNode {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = mathSubscriptPattern.exec(line)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}-${match.index}`}>
          {line.slice(lastIndex, match.index)}
        </span>
      )
    }

    const baseSymbol = match[1] === 'mu' ? 'μ' : match[1]
    const index = match[3] ?? match[2]

    parts.push(
      <span key={`${match.index}-${baseSymbol}-${index}`}>
        {baseSymbol}
        <sub>{index}</sub>
      </span>
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < line.length) {
    parts.push(
      <span key={`text-${lastIndex}-end`}>
        {line.slice(lastIndex)}
      </span>
    )
  }

  return <span>{parts}</span>
}

export function formatCalculationText(text: string): ReactNode[] {
  const lines = text.split('\n')
  return lines.flatMap((line, idx) => {
    const lineNode = renderMathLine(line)
    if (idx < lines.length - 1) {
      return [
        <span key={`line-${idx}`}>{lineNode}</span>,
        <span key={`newline-${idx}`}>{'\n'}</span>,
      ]
    }
    return [<span key={`line-${idx}`}>{lineNode}</span>]
  })
}
