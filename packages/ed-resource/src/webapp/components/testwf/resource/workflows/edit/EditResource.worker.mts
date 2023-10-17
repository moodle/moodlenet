import type { DraftResourceDocument } from '../../types/documents.mjs'
import type { Progress } from '../create/CreateResource.types.mjs'
import type { EditingResourceErrors } from './EditResource.ui-states-actions.mjs'

export interface EditResourceWorker {
  saveEdits(draftResourceDocument: DraftResourceDocument): void
  isDraftResourceDocumentValidForPublishing(
    draftResourceDocument: DraftResourceDocument,
  ): { isValid: true; resourceFormErrors: EditingResourceErrors } | { isValid: false }
}

export type EditResourceWorkerEvents = SaveEditsDoneEvent | UploadImageProgressEvent

export interface SaveEditsDoneEvent {
  type: 'Save edits done'
  draftResourceDocument: DraftResourceDocument
}
export interface UploadImageProgressEvent {
  type: 'Upload image progress'
  progress: Progress
}
