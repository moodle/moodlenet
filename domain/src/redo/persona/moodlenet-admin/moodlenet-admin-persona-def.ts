/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { moodlenetInfo } from '../../model/moodlenet/types'
import type * as moo from '../../moodle-domain'

declare module '../../moodle-domain' {
  interface Personas {
    moodlenetAdmin: MoodlenetAdminPersona
  }
}

export type MoodlenetAdminPersona = moo.DefPersona<{
  useCase: {
    moodleNetManagement: MoodleNetManagement
  }
  model: MoodleNetAdminModel
}>

export type MoodleNetManagement = moo.DefUseCase<{
  editMoodlenetInfo: [{ moodlenetInfo: moodlenetInfo }, void]
}>

export type MoodleNetAdminModel = moo.DefModel<{
  moodlenetInfo: moo.StaticData<'w', moodlenetInfo>
}>
