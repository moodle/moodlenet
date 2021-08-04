import { isJust } from '../array'

export const getIscedGradePathByCode = (code: string): string[] | null => {
  const [E, D, top, mid, low] = Array.from(code)
  if (!(E && D && top)) {
    return null
  }
  return [top, mid, low].filter(isJust)
}
