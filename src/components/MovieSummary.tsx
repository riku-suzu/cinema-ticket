import { movie } from '../data'
import { MovieLogo } from './MovieLogo'
import { PosterArt } from './Poster'
import './MovieSummary.css'

// サムネイル・ロゴ・作品情報を横に並べたもの（人数選択とチェックアウトで使う）
export function MovieSummary() {
  return (
    <div className="movie-summary">
      <div className="movie-thumb">
        <PosterArt compact />
      </div>
      <div>
        <MovieLogo />
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
