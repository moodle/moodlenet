import { anonymous } from './anonymous.userType/anonymous.userType'
import { any__ } from './any.userType/any.userType'
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace moo {
    interface UserTypes {
      any: any__
      anonymous: anonymous
    }
  }
}

export * from './gate.provider'
