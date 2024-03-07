import { addMiddlewares } from '@moodlenet/http-server/server'
import type { EntityUser } from '@moodlenet/system-entities/server'
import { setCurrentUserFetch } from '@moodlenet/system-entities/server'
import {
  Profile,
  getWebUserByProfileKey,
  setCurrentUnverifiedJwtToken,
  signWebUserJwtToken,
} from '@moodlenet/web-user/server'
import assert from 'assert'
import { shell } from '../shell.mjs'

const OPENID_HEADER = 'Authorization'
const HEADER_PREFIX = 'Bearer '
const HEADER_PREFIX_REGEXP = new RegExp(`^${HEADER_PREFIX}`)
await shell.call(addMiddlewares)({
  handlers: [
    async (req, _resp, next) => {
      const { openIdProvider } = await import('./provider.mjs')
      const authHeader = req.header(OPENID_HEADER)
      if (!(authHeader && HEADER_PREFIX_REGEXP.test(authHeader))) {
        return next()
      }
      const jtiAuthHeader = authHeader.replace(HEADER_PREFIX_REGEXP, '')
      const AccessToken = await openIdProvider.AccessToken.find(jtiAuthHeader)
      if (AccessToken) {
        const profileKey = AccessToken.accountId
        const webUser = await getWebUserByProfileKey({ profileKey })
        assert(webUser, `Couldn't find web User for <webUserKey#${profileKey}>`)
        const jwtToken = await signWebUserJwtToken({
          webUserkey: webUser._key,
        })
        assert(jwtToken, `Couldn't sign token for <webUserKey#${profileKey}>`)
        await setCurrentUnverifiedJwtToken(jwtToken)
        await setCurrentUserFetch(async () => {
          const entityUser: EntityUser = {
            type: 'entity',
            entityIdentifier: {
              entityClass: Profile.entityClass,
              _key: profileKey,
            },
            restrictToScopes: [...AccessToken.scopes],
          }
          return entityUser
        })
      }

      next()
    },
  ],
})
