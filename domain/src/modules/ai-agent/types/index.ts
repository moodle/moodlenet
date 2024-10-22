import { _nullish, d_u, date_time_string } from '@moodle/lib-types'
import { eduResourceData } from '../../edu/types/edu-content'
import { asset } from '../../storage'

export type aiAgentResourceSuggestionStatus = {
  suggestions: generationStatus<eduResourceData>
}

type requestedGenerationStatus = {
  at: date_time_string
} & d_u<
  {
    enqueued: unknown
    ongoing: {
      startedAt: date_time_string
    }
  },
  'request'
>

type generationStatus<dataType> = d_u<
  {
    aborted: unknown
    requested: requestedGenerationStatus
    result: {
      image: _nullish | asset
      data: dataType
    }
  },
  'status'
>
