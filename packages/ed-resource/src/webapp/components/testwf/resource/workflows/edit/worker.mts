import type { DraftResourceDocument } from '../../types/documents.mjs'
import type { Progress } from './types.mjs'
import type { EditingResourceErrors } from './ui-states-intents.mjs'

export interface Worker {
  saveEdits(draftResourceDocument: DraftResourceDocument): void
  isDraftResourceDocumentValidForPublishing(
    draftResourceDocument: DraftResourceDocument,
  ): { isValid: true; resourceFormErrors: EditingResourceErrors } | { isValid: false }
}

export type AcceptableContentRules = {
  file: {
    maxSizeBytes: number
  }
  link: {
    ruleDescription: string
  }
}

export type WorkerEvents = SaveEditsDoneEvent | UploadImageProgressEvent

export interface SaveEditsDoneEvent {
  type: 'Save edits done'
  draftResourceDocument: DraftResourceDocument
}
export interface UploadImageProgressEvent {
  type: 'Upload image progress'
  progress: Progress
}
