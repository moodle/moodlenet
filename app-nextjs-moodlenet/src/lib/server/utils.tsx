import { getCtx } from './ctx'

export async function serverUtils() {
  const ctx = await getCtx()
  return {
    ctx,
    currUser: {
      isGuest,
    },
  }
  function isGuest() {
    return ctx.session.currentUser.t === 'guest'
  }
}
