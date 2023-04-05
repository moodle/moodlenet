import { EntityDocument } from '@moodlenet/system-entities/server'

export type ResourceEntityDoc = EntityDocument<ResourceDataType>
export type ResourceDataType = {
  title: string
  description: string
}
