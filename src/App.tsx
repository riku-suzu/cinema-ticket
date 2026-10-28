import { useState } from 'react'
import { PhoneFrame } from './components/PhoneFrame'
import { CheckoutSheet } from './screens/CheckoutSheet'
import { GuestsScreen } from './screens/GuestsScreen'
import { SeatsScreen } from './screens/SeatsScreen'
import { TicketScreen } from './screens/TicketScreen'
import { buildSeatMap, markTaken, type Seat, type SeatMode } from './seats'
import './App.css'

// 画面は 人数 → 席 →（支払いシート）→ チケット の順に進む
type Step = 'guests' | 'seats' | 'ticket'
// 画面が入ってくる向き（進むときは右から、戻るときは左から）
type Direction = 'forward' | 'back'

const DEFAULT_GUESTS = 3

const newBookingId = () => 'MH-' + Math.random().toString(36).slice(2, 8).toUpperCase()

export default function App() {
  // 画面遷移
  const [step, setStep] = useState<Step>('guests')
  const [direction, setDirection] = useState<Direction>('forward')
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  // 予約の内容
  const [guests, setGuests] = useState(DEFAULT_GUESTS)
  const [mode, setMode] = useState<SeatMode>('together')
  const [seats, setSeats] = useState<Seat[]>([])
  const [bookingId, setBookingId] = useState(newBookingId)
  const [seatMap, setSeatMap] = useState(() => buildSeatMap())

  const goTo = (next: Step, dir: Direction = 'forward') => {
    setDirection(dir)
    setStep(next)
  }

  // 人数や選び方が変わったら席は選び直し
  const changeGuests = (n: number) => {
    setGuests(n)
    setSeats([])
  }
  const changeMode = (m: SeatMode) => {
    setMode(m)
    setSeats([])
  }

  const finishPayment = () => {
    setCheckoutOpen(false)
    goTo('ticket')
  }

  // チケット画面を閉じて最初の画面に戻る。
  // keepBooking: 予約した席を埋まった席として残す（キャンセル時は残さない）
  const startOver = (keepBooking: boolean) => {
    if (keepBooking) setSeatMap((m) => markTaken(m, seats))
    setSeats([])
    setCheckoutOpen(false)
    setBookingId(newBookingId())
    goTo('guests', 'back')
  }

  return (
    <PhoneFrame>
      {/* key で画面ごとに作り直し、入ってくるアニメーションを毎回再生する */}
      <div key={step} className={`screen-host slide-${direction}`}>
        {step === 'guests' && <GuestsScreen guests={guests} onChange={changeGuests} onContinue={() => goTo('seats')} />}
        {step === 'seats' && (
          <SeatsScreen
            map={seatMap}
            guests={guests}
            mode={mode}
            selected={seats}
            onModeChange={changeMode}
            onSelect={setSeats}
            onBack={() => goTo('guests', 'back')}
            onContinue={() => setCheckoutOpen(true)}
          />
        )}
        {step === 'ticket' && (
          <TicketScreen seats={seats} bookingId={bookingId} onClose={() => startOver(true)} onCancelBooking={() => startOver(false)} />
        )}
      </div>
      {checkoutOpen && <CheckoutSheet guests={guests} seats={seats} onClose={() => setCheckoutOpen(false)} onPaid={finishPayment} />}
    </PhoneFrame>
  )
}
