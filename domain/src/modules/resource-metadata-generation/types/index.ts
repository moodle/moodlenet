import { d_u, date_time_string } from '@moodle/lib-types'
import { eduResourceData } from '../../edu/types/edu-content'

export type aiEduResourceDataGenerationStatus = aiDataGenerationStatus<eduResourceData>

type aiDataGenerationStatus<dataType> = d_u<
  {
    enqueued: aiGenerationEnqueued
    ongoing: aiGenerationStarted
    aborted: aiGenerationEnded
    generated: aiGenerationEnded & { data: dataType }
    error: aiGenerationEnded & { message: string }
  },
  'status'
>
type aiGenerationEnqueued = {
  enqueueDate: date_time_string
  attempt: number
}
type aiGenerationStarted = aiGenerationEnqueued & {
  startDate: date_time_string
}
type aiGenerationEnded = aiGenerationStarted & {
  endDate: date_time_string
}
