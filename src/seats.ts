// 座席表と席選びのロジック。画面には依存しない純粋な関数だけを置く。

const ROWS = 8
export const COLS = 10

const SEAT_MAP_SEED = 42
const TAKEN_RATIO = 0.38 // 最初から埋まっている席の割合

/** free: 空き / taken: 予約済み / none: 席なし（通路） */
export type SeatState = 'free' | 'taken' | 'none'
export type SeatMap = SeatState[][]

/** 行・列とも0始まり */
export type Seat = { row: number; col: number }

/** together: 人数分を並びでまとめて選ぶ / separate: 1席ずつ選ぶ */
export type SeatMode = 'together' | 'separate'

export const seatKey = (s: Seat) => `${s.row}-${s.col}`

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

export function buildSeatMap(seed = SEAT_MAP_SEED): SeatMap {
  const rand = mulberry32(seed)
  return Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => {
      // 最前列は両端が通路
      if (r === 0 && (c === 0 || c === COLS - 1)) return 'none'
      return rand() < TAKEN_RATIO ? 'taken' : 'free'
    }),
  )
}

// 予約した席を「埋まっている席」にした新しい座席表を返す
export function markTaken(map: SeatMap, seats: Seat[]): SeatMap {
  const booked = new Set(seats.map(seatKey))
  return map.map((row, r) => row.map((s, c) => (booked.has(seatKey({ row: r, col: c })) ? 'taken' : s)))
}

// n席並びで取れるブロックの開始位置をすべて返す
export function togetherStarts(map: SeatMap, n: number): Seat[] {
  const starts: Seat[] = []
  map.forEach((row, r) => {
    for (let c = 0; c + n <= COLS; c++) {
      if (row.slice(c, c + n).every((s) => s === 'free')) starts.push({ row: r, col: c })
    }
  })
  return starts
}

// 選べる席（seatKey の集合）。並び席モードでは「n席並びで座れる席」だけ
export function selectableSeats(map: SeatMap, guests: number, together: boolean): Set<string> {
  const set = new Set<string>()
  if (!together) {
    map.forEach((row, r) => row.forEach((s, c) => s === 'free' && set.add(seatKey({ row: r, col: c }))))
    return set
  }
  for (const start of togetherStarts(map, guests)) {
    for (let i = 0; i < guests; i++) set.add(seatKey({ row: start.row, col: start.col + i }))
  }
  return set
}

// クリックした席を含む並び席ブロックを探す（できるだけクリック位置が中央に来るもの）
export function blockAround(map: SeatMap, n: number, seat: Seat): Seat[] | null {
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

// 1席ずつ選ぶモードでのタップ。選択済みなら外し、上限に達していたら一番古い選択を外す
export function toggleSeat(selected: Seat[], seat: Seat, max: number): Seat[] {
  const k = seatKey(seat)
  if (selected.some((s) => seatKey(s) === k)) return selected.filter((s) => seatKey(s) !== k)
  return [...selected, seat].slice(-max)
}

export type SeatLabel = { row: string; seats: string }

// 表示用の「Row 2」「Seats 4 - 6」などの文字列
export function formatSeats(seats: Seat[]): SeatLabel | null {
  if (!seats.length) return null
  const rows = [...new Set(seats.map((s) => s.row + 1))]
  const cols = seats.map((s) => s.col + 1).sort((a, b) => a - b)
  const contiguous = rows.length === 1 && cols.every((c, i) => i === 0 || c === cols[i - 1] + 1)
  return {
    row: rows.join(', '),
    seats: contiguous && cols.length > 1 ? `${cols[0]} - ${cols[cols.length - 1]}` : cols.join(', '),
  }
}
