export function randomDate(a: Date, b: Date) {
  const [from, to] = [a.getTime(), b.getTime()].sort() as [number, number]
  return new Date(from + Math.random() * (to - from))
}
