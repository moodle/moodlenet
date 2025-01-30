/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map } from '@moodle/lib-types'
import type * as moo from '../../moodle-domain'

declare module '../../moodle-domain' {
  interface Personas {
    anyUser: AnyUserPersona
  }
}

export type AnyUserPersona = moo.DefPersona<{ useCase: map; model: map }>
