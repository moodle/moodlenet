import type { ChoosenContentErrors, DraftResourceDocument } from '../../types/documents.mjs'
import type { ChoosenContent, Progress } from './types.mjs'
import type { AcceptableContentRules } from './worker.mjs'

export type CreateResourceActivityState =
  | ChooseContentState
  | UploadingContentState
  | AiAutofillResourceMetadataState

export type CreateResourceUserIntents =
  | ChooseContentIntent
  | CancelUploadIntent
  | CancelAutofillIntent

type Url = string
export interface ChooseContentIntent {
  type: 'Choose content'
  choosenContent: File | Url
}

export interface CancelUploadIntent {
  type: 'Cancel upload'
}

export interface CancelAutofillIntent {
  type: 'Cancel autofill'
}

export interface ChooseContentState {
  activity: 'Create resource'
  type: 'Choose content'
  choosenContent: null | ChoosenContent
  acceptableContentRules: AcceptableContentRules
  choosenContentErrors: null | ChoosenContentErrors
}

export interface UploadingContentState {
  activity: 'Create resource'
  type: 'Uploading content'
  progress: Progress
  choosenContent: ChoosenContent
}

export interface AiAutofillResourceMetadataState {
  activity: 'Create resource'
  type: 'Ai autofill resource metadata'
  progress: Progress
  draftResourceDocument: DraftResourceDocument
}
