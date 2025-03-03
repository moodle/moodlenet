import { personaCore } from '../persona'
import { admin } from '../persona/admin.persona/admin.persona.core'
import { anonymous } from '../persona/anonymous.persona/anonymous.persona.core'
import { any } from '../persona/any.persona/any.persona.core'
import { authenticated } from '../persona/authenticated.persona/authenticated.persona.core'
import { moderator } from '../persona/moderator.persona/moderator.persona.core'

export const core: personaCore = {
  admin,
  anonymous,
  any,
  authenticated,
  moderator,
}
