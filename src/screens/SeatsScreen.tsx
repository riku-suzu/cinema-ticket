import { useMemo, useState } from 'react'
import { AvatarStack } from '../components/Avatars'
import { BackIcon, ChevronDown, SeatIcon } from '../components/Icons'
import { blockAround, COLS, formatSeats, seatKey, selectableSeats, toggleSeat, type Seat, type SeatMap, type SeatMode } from '../seats'

type Props = {
  map: SeatMap
  guests: number
  mode: SeatMode
  selected: Seat[]
  onModeChange: (m: SeatMode) => void
  onSelect: (s: Seat[]) => void
  onBack: () => void
  onContinue: () => void
}

const CELL = 26
const GAP_X = 7
const GAP_Y = 10

export function SeatsScreen({ map, guests, mode, selected, onModeChange, onSelect, onBack, onContinue }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const together = mode === 'together' && guests > 1

  // 並び席モードでは「n席並びで座れる席」だけを明るく表示する
  const available = useMemo(() => selectableSeats(map, guests, together), [map, guests, together])

  const selectedKeys = new Set(selected.map(seatKey))
  const complete = selected.length === guests

  function handleSeat(seat: Seat) {
    if (!available.has(seatKey(seat))) return
    if (together) {
      const block = blockAround(map, guests, seat)
      if (block) onSelect(block)
    } else {
      onSelect(toggleSeat(selected, seat, guests))
    }
  }

  // 選択した席の上に出すラベルの位置
  const label = formatSeats(selected)
  const tip = useMemo(() => {
    if (!selected.length) return null
    const topRow = Math.min(...selected.map((s) => s.row))
    const inRow = selected.filter((s) => s.row === topRow).map((s) => s.col)
    const center = (Math.min(...inRow) + Math.max(...inRow) + 1) / 2
    return { left: center * CELL + (center - 0.5) * GAP_X, top: topRow * (CELL + GAP_Y) - 34 }
  }, [selected])

  const gridWidth = COLS * CELL + (COLS - 1) * GAP_X

  return (
    <div className="screen">
      <button className="icon-btn nav-btn" aria-label="戻る" onClick={onBack}>
        <BackIcon />
      </button>
      <h1 className="title">Where to Sit?</h1>
      <p className="subtitle">Select Seats</p>

      <div className="cinema-screen" style={{ width: gridWidth + 16 }}>
        <svg viewBox="0 0 340 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="scene" x1="0" x2="1">
              <stop offset="0" stopColor="#6b4e2e" />
              <stop offset=".35" stopColor="#e9cf9f" />
              <stop offset=".6" stopColor="#f7e7c4" />
              <stop offset="1" stopColor="#7a5a34" />
            </linearGradient>
          </defs>
          <path d="M0 4 Q170 -8 340 4 L334 44 Q170 30 6 44Z" fill="url(#scene)" className="scene-fill" />
        </svg>
        <div className="screen-glow" />
      </div>

      <div className="seat-grid-wrap">
        <div
          className="seat-grid"
          style={{ gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`, columnGap: GAP_X, rowGap: GAP_Y }}
        >
          {map.map((row, r) =>
            row.map((state, c) => {
              const k = seatKey({ row: r, col: c })
              if (state === 'none') return <span key={k} />
              const isSel = selectedKeys.has(k)
              const isAvail = available.has(k)
              const cls = isSel ? 'seat selected' : isAvail ? 'seat available' : state === 'taken' ? 'seat taken' : 'seat dim'
              return (
                <button
                  key={k}
                  className={cls}
                  style={{ animationDelay: `${r * 45 + Math.abs(c - COLS / 2) * 15}ms` }}
                  onClick={() => handleSeat({ row: r, col: c })}
                  disabled={!isAvail}
                  aria-label={`Row ${r + 1} Seat ${c + 1}${state === 'taken' ? '（予約済み）' : ''}`}
                  aria-pressed={isSel}
                >
                  <SeatIcon />
                </button>
              )
            }),
          )}

          {tip && label && (
            <div key={seatKey(selected[0])} className="seat-tip" style={{ left: tip.left, top: tip.top }}>
              <AvatarStack count={selected.length} size={16} overlap={0.2} />
              <span>
                Row {label.row} · {selected.length} {selected.length === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mode-picker">
        <button className="pill-btn" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} disabled={guests === 1}>
          {together ? `${guests} Seats Together` : guests === 1 ? '1 Seat' : 'Separate Seats'}
          {guests > 1 && <ChevronDown />}
        </button>
        {menuOpen && (
          <div className="menu" role="menu">
            {(['together', 'separate'] as const).map((m) => (
              <button
                key={m}
                role="menuitemradio"
                aria-checked={mode === m}
                className={mode === m ? 'active' : ''}
                onClick={() => {
                  onModeChange(m)
                  setMenuOpen(false)
                }}
              >
                {m === 'together' ? `${guests} Seats Together` : 'Separate Seats'}
              </button>
            ))}
          </div>
        )}
        <p className="hint">
          {together
            ? available.size
              ? 'Showing where you can sit together'
              : 'No seats together — try separate seats'
            : complete
              ? 'All seats picked'
              : `Pick ${guests - selected.length} more seat${guests - selected.length === 1 ? '' : 's'}`}
        </p>
      </div>

      <div className="footer">
        <button className="primary-btn" onClick={onContinue} disabled={!complete}>
          Continue
        </button>
      </div>
    </div>
  )
}
