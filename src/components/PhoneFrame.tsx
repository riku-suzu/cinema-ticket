import type { ReactNode } from 'react'

// 端末上部のステータスバー（飾り）
const StatusBar = () => (
  <div className="status-bar">
    <span>9:41</span>
    <span className="status-icons">
      <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" />
        <rect x="5" y="5" width="3" height="6" rx="1" />
        <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
        <rect x="15" y="0" width="3" height="11" rx="1" />
      </svg>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
        <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.4 10.4 0 0 0 8 .6 10.4 10.4 0 0 0 .9 3.4L2 4.6a8.7 8.7 0 0 1 6-2.4Zm0 3.3c1.4 0 2.7.5 3.7 1.4l1.1-1.2A7 7 0 0 0 8 3.9a7 7 0 0 0-4.8 1.8l1.1 1.2A5.4 5.4 0 0 1 8 5.5ZM8 8.8c-.6 0-1.2.2-1.6.6L8 11l1.6-1.6c-.4-.4-1-.6-1.6-.6Z" />
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12">
        <rect x=".5" y=".5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" />
        <rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor" />
        <path d="M24 4v4a2 2 0 0 0 0-4Z" fill="currentColor" opacity=".4" />
      </svg>
    </span>
  </div>
)

// iPhone 風の端末フレーム。スマホで開いたときは CSS でフレームを外して全画面にする
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <main className="stage">
      <div className="phone">
        <div className="dynamic-island" />
        <StatusBar />
        {children}
        <div className="home-indicator" />
      </div>
    </main>
  )
}
