import type { EditingState } from '../edit/editResourceWorkflow.mjs'
import type {
  AiAutofillResourceMetadataState,
  ChooseContentState,
  CreateResourceActivityState,
  CreateResourceUserIntents,
  UploadingContentState,
} from './ui-states.mjs'
import type { Worker, WorkerEvents } from './worker.mjs'

export type CreateResourceEvents = CreateResourceUserIntents | WorkerEvents
export function createResourceReducerActivityFactory(worker: Worker) {
  return function createResourceActivityReducer(
    state: CreateResourceActivityState,
    event: CreateResourceEvents,
  ): CreateResourceActivityState | EditingState {
    return state.type === 'Choose content'
      ? chooseContentStateReducer(state, event)
      : state.type === 'Uploading content'
      ? uploadingContentStateReducer(state, event)
      : state.type === 'Ai autofill resource metadata'
      ? aiAutofillResourceMetadataStateReducer(state, event)
      : state
  }

  function aiAutofillResourceMetadataStateReducer(
    state: AiAutofillResourceMetadataState,
    event: CreateResourceEvents,
  ): AiAutofillResourceMetadataState | EditingState {
    if (
      event.type !== 'Cancel autofill' &&
      event.type !== 'AI autofill progress' &&
      event.type !== 'Autofill done'
    ) {
      return state
    }
    if (event.type === 'Cancel autofill') {
      return {
        activity: 'Modify resource',
        type: 'Editing resource',
        formErrors: {},
        resourceDocument: state.draftResourceDocument,
        resourceEdit: clone(state.draftResourceDocument),
        snackbars: { publishCheckResult: false },
      }
    } else if (event.type === 'Autofill done') {
      return {
        activity: 'Modify resource',
        type: 'Editing resource',
        formErrors: {},
        resourceDocument: event.draftResourceDocument,
        resourceEdit: clone(event.draftResourceDocument),
        snackbars: { publishCheckResult: false },
      }
    } else {
      return {
        ...state,
        progress: event.progress,
      }
    }
  }

  function chooseContentStateReducer(
    state: ChooseContentState,
    event: CreateResourceEvents,
  ): UploadingContentState | ChooseContentState {
    if (event.type !== 'Choose content') {
      return state
    }
    const checkChoosenResourceResult = worker.checkChoosenResource(event.choosenContent)
    if (checkChoosenResourceResult.success) {
      return {
        activity: 'Create resource',
        type: 'Uploading content',
        choosenContent: checkChoosenResourceResult.choosenContent,
        progress: 0,
      }
    } else {
      return {
        ...state,
        choosenContentErrors: checkChoosenResourceResult.choosenContentErrors,
      }
    }
  }

  function uploadingContentStateReducer(
    state: UploadingContentState,
    event: CreateResourceEvents,
  ): AiAutofillResourceMetadataState | UploadingContentState {
    if (event.type !== 'Upload progress' && event.type !== 'Upload done') {
      return state
    }
    if (event.type === 'Upload done') {
      return {
        activity: 'Create resource',
        type: 'Ai autofill resource metadata',
        progress: 0,
        draftResourceDocument: event.draftResourceDocument,
      }
    } else {
      return {
        ...state,
        progress: event.progress,
      }
    }
  }
}

function clone<T>(t: T): T {
  return JSON.parse(JSON.stringify(t))
}
