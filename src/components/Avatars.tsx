// 人数ぶん並ぶキャラクター。形・色・表情の組み合わせで6体。

type Face = 'wink' | 'tongue' | 'glasses' | 'smile' | 'surprised' | 'sleepy'

const characters: { color: string; shade: string; shape: string; face: Face }[] = [
  {
    color: '#5ec8c8',
    shade: '#3fa9ab',
    // ぷにっとした五角形
    shape: 'M32 4 C44 4 60 16 60 30 C60 46 52 60 32 60 C14 60 4 48 4 32 C4 16 20 4 32 4Z',
    face: 'wink',
  },
  { color: '#ffd23f', shade: '#f2b705', shape: 'M10 4 H54 Q60 4 60 10 V54 Q60 60 54 60 H10 Q4 60 4 54 V10 Q4 4 10 4Z', face: 'tongue' },
  { color: '#f59a7a', shade: '#e07a5f', shape: 'M32 4 A28 28 0 1 1 31.9 4Z', face: 'glasses' },
  {
    color: '#a78bfa',
    shade: '#8b6cf0',
    // 花形
    shape:
      'M32 4 C38 4 40 10 44 12 C48 10 56 12 56 20 C60 24 60 30 56 34 C60 40 56 48 50 50 C48 56 40 60 32 58 C24 60 16 56 14 50 C8 48 4 40 8 34 C4 30 4 22 10 20 C10 12 18 10 22 12 C24 8 28 4 32 4Z',
    face: 'smile',
  },
  { color: '#7ed957', shade: '#5cb838', shape: 'M32 4 L60 56 Q60 60 56 60 H8 Q4 60 4 56Z', face: 'surprised' },
  { color: '#ff7eb6', shade: '#e95b99', shape: 'M16 4 H48 Q60 4 60 16 V40 Q60 60 32 60 Q4 60 4 40 V16 Q4 4 16 4Z', face: 'sleepy' },
]

function FaceMarks({ face }: { face: Face }) {
  const s = { stroke: '#1d1d1f', strokeWidth: 2.4, fill: 'none', strokeLinecap: 'round' as const }
  switch (face) {
    case 'wink':
      return (
        <>
          <circle cx="24" cy="30" r="2.6" fill="#1d1d1f" />
          <path d="M36 30 l5 -3 M36 30 l5 3" {...s} />
          <path d="M26 42 q3 -3 6 0 q3 3 6 0" {...s} />
        </>
      )
    case 'tongue':
      return (
        <>
          <path d="M19 29 q4 -4 8 0 M37 29 q4 -4 8 0" {...s} />
          <path d="M22 40 q10 8 20 0" {...s} />
          <path d="M30 43 q3 7 6 0" fill="#ff5a6e" stroke="#1d1d1f" strokeWidth="1.6" />
          <circle cx="16" cy="37" r="3.5" fill="#ff8a7a" opacity=".55" />
          <circle cx="48" cy="37" r="3.5" fill="#ff8a7a" opacity=".55" />
        </>
      )
    case 'glasses':
      return (
        <>
          <circle cx="23" cy="30" r="6.5" {...s} />
          <circle cx="41" cy="30" r="6.5" {...s} />
          <path d="M29.5 30 h5" {...s} />
          <circle cx="23" cy="30" r="1.8" fill="#1d1d1f" />
          <circle cx="41" cy="30" r="1.8" fill="#1d1d1f" />
          <path d="M27 44 q5 4 10 0" {...s} />
        </>
      )
    case 'smile':
      return (
        <>
          <circle cx="24" cy="30" r="2.6" fill="#1d1d1f" />
          <circle cx="40" cy="30" r="2.6" fill="#1d1d1f" />
          <path d="M23 39 q9 9 18 0" {...s} />
        </>
      )
    case 'surprised':
      return (
        <>
          <circle cx="25" cy="38" r="3" fill="#1d1d1f" />
          <circle cx="39" cy="38" r="3" fill="#1d1d1f" />
          <ellipse cx="32" cy="49" rx="3" ry="4" fill="#1d1d1f" />
        </>
      )
    case 'sleepy':
      return (
        <>
          <path d="M19 31 q5 4 10 0 M35 31 q5 4 10 0" {...s} />
          <path d="M28 43 q4 3 8 0" {...s} />
        </>
      )
  }
}

function Avatar({ index, size = 64 }: { index: number; size?: number }) {
  const c = characters[index % characters.length]
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <path d={c.shape} fill={c.shade} transform="translate(0 2)" />
      <path d={c.shape} fill={c.color} />
      <FaceMarks face={c.face} />
    </svg>
  )
}

export function AvatarStack({ count, size = 64, overlap = 0.12 }: { count: number; size?: number; overlap?: number }) {
  return (
    <div className="avatar-stack" style={{ height: size }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="avatar-item"
          style={{ marginLeft: i === 0 ? 0 : -size * overlap, zIndex: i === Math.floor(count / 2) ? 10 : 10 - Math.abs(i - count / 2) }}
        >
          <Avatar index={i} size={size} />
        </div>
      ))}
    </div>
  )
}
