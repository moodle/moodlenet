/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import type { map } from '@moodle/lib-types'

declare global {
  namespace moo {
    type service<serviceDef extends ServiceDef = ServiceDef> = serviceDef
    // namespace service {
    // }
  }
}

type ServiceDef = { model: moo.model; tokens: map | never }
