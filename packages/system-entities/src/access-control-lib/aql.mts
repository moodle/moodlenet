// export async function isOwner() {
//   const clientSession = await getCurrentClientSession()
//   const sessionUserKey = clientSession?.user?._key
//   return sessionUserKey ? `(entity._meta.owner == "${sessionUserKey}")` : 'false'
// }
export async function isOwner() {
  return `(!!clientSession && entity._meta.owner == clientSession.user._key)`
}
export async function isAuthenticated() {
  return `(!!clientSession)`
}
