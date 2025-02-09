/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import '@moodle/lib-types'

declare global {
  namespace moo {
    type service<serviceDef extends ServiceDef> = serviceDef
    // namespace service {
    // }
  }
}

type ServiceDef = { model: moo.model }
