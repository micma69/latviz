'use client'

import { useState, ReactNode } from "react"

type Tab = {
  label: string
  content: ReactNode
}

type TabbedBoxProps = {
  title: string
  tabs: Tab[]
  id?: string
}

export default function TabbedBox({ title, tabs, id }: TabbedBoxProps) {
  const [active, setActive] = useState(0)

  return (
    <div className="rounded-xl bg-slate-800 p-6 mb-8 mt-10 w-full md:w-3/4" id={id}>
      <h2 className="text-3xl mb-4 text-white flex items-center justify-center">{title}</h2>

      <div className="flex justify-center gap-2 mb-6">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
              active === i ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">{tabs[active]?.content}</div>
    </div>
  )
}
