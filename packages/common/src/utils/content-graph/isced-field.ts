import { isJust } from '../array'

export const getIscedFieldPathByCode = (code: string): string[] | null => {
  const [F, top_a, top_b, mid, low] = Array.from(code)
  if (!(F && top_a && top_b)) {
    return null
  }
  const top = F + top_a + top_b
  return [top, mid, low].filter(isJust)
}
