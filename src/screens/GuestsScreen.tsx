import { AvatarStack } from '../components/Avatars'
import { BackIcon } from '../components/Icons'
import { PosterArt } from '../components/Poster'
import { MAX_GUESTS, MIN_GUESTS, movie } from '../data'

type Props = { guests: number; onChange: (n: number) => void; onContinue: () => void }

export function MovieSummary() {
  return (
    <div className="movie-summary">
      <div className="movie-thumb">
        <PosterArt compact />
      </div>
      <div>
        <div className="movie-logo">
          <span>the</span>MIDNIGHT HEIST
        </div>
        <div className="movie-meta">
          {movie.year} · {movie.genre} · {movie.runtime} min
        </div>
        <div className="movie-rating">
          <span className="imdb">IMDb</span> {movie.rating}
        </div>
      </div>
    </div>
  )
}

export function GuestsScreen({ guests, onChange, onContinue }: Props) {
  return (
    <div className="screen">
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
          <AvatarStack count={guests} size={guests > 4 ? 60 : 76} />
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
