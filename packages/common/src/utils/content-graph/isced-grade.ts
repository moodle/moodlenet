import { isJust } from '../array'

export const getIscedGradePathByCode = (code: string): string[] | null => {
  const [F, top, mid, low] = Array.from(code)
  if (!(F && top)) {
    return null
  }
  return [top, mid, low].filter(isJust)
}
