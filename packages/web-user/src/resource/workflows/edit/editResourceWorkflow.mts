import type { DraftResourceDocument, PublishableResourceDocument } from '../../documents.mjs'
// http://link.to/specdocuments (user story, digrams github issue discussions)

export interface ResourceFormErrors {
  title?: string
  description?: string
  subject?: string
  license?: string
  type?: string
  level?: string
  creationDate?: string
}

export type ModifyResourceActivityState = EditingState
export interface EditingState {
  activity: 'Modify resource'
  type: 'Editing resource'
  // events: {
  //   save(): EditingState | Saving
  //   publishCheck(): EditingStatei
  // }
  resourceDocument: DraftResourceDocument
  resourceEdit: DraftResourceDocument
  formErrors: ResourceFormErrors
  snackbars: {
    publishCheckResult: false | { type: 'success' } | { type: 'failed' }
  }
}

interface Saving {
  // events: {
  //   saved(): EditingState
  // }
  resourceDocument: PublishableResourceDocument
  resourceEdit: DraftResourceDocument
}
