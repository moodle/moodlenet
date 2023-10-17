import type { DraftResourceDocument, PublishableResourceDocument } from '../../types/documents.mjs'

export type ViewResourceActivityState = ViewingState

export type ViewResourceUserActions = SwitchToEditAction

export interface ViewResourceAccess {
  canSwitchToEdit: boolean
}

export interface SwitchToEditAction {
  type: 'Switch to edit'
}

export interface ViewingState {
  activity: 'View resource'
  type: 'Viewing resource'
  access: ViewResourceAccess
  resourceDocument: DraftResourceDocument | PublishableResourceDocument
  snackbars: {
    publishSuccess?: boolean
    unpublishSuccess?: boolean
  }
}
