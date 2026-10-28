import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { ChevronRight, CloseIcon, Mastercard, TicketIcon } from '../components/Icons'
import { MovieSummary } from '../components/MovieSummary'
import { BOOKING_FEE, card, orderTotal, showtime, TICKET_PRICE } from '../data'
import { money } from '../format'
import { formatSeats, type Seat } from '../seats'

type Props = { guests: number; seats: Seat[]; onClose: () => void; onPaid: () => void }

const CLOSE_ANIMATION_MS = 260 // CSS の sheet-down / fade-out と同じ長さ
const FAKE_PAYMENT_MS = 900

export function CheckoutSheet({ guests, seats, onClose, onPaid }: Props) {
  const [closing, setClosing] = useState(false)
  const [paying, setPaying] = useState(false)
  const label = formatSeats(seats)
  const total = orderTotal(guests)

  function close() {
    if (paying) return
    setClosing(true)
    setTimeout(onClose, CLOSE_ANIMATION_MS)
  }

  function pay() {
    setPaying(true)
    // 仮の決済処理（ここを実際の決済APIに置き換える）
    setTimeout(onPaid, FAKE_PAYMENT_MS)
  }

  return (
    <BottomSheet label="Checkout" closing={closing} onDismiss={close}>
      <div className="sheet-head">
        <h2>Checkout</h2>
        <button className="icon-btn" onClick={close} aria-label="閉じる">
          <CloseIcon />
        </button>
      </div>

      <MovieSummary />

      <div className="booking-row">
        <span className="booking-icon">
          <TicketIcon />
        </span>
        <div>
          <div className="booking-when">{showtime.label}</div>
          <div className="booking-where">
            Screen {showtime.screen} · Row {label?.row} · {guests} {guests === 1 ? 'Seat' : 'Seats'}
          </div>
        </div>
      </div>

      <div className="sheet-divider" />

      <button className="line-item">
        <span>Pay With</span>
        <span className="line-value">
          <span className="muted">•••• {card.last4}</span>
          <Mastercard />
          <ChevronRight />
        </span>
      </button>
      <div className="line-item">
        <span>
          Total
          <small className="muted breakdown">
            {guests} × {money(TICKET_PRICE)} + {money(BOOKING_FEE)} fee
          </small>
        </span>
        <strong>{money(total)}</strong>
      </div>

      <button className="primary-btn" onClick={pay} disabled={paying}>
        {paying ? <span className="spinner" aria-label="処理中" /> : 'Pay'}
      </button>
    </BottomSheet>
  )
}
