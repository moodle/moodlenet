import type { admin } from './persona/admin/admin.persona'
import type { anonymous } from './persona/anonymous/anonymous.persona'
import type { any__ } from './persona/any/any.persona'
import type { authenticated } from './persona/authenticated/authenticated.persona'
import type { emailSignup } from './service/emailSignup/emailSignup.service'
import type { moodlenet } from './service/moodlenet/moodlenet.service'
import { crypto } from './service/crypto/crypto.service'
import type { userAccount } from './service/userAccount/userAccount.service'
import { mailer } from './service/mailer/mailer.service'
import { accessControl } from './service/accessControl/accessControl.service'

declare module 'moodle-domain' {
  interface Domain {
    version: '5.0'
    personas: Personas
    services: Services
  }

  interface Personas {
    admin: admin
    anonymous: anonymous
    any: any__
    authenticated: authenticated
  }

  interface Services {
    emailSignup: emailSignup
    userAccount: userAccount
    moodlenet: moodlenet
    crypto: crypto
    mailer: mailer
    accessControl: accessControl
  }

  // interface UserScopes {
  //   signupToTheSystem: unknown
  // }

  type Model = {
    [serviceName in keyof Services]: Services[serviceName]['model']
  }

  type personaScopes = {
    [personaType in keyof Personas]: Personas[personaType]['scope'] extends never
      ? never
      : keyof Personas[personaType]['scope']
  }

  type scopes = personaScopes[keyof personaScopes]
}
