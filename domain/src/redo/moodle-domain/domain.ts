/* eslint-disable @typescript-eslint/no-namespace */
// import type { admin } from './persona/admin.persona/admin.persona'
import type { anonymous } from './persona/anonymous.persona/anonymous.persona'
import type { any__ } from './persona/any.persona/any.persona'
// import type { authenticated } from './persona/authenticated.persona/authenticated.persona'
import type { accessControl } from '../moodle-domain/service/accessControl.service/accessControl.service'
import type { crypto } from '../moodle-domain/service/crypto.service/crypto.service'
import type { emailSignup } from '../moodle-domain/service/emailSignup.service/emailSignup.service'
import type { mailer } from '../moodle-domain/service/mailer.service/mailer.service'
import type { moodlenet } from '../moodle-domain/service/moodlenet.service/moodlenet.service'
import type { userAccount } from '../moodle-domain/service/userAccount.service/userAccount.service'

declare global {
  namespace moo {
    interface Domain {
      version: '5.0'
    }

    interface Personas {
      // admin: admin
      anonymous: anonymous
      any: any__
      // authenticated: authenticated
    }

    interface Services {
      emailSignup: emailSignup
      userAccount: userAccount
      moodlenet: moodlenet
      crypto: crypto
      mailer: mailer
      accessControl: accessControl
    }
  }
}
