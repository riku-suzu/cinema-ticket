import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react'

const TAP_SLOP = 4 // これ以上動いたらタップではなくドラッグとみなす（px）
const DEG_PER_PX = 0.9 // 横ドラッグ1pxあたりの回転角
const TILT_PER_PX = 0.2 // 縦ドラッグ1pxあたりの傾き
const MAX_TILT = 18
const FLING_DEG_PER_VELOCITY = 260 // 離した瞬間の速度（px/ms）を回転角に変換する係数
const MAX_FLING = 540 // 回りすぎないよう1.5回転まで
const HINT_ANGLE = -28
const HINT_START_MS = 900
const HINT_END_MS = 1350

type Drag = {
  x: number
  y: number
  angle: number
  moved: boolean
  lastX: number
  lastT: number
  v: number // px/ms
}

const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v))
// 表（0°）か裏（180°）の近いほうにそろえる
const snap = (a: number) => Math.round(a / 180) * 180

// ドラッグで3D回転、タップで裏返し。離すと表か裏のどちらかにスナップする
export function useTicketSpin(enabled: boolean) {
  const [angle, setAngle] = useState(0)
  const [tilt, setTilt] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef<Drag | null>(null)

  // 完成直後に少しだけ揺らして「回せる」ことを伝える
  useEffect(() => {
    if (!enabled) return
    const t1 = setTimeout(() => setAngle(HINT_ANGLE), HINT_START_MS)
    const t2 = setTimeout(() => setAngle(0), HINT_END_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [enabled])

  const flip = () => setAngle((a) => snap(a) + 180)

  const handlers = {
    onPointerDown(e: PointerEvent<HTMLDivElement>) {
      if (!enabled) return
      e.currentTarget.setPointerCapture(e.pointerId)
      drag.current = { x: e.clientX, y: e.clientY, angle, moved: false, lastX: e.clientX, lastT: e.timeStamp, v: 0 }
      setDragging(true)
    },
    onPointerMove(e: PointerEvent<HTMLDivElement>) {
      const d = drag.current
      if (!d) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) d.moved = true
      const dt = Math.max(1, e.timeStamp - d.lastT)
      d.v = (e.clientX - d.lastX) / dt
      d.lastX = e.clientX
      d.lastT = e.timeStamp
      setAngle(d.angle + dx * DEG_PER_PX)
      setTilt(clamp(-dy * TILT_PER_PX, MAX_TILT))
    },
    onPointerUp() {
      const d = drag.current
      if (!d) return
      drag.current = null
      setDragging(false)
      setTilt(0)
      if (!d.moved) return flip()
      // 勢いよく弾いたら、その方向に回り続けてから止まる
      const fling = clamp(d.v * FLING_DEG_PER_VELOCITY, MAX_FLING)
      setAngle((a) => snap(a + fling))
    },
    onPointerCancel() {
      drag.current = null
      setDragging(false)
      setTilt(0)
      setAngle(snap)
    },
    onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
      if (!enabled) return
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        flip()
      } else if (e.key === 'ArrowLeft') setAngle((a) => snap(a) - 180)
      else if (e.key === 'ArrowRight') setAngle((a) => snap(a) + 180)
    },
  }

  const norm = ((angle % 360) + 360) % 360
  const style = {
    transform: `rotateX(${tilt}deg) rotateY(${angle}deg)`,
    // 光沢の位置（0〜100%）。半回転ごとに端から端へ動く
    '--shine': `${((angle % 180) + 180) % 180 / 1.8}%`,
  } as CSSProperties

  return { handlers, style, dragging, isBack: norm > 90 && norm < 270 }
}
