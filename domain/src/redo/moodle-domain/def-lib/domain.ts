import type { admin } from '../persona/admin/admin'
import type { anonymous } from '../persona/anonymous/anonymous'
import type { any__ } from '../persona/any/any'
import type { authenticated } from '../persona/authenticated/authenticated'
import type { emailSignup } from '../system/emailSignup/emailSignup'
import type { moodlenet } from '../system/moodlenet/moodlenet'
import type { userAccount } from '../system/userAccount/userAccount'

declare module 'moodle-domain' {
  interface Domain {
    version: '5.0'
    personas: Personas
    systems: Systems
  }

  interface Personas {
    admin: admin
    anonymous: anonymous
    any: any__
    authenticated: authenticated
  }

  interface Systems {
    emailSignup: emailSignup
    userAccount: userAccount
    moodlenet: moodlenet
  }
}
