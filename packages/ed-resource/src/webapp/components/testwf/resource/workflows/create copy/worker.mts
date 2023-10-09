import type { ChoosenContentErrors, DraftResourceDocument } from '../../types/documents.mjs'
import type { ChoosenContent, Progress } from './types.mjs'
import type { CreateResourceActivityState } from './ui-states-intents.mjs'
declare module './reducer.mjs' {
  export interface K {
    currentState: CreateResourceActivityState
  }
}
export interface Worker {
  uploadContent(resourceContent: File | string): void
  cancelUpload(): void
  cancelAiAutofill(): void
  isChoosenContentValidCheck(
    content: File | string,
  ):
    | { isValid: true; choosenContent: ChoosenContent }
    | { isValid: false; choosenContentErrors: ChoosenContentErrors }
  getAcceptableContentRules(): AcceptableContentRules
}

export type AcceptableContentRules = {
  file: {
    maxSizeBytes: number
  }
  link: {
    ruleDescription: string
  }
}

export type WorkerEvents =
  | UploadDoneEvent
  | UploadProgressEvent
  | AutofillDoneEvent
  | AiAutofillProgressEvent

export interface UploadDoneEvent {
  type: 'Upload done'
  draftResourceDocument: DraftResourceDocument
}
export interface UploadProgressEvent {
  type: 'Upload progress'
  progress: Progress
}
export interface AiAutofillProgressEvent {
  type: 'AI autofill progress'
  progress: Progress
}
export interface AutofillDoneEvent {
  type: 'Ai autofill done'
  draftResourceDocument: DraftResourceDocument
}
