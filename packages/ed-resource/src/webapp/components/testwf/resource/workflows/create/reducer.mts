import type { EditingState } from '../edit/ui-states-intents.mjs'
import type {
  AiAutofillResourceMetadataState,
  ChooseContentState,
  CreateResourceActivityState,
  CreateResourceUserIntents,
  UploadingContentState,
} from './ui-states-intents.mjs'
import type { Worker, WorkerEvents } from './worker.mjs'

export type CreateResourceEvents = CreateResourceUserIntents | WorkerEvents
export function createResourceActivityReducerFactory(worker: Worker) {
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

  function chooseContentStateReducer(
    state: ChooseContentState,
    event: CreateResourceEvents,
  ): UploadingContentState | ChooseContentState {
    if (event.type !== 'Choose content') {
      return state
    }
    const checkChoosenResourceResult = worker.isChoosenContentValidCheck(event.choosenContent)
    if (checkChoosenResourceResult.isValid) {
      const uploadingContentState: UploadingContentState = {
        activity: 'Create resource',
        type: 'Uploading content',
        choosenContent: checkChoosenResourceResult.choosenContent,
        progress: 0,
      }
      return uploadingContentState
    } else {
      const chooseContentState: ChooseContentState = {
        ...state,
        choosenContentErrors: checkChoosenResourceResult.choosenContentErrors,
      }
      return chooseContentState
    }
  }

  function aiAutofillResourceMetadataStateReducer(
    state: AiAutofillResourceMetadataState,
    event: CreateResourceEvents,
  ): AiAutofillResourceMetadataState | EditingState {
    if (
      event.type !== 'Cancel autofill' &&
      event.type !== 'AI autofill progress' &&
      event.type !== 'Ai autofill done'
    ) {
      return state
    }
    if (event.type === 'Cancel autofill') {
      const editingState: EditingState = {
        activity: 'Modify resource',
        type: 'Editing resource',
        editingResourceErrors: {},
        resourceDocument: state.draftResourceDocument,
        editingResourceDocument: clone(state.draftResourceDocument),
        snackbars: { publishCheckResult: false },
        resourceEditDirty: false,
        isSavingEdits: false,
        imageFileMaxSizeBytes,
        uploadingImage: null,
      }
      return editingState
    } else if (event.type === 'Ai autofill done') {
      const editingState: EditingState = {
        activity: 'Modify resource',
        type: 'Editing resource',
        editingResourceErrors: {},
        resourceDocument: event.draftResourceDocument,
        editingResourceDocument: clone(event.draftResourceDocument),
        snackbars: { publishCheckResult: false },
        resourceEditDirty: false,
        isSavingEdits: false,
      }
      return editingState
    } else {
      const aiAutofillResourceMetadataState: AiAutofillResourceMetadataState = {
        ...state,
        progress: event.progress,
      }
      return aiAutofillResourceMetadataState
    }
  }

  function uploadingContentStateReducer(
    state: UploadingContentState,
    event: CreateResourceEvents,
  ): AiAutofillResourceMetadataState | UploadingContentState | ChooseContentState {
    if (
      event.type !== 'Upload progress' &&
      event.type !== 'Upload done' &&
      event.type !== 'Cancel upload'
    ) {
      return state
    }
    if (event.type === 'Upload done') {
      const aiAutofillResourceMetadataState: AiAutofillResourceMetadataState = {
        activity: 'Create resource',
        type: 'Ai autofill resource metadata',
        progress: 0,
        draftResourceDocument: event.draftResourceDocument,
      }
      return aiAutofillResourceMetadataState
    } else if (event.type === 'Cancel upload') {
      const chooseContentState: ChooseContentState = {
        activity: 'Create resource',
        type: 'Choose content',
        acceptableContentRules: worker.getAcceptableContentRules(),
        choosenContent: null,
        choosenContentErrors: null,
      }
      return chooseContentState
    } else {
      const uploadingContentState: UploadingContentState = {
        ...state,
        progress: event.progress,
      }
      return uploadingContentState
    }
  }
}

function clone<T>(t: T): T {
  return JSON.parse(JSON.stringify(t))
}
