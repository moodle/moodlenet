import { addMiddlewares } from '@moodlenet/http-server/server'
import type { EntityUser } from '@moodlenet/system-entities/server'
import {
  ANON_SYSTEM_USER,
  ROOT_SYSTEM_USER,
  setCurrentUserFetch,
} from '@moodlenet/system-entities/server'
import { WEB_USER_SESSION_TOKEN_COOKIE_NAME } from '../../common/exports.mjs'
import {
  sendWebUserTokenCookie,
  setCurrentUnverifiedJwtToken,
  verifyCurrentTokenCtx,
} from '../lib/web-user.mjs'
import { shell } from '../shell.mjs'
import { Profile } from './sys-entities.mjs'

await shell.call(addMiddlewares)({
  handlers: [
    async (req, _resp, next) => {
      const enteringToken = req.cookies[WEB_USER_SESSION_TOKEN_COOKIE_NAME]

      if ('string' !== typeof enteringToken) {
        return next()
      }

      await setCurrentUnverifiedJwtToken(enteringToken)
      await setCurrentUserFetch(async () => {
        const verifyResult = await verifyCurrentTokenCtx()
        if (!verifyResult) {
          //assert(verifyResult, `enteringToken cookie verification failed for fetching current user`)
          sendWebUserTokenCookie(undefined)
          return ANON_SYSTEM_USER
        }
        const { currentWebUser } = verifyResult
        if (currentWebUser.isRoot) {
          return ROOT_SYSTEM_USER
        }
        const entityUser: EntityUser = {
          type: 'entity',
          entityIdentifier: {
            entityClass: Profile.entityClass,
            _key: currentWebUser.profileKey,
          },
          restrictToScopes: false,
        }
        return entityUser
      })

      next()
    },
  ],
})
