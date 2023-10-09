import type { ChoosenContentErrors, DraftResourceDocument } from '../../documents.mjs'
import type { ChoosenContent, Progress } from './types.mjs'

export interface Worker {
  uploadContent(resourceContent: File | string): void
  cancelUpload(): void
  cancelAiAutofill(): void
  checkChoosenResource(
    content: File | string,
  ):
    | { success: true; choosenContent: ChoosenContent }
    | { success: false; choosenContentErrors: ChoosenContentErrors }
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
  type: 'Autofill done'
  draftResourceDocument: DraftResourceDocument
}
