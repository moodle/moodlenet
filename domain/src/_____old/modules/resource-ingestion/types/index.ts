import { d_u } from '@moodle/lib-types'
import { maybeAsset } from '../../storage'

// export type Configs = {}

export type eduResourceIngestionUndoable = { reason: string }

export type eduResourceIngestionSucceed = {
  title: null | string
  content: null | string
  image: null | maybeAsset
}

export type eduResourceIngestionOutcome = {
  ingestionImpl: string
  details?: unknown
} & d_u<
  {
    undoable: eduResourceIngestionUndoable
    succeed: eduResourceIngestionSucceed
  },
  'outcome'
>
