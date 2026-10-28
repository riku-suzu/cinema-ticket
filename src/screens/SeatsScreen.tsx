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

// 座席グリッドの寸法（px）
const CELL = 26
const GAP_X = 7
const GAP_Y = 10
const GRID_WIDTH = COLS * CELL + (COLS - 1) * GAP_X
const SCREEN_OVERHANG = 16 // スクリーンは座席の列より少しだけ広くする
const TIP_OFFSET_Y = 34 // 吹き出しを選んだ席の上に出す距離

// 席が前の列から順に、中央から外側へ出てくるアニメーションの遅れ
const ROW_DELAY_MS = 45
const COL_DELAY_MS = 15

// 選んだ席の上に出す吹き出しの位置（いちばん前の列の、選んだ席の中央）
function tipPosition(selected: Seat[]) {
  const topRow = Math.min(...selected.map((s) => s.row))
  const inRow = selected.filter((s) => s.row === topRow).map((s) => s.col)
  const center = (Math.min(...inRow) + Math.max(...inRow) + 1) / 2
  return { left: center * CELL + (center - 0.5) * GAP_X, top: topRow * (CELL + GAP_Y) - TIP_OFFSET_Y }
}

function hintText(together: boolean, hasTogetherSeats: boolean, remaining: number) {
  if (together) return hasTogetherSeats ? 'Showing where you can sit together' : 'No seats together — try separate seats'
  if (remaining === 0) return 'All seats picked'
  return `Pick ${remaining} more seat${remaining === 1 ? '' : 's'}`
}

export function SeatsScreen({ map, guests, mode, selected, onModeChange, onSelect, onBack, onContinue }: Props) {
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

  const label = formatSeats(selected)
  const tip = useMemo(() => (selected.length ? tipPosition(selected) : null), [selected])

  return (
    <div className="screen">
      <button className="icon-btn nav-btn" aria-label="戻る" onClick={onBack}>
        <BackIcon />
      </button>
      <h1 className="title">Where to Sit?</h1>
      <p className="subtitle">Select Seats</p>

      <CinemaScreen width={GRID_WIDTH + SCREEN_OVERHANG} />

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
                  style={{ animationDelay: `${r * ROW_DELAY_MS + Math.abs(c - COLS / 2) * COL_DELAY_MS}ms` }}
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

      <ModePicker
        guests={guests}
        mode={mode}
        together={together}
        onChange={onModeChange}
        hint={hintText(together, available.size > 0, guests - selected.length)}
      />

      <div className="footer">
        <button className="primary-btn" onClick={onContinue} disabled={!complete}>
          Continue
        </button>
      </div>
    </div>
  )
}

// 座席の前にある、奥に傾いたスクリーン
function CinemaScreen({ width }: { width: number }) {
  return (
    <div className="cinema-screen" style={{ width }}>
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
  )
}

const modeLabel = (m: SeatMode, guests: number) => (m === 'together' ? `${guests} Seats Together` : 'Separate Seats')

type ModePickerProps = {
  guests: number
  mode: SeatMode
  together: boolean
  onChange: (m: SeatMode) => void
  hint: string
}

// 「並び席 / ばらばら」の切り替えメニューとヒント
function ModePicker({ guests, mode, together, onChange, hint }: ModePickerProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const single = guests === 1

  return (
    <div className="mode-picker">
      <button className="pill-btn" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} disabled={single}>
        {single ? '1 Seat' : modeLabel(together ? 'together' : 'separate', guests)}
        {!single && <ChevronDown />}
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
                onChange(m)
                setMenuOpen(false)
              }}
            >
              {modeLabel(m, guests)}
            </button>
          ))}
        </div>
      )}
      <p className="hint">{hint}</p>
    </div>
  )
}
