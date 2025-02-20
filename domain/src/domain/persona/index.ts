import { admin } from './admin.persona'
import { anonymous } from './anonymous.persona'
import { any__ } from './any.persona'
import { authenticated } from './authenticated.persona'
import { moderator } from './moderator.persona'
export * as admin from './admin.persona'
export * as anonymous from './anonymous.persona'
export * as any__ from './any.persona'
export * as authenticated from './authenticated.persona'
export * as moderator from './moderator.persona'

export type domainCore = moo.core<{
  admin: admin
  authenticated: authenticated
  anonymous: anonymous
  any: any__
  moderator: moderator
}>
