import { OauthResult } from '../../src/oauth-server/types'

declare global {
  namespace Express {
    interface User {
      oauth: OauthResult
    }
  }
}
