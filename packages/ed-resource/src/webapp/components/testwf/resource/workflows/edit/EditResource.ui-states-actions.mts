import type { TextOptionProps } from '@moodlenet/component-library'
import type { DraftResourceDocument } from '../../types/documents.mjs'
import type { Progress } from '../create/CreateResource.types.mjs'
// http://link.to/specdocuments (user story, digrams github issue discussions)

export type EditResourceActivityState = EditingState

export interface EditResourceErrors {
  title?: string
  description?: string
  subject?: string
  license?: string
  type?: string
  level?: string
  creationDate?: string
}
export type EditResourceUserActions = SaveEditsAction | EditResourceAction | PublishCheckAction

export interface EditResourceAccess {
  canEdit: boolean
}
export interface SaveEditsAction {
  type: 'Save edits'
}
export interface EditResourceAction {
  type: 'Edit resource'
  draftResourceDocument: DraftResourceDocument
}
export interface PublishCheckAction {
  type: 'Publish check'
}
export interface UploadImageAction {
  type: 'Upload Image'
  imageFile: File
}

export interface EditingState {
  activity: 'Edit resource'
  type: 'Editing resource'
  access: EditResourceAccess
  imageFileMaxSizeBytes: number
  resourceDocument: DraftResourceDocument
  editingResourceDocument: DraftResourceDocument
  resourceEditDirty: boolean
  editResourceErrors: EditResourceErrors
  snackbars: {
    publishCheckResult?: false | { type: 'success' } | { type: 'failed' }
    imageUploaded?: boolean
  }
  options: {
    languages: TextOptionProps[]
    subjects: TextOptionProps[]
  }
  isSavingEdits: boolean
  uploadingImage: null | {
    progress: Progress
    imageFile: File
    imageFileLocalUrl: string
  }
}
