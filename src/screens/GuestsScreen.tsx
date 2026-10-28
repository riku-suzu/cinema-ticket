import { AvatarStack } from '../components/Avatars'
import { BackIcon } from '../components/Icons'
import { MovieSummary } from '../components/MovieSummary'
import { MAX_GUESTS, MIN_GUESTS } from '../data'
import './GuestsScreen.css'

type Props = { guests: number; onChange: (n: number) => void; onContinue: () => void }

// 5人以上は横幅に収まるようキャラクターを小さくする
const avatarSize = (guests: number) => (guests > 4 ? 60 : 76)

export function GuestsScreen({ guests, onChange, onContinue }: Props) {
  return (
    <div className="screen">
      {/* 最初の画面なので戻る先はない（他の画面と見た目をそろえるために置いている） */}
      <button className="icon-btn nav-btn" aria-label="戻る" disabled>
        <BackIcon />
      </button>
      <MovieSummary />
      <div className="divider" />
      <h1 className="title">Who's going?</h1>
      <p className="subtitle">Select tickets amount</p>

      <div className="guests-stage">
        {/* key を変えて人数が変わるたびにポップインのアニメーションを再生 */}
        <div key={guests} className="pop-in">
          <AvatarStack count={guests} size={avatarSize(guests)} />
        </div>
      </div>

      <div className="stepper">
        <button className="round-btn" onClick={() => onChange(guests - 1)} disabled={guests <= MIN_GUESTS} aria-label="減らす">
          −
        </button>
        <span key={guests} className="stepper-value">
          {guests}
        </span>
        <button className="round-btn" onClick={() => onChange(guests + 1)} disabled={guests >= MAX_GUESTS} aria-label="増やす">
          +
        </button>
      </div>

      <div className="footer">
        <button className="primary-btn" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  )
}
