export const never = (more = '') => {
  throw new Error(`never ${more}`)
}
