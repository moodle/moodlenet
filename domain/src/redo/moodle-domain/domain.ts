/* eslint-disable @typescript-eslint/no-namespace */
import type { admin } from './persona/admin.persona/admin.persona'
import type { anonymous } from './persona/anonymous.persona/anonymous.persona'
import type { any__ } from './persona/any.persona/any.persona'
import type { authenticated } from './persona/authenticated.persona/authenticated.persona'
import type { accessControl } from '../moodle-domain/model/accessControl.model/accessControl.model'
import type { twtTokens } from './model/jwtTokens.model/jwtTokens.model'
import type { crypto } from './model/crypto.model/crypto.model'
import type { mailer } from '../moodle-domain/model/mailer.model/mailer.model'
import type { moodlenet } from '../moodle-domain/model/moodlenet.model/moodlenet.model'
import type { userAccount } from '../moodle-domain/model/userAccount.model/userAccount.model'

declare global {
  namespace moo {
    interface Personas {
      admin: admin
      anonymous: anonymous
      any: any__
      authenticated: authenticated
    }

    interface Models {
      crypto: crypto
      userAccount: userAccount
      moodlenet: moodlenet
      jwtTokens: twtTokens
      mailer: mailer
      accessControl: accessControl
    }
  }
}
