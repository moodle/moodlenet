import { date_time_string } from '@moodle/lib-types'
import { aiAgentResourceSuggestionStatus } from '../../ai-agent'
import { assetTextExtractionStatus } from '../../asset-text-extraction'
import { eduResourceCollectionData, eduResourceData } from '../../edu/types/edu-content'

export type myDrafts = {
  eduResources: draft<
    eduResourceData,
    {
      assetTextExtractionStatus: assetTextExtractionStatus
      aiAgentSuggestion: aiAgentResourceSuggestionStatus
    }
  >[]
  eduResourceCollections: draft<eduResourceCollectionData>[]
}

export type draft_id = eduResourceDraftId | eduResourceCollectionDraftId
type draft<dataType extends eduResourceData | eduResourceCollectionData, meta = undefined> = {
  id: draft_id
  data: dataType
  meta: meta
  created: date_time_string
  lastUpdateDate: date_time_string
  // updates: { date: date_time_string; diff: jsonDiff }[]
}

export type eduResourceDraftId = string
export type eduResourceCollectionDraftId = string
