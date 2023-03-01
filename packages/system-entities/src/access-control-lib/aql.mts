import { getCurrentClientSession } from '@moodlenet/authentication-manager/init'

export async function isOwner() {
  const clientSession = await getCurrentClientSession()
  const sessionUserKey = clientSession?.user?._key
  return sessionUserKey ? `(entity._meta.owner == "${sessionUserKey}")` : 'false'
}
