import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'
import { CloseIcon, PhoneIcon } from '../components/Icons'
import { PosterArt } from '../components/Poster'
import { formatSeats, movie, showtime, type Seat } from '../data'

type Phase = 'building' | 'printed' | 'done'
type Props = { seats: Seat[]; bookingId: string; onClose: () => void; onCancelBooking: () => void }

function Barcode({ seed }: { seed: string }) {
  const bars = useMemo(() => {
    let h = [...seed].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7)
    const out: { x: number; w: number }[] = []
    for (let x = 0; x < 136; ) {
      h = (h * 1103515245 + 12345) >>> 0
      const w = 1 + (h % 3)
      if ((h >> 4) % 3) out.push({ x, w })
      x += w + 1 + ((h >> 8) % 2)
    }
    return out
  }, [seed])
  return (
    <svg viewBox="0 0 136 30" className="barcode" preserveAspectRatio="none">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} width={b.w} height="30" fill="#9a9a9a" />
      ))}
    </svg>
  )
}

// ドラッグで3D回転、タップで裏返し。離すと表か裏のどちらかにスナップする
function useTicketSpin(enabled: boolean) {
  const [angle, setAngle] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ x: number; y: number; angle: number; moved: boolean; lastX: number; lastT: number; v: number } | null>(null)

  // 完成直後に少しだけ揺らして「回せる」ことを伝える
  useEffect(() => {
    if (!enabled) return
    const t1 = setTimeout(() => setAngle(-28), 900)
    const t2 = setTimeout(() => setAngle(0), 1350)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [enabled])

  const snap = (a: number) => Math.round(a / 180) * 180
  const flip = () => setAngle((a) => snap(a) + 180)

  const handlers = {
    onPointerDown(e: PointerEvent<HTMLDivElement>) {
      if (!enabled) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, y: e.clientY, angle, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 }
      setDragging(true)
    },
    onPointerMove(e: PointerEvent<HTMLDivElement>) {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true
      const dt = Math.max(1, e.timeStamp - d.lastT)
      d.v = (e.clientX - d.lastX) / dt // px/ms
      d.lastX = e.clientX
      d.lastT = e.timeStamp
      setAngle(d.angle + dx * 0.9)
      setTilt(Math.max(-18, Math.min(18, -dy * 0.2)))
    },
    onPointerUp() {
      const d = drag.current
      if (!d) return
      drag.current = null
      setDragging(false)
      setTilt(0)
      if (!d.moved) return flip()
      // 勢いよく弾いたら、その方向に回り続けてから止まる
      const fling = Math.max(-540, Math.min(540, d.v * 260)) // 回りすぎないよう1.5回転まで
      setAngle((a) => snap(a + fling))
    },
    onPointerCancel() {
      drag.current = null
      setDragging(false)
      setTilt(0)
      setAngle(snap)
    },
    onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      if (!enabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        flip()
      } else if (e.key === 'ArrowLeft') setAngle((a) => snap(a) - 180)
      else if (e.key === 'ArrowRight') setAngle((a) => snap(a) + 180)
    },
  }

  const norm = ((angle % 360) + 360) % 360
  const style = {
    transform: `rotateX(${tilt}deg) rotateY(${angle}deg)`,
    '--shine': `${((angle % 180) + 180) % 180 / 1.8}%`,
  } as CSSProperties

  return { handlers, style, dragging, isBack: norm > 90 && norm < 270 }
}

export function TicketScreen({ seats, bookingId, onClose, onCancelBooking }: Props) {
  const [phase, setPhase] = useState<Phase>('building')
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const label = formatSeats(seats)
  const spin = useTicketSpin(phase === 'done')

  // チケット生成の演出：枠 → 印刷 → 詳細表示
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('printed'), 1700)
    const t2 = setTimeout(() => setPhase('done'), 4700)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return (
    <div className={`screen ticket-screen phase-${phase}`}>
      <button className="icon-btn nav-btn close-ticket" aria-label="閉じる" onClick={onClose}>
        <CloseIcon size={22} />
      </button>

      <div
        className="ticket-spin"
        {...spin.handlers}
        role={phase === 'done' ? 'button' : undefined}
        tabIndex={phase === 'done' ? 0 : -1}
        aria-label="チケットを裏返す（ドラッグで回転）"
      >
        <div className={`ticket-rotor ${spin.dragging ? 'dragging' : ''}`} style={spin.style}>
          <div className="ticket-face ticket">
            <div className="ticket-dots" />
            <div className="ticket-print">
              <PosterArt showTitle />
              <div className="ticket-fade" />
              <div className="ticket-info">
                <div className="ticket-title">{movie.title}</div>
                <div className="ticket-date">{showtime.label}</div>
              </div>
            </div>
            <div className="ticket-stub">
              <Barcode seed={bookingId} />
            </div>
            <div className="ticket-glare" />
          </div>

          {/* 裏面 */}
          <div className="ticket-face ticket-back" aria-hidden={!spin.isBack}>
            <div className="movie-logo">
              <span>the</span>MIDNIGHT HEIST
            </div>
            <div className="back-rows">
              <div>
                <span>Date</span>
                <b>{showtime.label.split(' at ')[0]}</b>
              </div>
              <div>
                <span>Time</span>
                <b>{showtime.label.split(' at ')[1]}</b>
              </div>
              <div>
                <span>Screen</span>
                <b>{showtime.screen}</b>
              </div>
              <div>
                <span>Row</span>
                <b>{label?.row}</b>
              </div>
              <div>
                <span>Seats</span>
                <b>{label?.seats}</b>
              </div>
            </div>
            <div>
              <Barcode seed={bookingId} />
              <code>{bookingId}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="generating-pill">Generating your ticket</div>

      <div className="ticket-details">
        <div className="ticket-stats">
          <div>
            <span>Screen</span>
            <b>{showtime.screen}</b>
          </div>
          <div>
            <span>Row</span>
            <b>{label?.row}</b>
          </div>
          <div>
            <span>Seats</span>
            <b>{label?.seats}</b>
          </div>
        </div>
        <button className="white-btn" onClick={() => setRsvpOpen(true)}>
          Manage RSVP
        </button>
      </div>

      <div className="qr-panel">
        <div>
          <span className="muted">
            <PhoneIcon />
          </span>
          <p>
            Scan code at the counter
            <br />
            to get a physical ticket.
          </p>
          <code className="booking-id">{bookingId}</code>
        </div>
        <div className="qr">
          <QRCodeSVG value={`${bookingId}|${movie.title}|S${showtime.screen}|R${label?.row}|${label?.seats}`} size={62} bgColor="#fff" fgColor="#000" />
        </div>
      </div>

      {rsvpOpen && (
        <div className="sheet-backdrop" onClick={() => setRsvpOpen(false)}>
          <div className="sheet action-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Manage RSVP">
            <h2>Manage RSVP</h2>
            <p className="muted">
              {movie.title} · {showtime.label}
              <br />
              Row {label?.row} · Seats {label?.seats}
            </p>
            <button className="danger-btn" onClick={onCancelBooking}>
              Cancel booking
            </button>
            <button className="ghost-btn" onClick={() => setRsvpOpen(false)}>
              Keep my tickets
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
