/* eslint-disable @typescript-eslint/no-invalid-void-type */
import * as moo from 'moodle-domain'

export type getMine = moo.DefUseCaseEp<[void, { personaAccess: moo.PersonaAccess }]>
