// import type { admin } from './persona/admin.persona/admin.persona'
import { any_other_string } from '@moodle/lib-types'
import type { anonymous } from './persona/anonymous.persona/anonymous.persona'
import type { any__ } from './persona/any.persona/any.persona'
// import type { authenticated } from './persona/authenticated.persona/authenticated.persona'
import { accessControl } from './service/accessControl.service/accessControl.service'
import { crypto } from './service/crypto.service/crypto.service'
import type { emailSignup } from './service/emailSignup.service/emailSignup.service'
import { mailer } from './service/mailer.service/mailer.service'
import type { moodlenet } from './service/moodlenet.service/moodlenet.service'
import type { userAccount } from './service/userAccount.service/userAccount.service'

declare module 'moodle-domain' {
  interface Domain {
    version: '5.0'
    personas: Personas
    services: Services
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

  // interface UserScopes {
  //   signupToTheSystem: unknown
  // }

  type Model = {
    [serviceName in keyof Services]: Services[serviceName]['model']
  }

  type contexts = {
    [personaType in keyof Personas]: Exclude<keyof Personas[personaType], typeof _dir>
  } extends infer _
    ? _[keyof _] | any_other_string
    : never

  type scopes = {
    [personaType in keyof Personas]: {
      [ctx in Exclude<keyof Personas[personaType], typeof _dir>]: keyof Personas[personaType][ctx]
    } extends infer _
      ? Exclude<_[keyof _], typeof _dir>
      : never
  } extends infer _
    ? _[keyof _] | any_other_string
    : never
  // type scopes = {
  //   [personaType in keyof Personas]: {
  //     [ctx in Exclude<keyof Personas[personaType], typeof _dir>]: Exclude<keyof Personas[personaType][ctx], typeof _dir>
  //   }
  // } extends infer _
  //   ? _[keyof _] extends infer __
  //     ? __[keyof __] | any_other_string
  //     : never
  //   : never

  type services = any_other_string | keyof Services
}
