import { SessionContext } from '@/lib/server/session/types/context'
import { pages } from './layouts/pages'
import { roots } from './layouts/roots'
import { permission } from './permission'
import { user } from './user'
import { websiteInfo as info } from './websiteInfo'
import { modules } from './layouts/modules'

export default async function getServerContext() {
  const sessionCtx: SessionContext = {
    website: {
      info,
      layouts: {
        pages,
        roots,
      },
      modules,
    },
    permission,
    currentUser: user,
  }
  return sessionCtx
}
