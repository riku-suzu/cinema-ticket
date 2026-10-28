// 映画・上映回・料金などのダミーデータ。実データに差し替えるときはこのファイルを触る。

export const movie = {
  title: 'Midnight Heist',
  year: 2025,
  genre: 'Animation',
  runtime: 96,
  rating: 7.7,
}

const showDate = 'Wed, Apr 12'
const showTime = '2:45 PM'

export const showtime = {
  date: showDate,
  time: showTime,
  label: `${showDate} at ${showTime}`,
  screen: 2,
}

export const card = { last4: '4558' }

export const TICKET_PRICE = 6.5
export const BOOKING_FEE = 2.49
export const MIN_GUESTS = 1
export const MAX_GUESTS = 6

export const orderTotal = (guests: number) => TICKET_PRICE * guests + BOOKING_FEE
