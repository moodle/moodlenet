import { d_u } from '@moodle/lib-types'
import { eduResourceMeta } from '../../edu/types/edu-content'
import { maybeAsset } from '../../storage'

export type eduResourceAiGenerationSucceed = { eduResourceData: { meta: eduResourceMeta; image: maybeAsset } }
export type eduResourceAiGenerationUndoable = { reason: string }
export type eduResourceAiGenerationOutcome = {
  aiImpl: string
  details?: unknown
} & d_u<
  {
    undoable: eduResourceAiGenerationUndoable
    succeed: eduResourceAiGenerationSucceed
  },
  'outcome'
>
