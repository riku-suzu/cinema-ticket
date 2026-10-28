const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const BackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" {...base}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </svg>
)
export const CloseIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" {...base} strokeWidth={2.6}>
    <path d="M6 9l6 6 6-6" />
  </svg>
)
export const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...base} strokeWidth={2.4}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)
export const TicketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 5h16a1 1 0 0 1 1 1v3a3 3 0 0 0 0 6v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a3 3 0 0 0 0-6V6a1 1 0 0 1 1-1Zm5 4v2h6V9Zm0 4v2h6v-2Z" />
  </svg>
)
export const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="2" width="12" height="20" rx="3" />
  </svg>
)
export const Mastercard = () => (
  <svg width="26" height="16" viewBox="0 0 26 16" aria-label="Mastercard">
    <circle cx="9" cy="8" r="7" fill="#eb001b" />
    <circle cx="17" cy="8" r="7" fill="#f79e1b" />
    <path d="M13 2.3a7 7 0 0 1 0 11.4 7 7 0 0 1 0-11.4Z" fill="#ff5f00" />
  </svg>
)

// 座席アイコン（肘掛け付きの椅子を正面から）
export const SeatIcon = () => (
  <svg viewBox="0 0 20 18" width="100%" height="100%">
    <path d="M4 2.5A2.5 2.5 0 0 1 6.5 0h7A2.5 2.5 0 0 1 16 2.5V10H4Z" fill="currentColor" opacity=".55" />
    <path d="M0 6.5a2 2 0 0 1 4 0V11h12V6.5a2 2 0 0 1 4 0V16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2Z" fill="currentColor" />
  </svg>
)

export const StatusBar = () => (
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
