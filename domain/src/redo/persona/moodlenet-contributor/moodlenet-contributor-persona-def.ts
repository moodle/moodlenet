/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { map } from '@moodle/lib-types'
import type * as moo from '../../moodle-domain'

declare module '../../moodle-domain' {
  interface Personas {
    moodleNetContributor: MoodleNetContributorPersona
  }
}

export type MoodleNetContributorPersona = moo.DefPersona<{ useCase: map; model: map }>
