export const cleanMetaUrlTags = () => {
  document?.querySelector("[property='og:title']")?.remove()
  document?.querySelector("[property='og:description']")?.remove()
  document?.querySelector("[property='og:image']")?.remove()
  document?.querySelector("[name='twitter:card']")?.remove()
  document?.querySelector("[property='twitter:image']")?.remove()
}
