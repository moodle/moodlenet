export type SubjectFieldPath = [top: string, mid: string, low: string]

export const getSubjectFieldPathByCode = (code: string): SubjectFieldPath | null => {
  const [F, top_a, top_b, mid, low] = Array.from(code)
  if (!(F && top_a && top_b && mid && low)) {
    return null
  }
  const top = F + top_a + top_b
  return [top, mid, low]
}
