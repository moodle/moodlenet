import * as ulidx from 'ulidx'

const globalMono = ulidx.monotonicFactory()

export function generate({ onDate }: { onDate: Date | number | string }) {
  const date = new Date(onDate)
  return globalMono(date.valueOf())
}
