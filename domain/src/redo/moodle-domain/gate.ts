import * as moo from 'moodle-domain'
import { Anonymous_Gate } from '../moodle-domain/persona/anonymous.persona/anonymous.persona'
import { Any_Gate } from '../moodle-domain/persona/any.persona/any.persona'

export const Gate: moo.Gate = {
  anonymous: Anonymous_Gate,
  any: Any_Gate,
}
