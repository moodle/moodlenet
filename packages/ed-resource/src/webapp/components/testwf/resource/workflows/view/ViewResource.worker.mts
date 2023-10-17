import type { ViewResourceActivityState } from './ViewResource.ui-states-actions.mjs'
declare module './ViewResource.reducer.mjs' {
  export interface K {
    currentState: ViewResourceActivityState
  }
}
export interface ViewResourceWorker {
  switchToEdit(): void
}

// export type WorkerEvents = UploadDoneEvent

// export interface UploadDoneEvent {
//   type: 'Upload done'
//   draftResourceDocument: DraftResourceDocument
// }
