import type { z } from 'zod'
import type { getMoodleNetPrimarySchemas } from '../lib/primary-schemas'
export interface MoodleNetPrimaryMsgSchemaConfigs {
  info: {
    title: { max: number; min: number }
    subtitle: { max: number; min: number }
  }
}
export type moodlenetInfoForm = z.infer<
  ReturnType<typeof getMoodleNetPrimarySchemas>['moodleNetInfoSchema']
>
