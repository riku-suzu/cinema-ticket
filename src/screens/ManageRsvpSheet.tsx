import { BottomSheet } from '../components/BottomSheet'
import { movie, showtime } from '../data'
import type { SeatLabel } from '../seats'

type Props = { label: SeatLabel | null; onCancelBooking: () => void; onClose: () => void }

// チケット画面の「Manage RSVP」から開く、予約のキャンセル確認
export function ManageRsvpSheet({ label, onCancelBooking, onClose }: Props) {
  return (
    <BottomSheet label="Manage RSVP" className="action-sheet" onDismiss={onClose}>
      <h2>Manage RSVP</h2>
      <p className="muted">
        {movie.title} · {showtime.label}
        <br />
        Row {label?.row} · Seats {label?.seats}
      </p>
      <button className="danger-btn" onClick={onCancelBooking}>
        Cancel booking
      </button>
      <button className="ghost-btn" onClick={onClose}>
        Keep my tickets
      </button>
    </BottomSheet>
  )
}
