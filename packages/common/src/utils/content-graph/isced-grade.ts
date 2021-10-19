import { isJust } from '../array'

export const getIscedGradePathByCode = (code: string): string[] => {
  const [E, D, top, mid, low] = Array.from(code)
  if (!(E && D && top)) {
    return []
  }
  return [top, mid, low].filter(isJust)
}
