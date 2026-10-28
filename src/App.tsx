import { useState } from 'react'
import { StatusBar } from './components/Icons'
import { CheckoutSheet } from './screens/CheckoutSheet'
import { GuestsScreen } from './screens/GuestsScreen'
import { SeatsScreen } from './screens/SeatsScreen'
import { TicketScreen } from './screens/TicketScreen'
import { buildSeatMap, markTaken, type Seat, type SeatMode } from './seats'

type Step = 'guests' | 'seats' | 'ticket'

const newBookingId = () => 'MH-' + Math.random().toString(36).slice(2, 8).toUpperCase()

export default function App() {
  const [step, setStep] = useState<Step>('guests')
  const [dir, setDir] = useState<'forward' | 'back'>('forward')
  const [guests, setGuests] = useState(3)
  const [mode, setMode] = useState<SeatMode>('together')
  const [seats, setSeats] = useState<Seat[]>([])
  const [checkout, setCheckout] = useState(false)
  const [bookingId, setBookingId] = useState(newBookingId)
  const [seatMap, setSeatMap] = useState(() => buildSeatMap())

  const go = (next: Step, d: 'forward' | 'back' = 'forward') => {
    setDir(d)
    setStep(next)
  }

  // keepBooking: 予約済みの席を埋まった席として残す（キャンセル時は残さない）
  const reset = (keepBooking: boolean) => {
    if (keepBooking) {
      setSeatMap((m) => markTaken(m, seats))
    }
    setSeats([])
    setCheckout(false)
    setBookingId(newBookingId())
    go('guests', 'back')
  }

  return (
    <main className="stage">
      <div className="phone">
        <div className="dynamic-island" />
        <StatusBar />
        <div key={step} className={`screen-host slide-${dir}`}>
          {step === 'guests' && (
            <GuestsScreen
              guests={guests}
              onChange={(n) => {
                setGuests(n)
                setSeats([]) // 人数が変わったら席は選び直し
              }}
              onContinue={() => go('seats')}
            />
          )}
          {step === 'seats' && (
            <SeatsScreen
              map={seatMap}
              guests={guests}
              mode={mode}
              selected={seats}
              onModeChange={(m) => {
                setMode(m)
                setSeats([])
              }}
              onSelect={setSeats}
              onBack={() => go('guests', 'back')}
              onContinue={() => setCheckout(true)}
            />
          )}
          {step === 'ticket' && <TicketScreen seats={seats} bookingId={bookingId} onClose={() => reset(true)} onCancelBooking={() => reset(false)} />}
        </div>
        {checkout && (
          <CheckoutSheet
            guests={guests}
            seats={seats}
            onClose={() => setCheckout(false)}
            onPaid={() => {
              setCheckout(false)
              go('ticket')
            }}
          />
        )}
        <div className="home-indicator" />
      </div>
    </main>
  )
}
