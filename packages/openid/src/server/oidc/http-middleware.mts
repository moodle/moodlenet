import { addMiddleware } from '@moodlenet/http-server/server'
import { shell } from '../shell.mjs'
import { openIdProvider } from './provider.mjs'

const OPENID_HEADER = 'Authorization'
const HEADER_PREFIX = 'Bearer '
const HEADER_PREFIX_REGEXP = new RegExp(`^${HEADER_PREFIX}`)
await shell.call(addMiddleware)({
  handlers: [
    async (req, _resp, next) => {
      const authHeader = req.header(OPENID_HEADER)
      if (!(authHeader && HEADER_PREFIX_REGEXP.test(authHeader))) {
        return next()
      }
      const jtiAuthHeader = authHeader.replace(HEADER_PREFIX_REGEXP, '')
      const authCodePayload = await openIdProvider.AuthorizationCode.find(jtiAuthHeader)
      console.log({ authCodePayload })
      next()
    },
  ],
})

const AuthorizationCode = await openIdProvider.AuthorizationCode.find(
  `Sn93sVdCaEGRn4tnYM7bTXgbxE41USrBgmGPt0Mp5He`,
)
const AccessToken = await openIdProvider.AccessToken.find(
  `Sn93sVdCaEGRn4tnYM7bTXgbxE41USrBgmGPt0Mp5He`,
)
const Grant = await openIdProvider.Grant.find(`Sn93sVdCaEGRn4tnYM7bTXgbxE41USrBgmGPt0Mp5He`)
console.log({ Grant, AuthorizationCode, AccessToken })
