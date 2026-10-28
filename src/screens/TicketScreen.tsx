import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { Barcode } from '../components/Barcode'
import { CloseIcon, PhoneIcon } from '../components/Icons'
import { LabeledValues, type LabeledValue } from '../components/LabeledValues'
import { MovieLogo } from '../components/MovieLogo'
import { PosterArt } from '../components/Poster'
import { movie, showtime } from '../data'
import { useTicketSpin } from '../hooks/useTicketSpin'
import { formatSeats, type Seat } from '../seats'
import { ManageRsvpSheet } from './ManageRsvpSheet'

/** building: 枠だけ / printed: 印刷された / done: 完成して詳細も表示 */
type Phase = 'building' | 'printed' | 'done'
type Props = { seats: Seat[]; bookingId: string; onClose: () => void; onCancelBooking: () => void }

// チケット生成の演出のタイミング（画面を開いてからの経過時間）
const PRINTED_AT_MS = 1700
const DONE_AT_MS = 4700

function useTicketPhase() {
  const [phase, setPhase] = useState<Phase>('building')
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('printed'), PRINTED_AT_MS)
    const t2 = setTimeout(() => setPhase('done'), DONE_AT_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  return phase
}

export function TicketScreen({ seats, bookingId, onClose, onCancelBooking }: Props) {
  const phase = useTicketPhase()
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const label = formatSeats(seats)
  const spin = useTicketSpin(phase === 'done')

  const seatInfo: LabeledValue[] = [
    ['Screen', showtime.screen],
    ['Row', label?.row],
    ['Seats', label?.seats],
  ]

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
          {/* 表面 */}
          <div className="ticket-face ticket">
            <div className="ticket-dots" />
            <div className="ticket-print">
              <PosterArt />
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
            <MovieLogo />
            <LabeledValues
              className="back-rows"
              items={[['Date', showtime.date], ['Time', showtime.time], ...seatInfo]}
            />
            <div>
              <Barcode seed={bookingId} />
              <code>{bookingId}</code>
            </div>
          </div>
        </div>
      </div>

      <div className="generating-pill">Generating your ticket</div>

      <div className="ticket-details">
        <LabeledValues className="ticket-stats" items={seatInfo} />
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

      {rsvpOpen && <ManageRsvpSheet label={label} onCancelBooking={onCancelBooking} onClose={() => setRsvpOpen(false)} />}
    </div>
  )
}
