import type { ReactNode } from 'react'

export type LabeledValue = [label: string, value: ReactNode]

// 「Screen 2」「Row 4」のような見出しと値の組を並べる
export function LabeledValues({ className, items }: { className: string; items: LabeledValue[] }) {
  return (
    <div className={className}>
      {items.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </div>
  )
}
