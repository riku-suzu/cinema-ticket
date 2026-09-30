// ダミーデータと座席ロジック。実データに差し替えるときはこのファイルだけ触ればよい。

export const movie = {
  title: 'Midnight Heist',
  year: 2025,
  genre: 'Animation',
  runtime: 96,
  rating: 7.7,
}

export const showtime = {
  label: 'Wed, Apr 12 at 2:45 PM',
  screen: 2,
}

export const card = { brand: 'mastercard', last4: '4558' }

export const TICKET_PRICE = 6.5
export const BOOKING_FEE = 2.49
export const MIN_GUESTS = 1
export const MAX_GUESTS = 6

export const ROWS = 8
export const COLS = 10

export type SeatState = 'free' | 'taken' | 'none'

// 決定的な疑似乱数で「埋まっている席」を作る（リロードしても同じ配置）
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildSeatMap(seed = 42): SeatState[][] {
  const rand = mulberry32(seed)
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      // 最前列は両端が通路
      if (r === 0 && (c === 0 || c === COLS - 1)) return 'none'
      return rand() < 0.38 ? 'taken' : 'free'
    }),
  )
}

export type Seat = { row: number; col: number } // 0始まり

// n席並びで取れるブロックの開始位置をすべて返す
export function togetherStarts(map: SeatState[][], n: number): Seat[] {
  const starts: Seat[] = []
  map.forEach((row, r) => {
    for (let c = 0; c + n <= COLS; c++) {
      if (row.slice(c, c + n).every((s) => s === 'free')) starts.push({ row: r, col: c })
    }
  })
  return starts
}

// クリックした席を含む並び席ブロックを探す（できるだけクリック位置が中央に来るもの）
export function blockAround(map: SeatState[][], n: number, seat: Seat): Seat[] | null {
  const candidates: number[] = []
  for (let c = seat.col - n + 1; c <= seat.col; c++) {
    if (c < 0 || c + n > COLS) continue
    if (map[seat.row].slice(c, c + n).every((s) => s === 'free')) candidates.push(c)
  }
  if (!candidates.length) return null
  const ideal = seat.col - Math.floor((n - 1) / 2)
  candidates.sort((a, b) => Math.abs(a - ideal) - Math.abs(b - ideal))
  return Array.from({ length: n }, (_, i) => ({ row: seat.row, col: candidates[0] + i }))
}

export function formatSeats(seats: Seat[]) {
  if (!seats.length) return null
  const rows = [...new Set(seats.map((s) => s.row + 1))]
  const cols = seats.map((s) => s.col + 1).sort((a, b) => a - b)
  const contiguous = rows.length === 1 && cols.every((c, i) => i === 0 || c === cols[i - 1] + 1)
  return {
    row: rows.join(', '),
    seats: contiguous && cols.length > 1 ? `${cols[0]} - ${cols[cols.length - 1]}` : cols.join(', '),
  }
}

export const money = (v: number) => `$${v.toFixed(2)}`
