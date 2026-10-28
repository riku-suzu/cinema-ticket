import { useMemo } from 'react'
import './Barcode.css'

const WIDTH = 136
const HEIGHT = 30

// 予約番号から決まる飾りのバーコード（同じ番号なら同じ柄になる）
export function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    let h = [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7)
    const out: { x: number; w: number }[] = []
    for (let x = 0; x < WIDTH; ) {
      h = (h * 1103515245 + 12345) >>> 0
      const w = 1 + (h % 3)
      if ((h >> 4) % 3) out.push({ x, w })
      x += w + 1 + ((h >> 8) % 2)
    }
    return out
  }, [seed])
  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="barcode" preserveAspectRatio="none">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} width={b.w} height={HEIGHT} fill="#9a9a9a" />
      ))}
    </svg>
  )
}
