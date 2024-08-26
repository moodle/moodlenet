import { SessionContext } from '../../../../lib/server/session/types/context'
import { currentUser } from './currentUser'
import { modules } from './layouts/modules'
import { pages } from './layouts/pages'
import { roots } from './layouts/roots'
import { permission } from './permission'
import { deploymentInfo as deployment, websiteInfo as info } from './websiteInfo'

export default async function getServerContext() {
  const sessionCtx: SessionContext = {
    website: {
      info,
      deployment,
      layouts: {
        pages,
        roots,
      },
      modules,
    },
    permission,
    currentUser,
  }
  return sessionCtx
}
