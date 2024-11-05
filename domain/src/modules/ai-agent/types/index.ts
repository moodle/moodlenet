import { d_u, date_time_string } from '@moodle/lib-types'
import { eduResourceData } from '../../edu/types/edu-content'

export type aiAgentResourceSuggestionStatus = {
  generationProcess: aiGenerationStatus<eduResourceData>
}

type aiGenerationStatus<dataType> = d_u<
  {
    neverStarted: unknown
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
}
type aiGenerationStarted = aiGenerationEnqueued & {
  startDate: date_time_string
}
type aiGenerationEnded = aiGenerationStarted & {
  endDate: date_time_string
}
