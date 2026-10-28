import type { ReactNode } from 'react'

type Props = {
  label: string
  /** true の間は閉じるアニメーションを再生する */
  closing?: boolean
  className?: string
  /** 背景をタップしたとき */
  onDismiss: () => void
  children: ReactNode
}

// 画面の下から出てくるシート。背景のタップで onDismiss を呼ぶ
export function BottomSheet({ label, closing = false, className, onDismiss, children }: Props) {
  const out = closing ? 'out' : ''
  return (
    <div className={`sheet-backdrop ${out}`} onClick={onDismiss}>
      <div className={`sheet ${className ?? ''} ${out}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={label}>
        {children}
      </div>
    </div>
  )
}
