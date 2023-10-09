import type { ChoosenContentErrors, DraftResourceDocument } from '../../documents.mjs'
import type { ChoosenContent, Progress } from './types.mjs'

export type CreateResourceActivityState =
  | ChooseContentState
  | UploadingContentState
  | AiAutofillResourceMetadataState

export type CreateResourceUserIntents =
  | ChooseContentIntent
  | CancelUploadIntent
  | CancelAutofillIntent

export interface ChooseContentIntent {
  type: 'Choose content'
  choosenContent: File | string
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
  acceptableContentRules: {
    file: { maxSizeBytes: number }
    link: { ruleDescription: string }
  }
  choosenContentErrors: ChoosenContentErrors
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
