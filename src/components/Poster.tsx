import { movie } from '../data'

// 自作のポスター絵（スーツにサングラスのキツネ）。実際の作品画像に差し替える場合は <img> に置き換える。
export function PosterArt({ compact = false }: { compact?: boolean }) {
  return (
    <svg className="poster-art" viewBox={compact ? '10 64 140 100' : '0 0 160 220'} preserveAspectRatio="xMidYMid slice" aria-label={movie.title}>
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8321e" />
          <stop offset=".7" stopColor="#e2461f" />
          <stop offset="1" stopColor="#f26a1b" />
        </linearGradient>
      </defs>
      <rect width="160" height="220" fill="url(#bg)" />
      <circle cx="80" cy="212" r="70" fill="#f58b2a" opacity=".55" />
      {!compact && (
        <text x="80" y="32" textAnchor="middle" className="poster-title" fill="#f6efe2">
          <tspan x="80" fontSize="9">the</tspan>
          <tspan x="80" dy="17" fontSize="17">MIDNIGHT</tspan>
          <tspan x="80" dy="18" fontSize="17">HEIST</tspan>
        </text>
      )}
      <g transform="translate(0 20)">
        {/* しっぽ */}
        <path d="M104 178 q30 -6 34 12 q-18 -2 -30 8Z" fill="#231815" />
        {/* 脚 */}
        <path d="M66 170 h12 l-2 50 h-12Z M84 170 h12 l2 50 h-12Z" fill="#231815" />
        {/* 胴体（ジャケット） */}
        <path d="M56 120 q24 -14 48 0 l6 56 h-60Z" fill="#2b1d19" />
        {/* シャツ */}
        <path d="M72 118 h16 l-2 44 h-12Z" fill="#f4f0e8" />
        {/* ネクタイ */}
        <path d="M78 122 h4 l12 18 l-4 3 l-10 -13Z" fill="#c8321e" />
        {/* 頭 */}
        <path d="M60 78 l6 -26 l12 18 h4 l12 -18 l6 26 q2 22 -20 36 q-22 -14 -20 -36Z" fill="#231815" />
        {/* サングラス */}
        <ellipse cx="72" cy="90" rx="7" ry="5" fill="#f2a01b" />
        <ellipse cx="88" cy="90" rx="7" ry="5" fill="#f2a01b" />
        <path d="M79 90 h2" stroke="#231815" strokeWidth="2" />
      </g>
    </svg>
  )
}
