import { addMiddlewares } from '@moodlenet/http-server/server'
import { EntityUser, setCurrentUserFetch } from '@moodlenet/system-entities/server'
import { WebUserProfile } from '@moodlenet/web-user/init'
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
        await setCurrentUserFetch(async () => {
          const entityUser: EntityUser = {
            type: 'entity',
            entityIdentifier: {
              entityClass: WebUserProfile.entityClass,
              _key: AccessToken.accountId,
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
