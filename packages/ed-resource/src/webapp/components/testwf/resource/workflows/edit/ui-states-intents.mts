import type { DraftResourceDocument } from '../../types/documents.mjs'
import type { Progress } from '../create/types.mjs'
// http://link.to/specdocuments (user story, digrams github issue discussions)

export type ModifyResourceActivityState = EditingState

export interface EditingResourceErrors {
  title?: string
  description?: string
  subject?: string
  license?: string
  type?: string
  level?: string
  creationDate?: string
}
export type CreateResourceUserIntents =
  | SaveEditsIntent
  | EditResourceIntent
  | PublishCheckIntent
  | GoViewModeIntent

export interface SaveEditsIntent {
  type: 'Save edits'
}
export interface EditResourceIntent {
  type: 'Edit resource'
  draftResourceDocument: DraftResourceDocument
}
export interface PublishCheckIntent {
  type: 'Publish check'
}
export interface GoViewModeIntent {
  type: 'Go view mode'
}
export interface UploadImageIntent {
  type: 'Upload Image'
  imageFile: File
}

export interface EditingState {
  activity: 'Modify resource'
  type: 'Editing resource'
  imageFileMaxSizeBytes: number
  resourceDocument: DraftResourceDocument
  editingResourceDocument: DraftResourceDocument
  resourceEditDirty: boolean
  editingResourceErrors: EditingResourceErrors
  snackbars: {
    publishCheckResult?: false | { type: 'success' } | { type: 'failed' }
    imageUploaded?: boolean
  }
  isSavingEdits: boolean
  uploadingImage: null | {
    progress: Progress
    imageFile: File
    imageFileLocalUrl: string
  }
}
