/* eslint-disable @typescript-eslint/no-namespace */
// import type { admin } from './persona/admin.persona/admin.persona'
import type { anonymous } from './persona/anonymous.persona/anonymous.persona'
import type { any__ } from './persona/any.persona/any.persona'
// import type { authenticated } from './persona/authenticated.persona/authenticated.persona'
import type { accessControl } from '../moodle-domain/service/accessControl.service/accessControl.service'
import type { signedTokens } from './service/signedTokens.service/signedTokens.service'
import type { crypto } from './service/crypto.service/crypto.service'
import type { mailer } from '../moodle-domain/service/mailer.service/mailer.service'
import type { moodlenet } from '../moodle-domain/service/moodlenet.service/moodlenet.service'
import type { userAccount } from '../moodle-domain/service/userAccount.service/userAccount.service'

declare global {
  namespace moo {
    interface Personas {
      // admin: admin
      anonymous: anonymous
      any: any__
      // authenticated: authenticated
    }

    interface Services {
      crypto: crypto
      userAccount: userAccount
      moodlenet: moodlenet
      signedTokens: signedTokens
      mailer: mailer
      accessControl: accessControl
    }
  }
}
