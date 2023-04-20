export type Href = {
  ext: boolean
  url: string
}
export const href = (url: string, ext = false): Href => ({
  ext,
  url,
})
