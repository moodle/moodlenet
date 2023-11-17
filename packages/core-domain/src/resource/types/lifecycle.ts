import type { EventOf, StateOf } from '../../common/xsm-typegen-extract/types'
import type { Typegen0 } from '../lifecycle.xsm.typegen'
import { Credits, ResourceDoc, ResourceMeta } from './document'
import { Issuer } from './issuer'

export type StateName = StateOf<Typegen0>

export interface GeneratedMeta {
  resourceEdits: ResourceEdits
}
export interface ResourceEdits {
  meta?: Partial<ResourceMeta>
  image?: ProvidedImage
}
export interface ProvidedFileImage {
  kind: 'file'
}
export interface ProvidedUrlImage {
  kind: 'url'
  url: string
  credits?: Credits
}
export type ProvidedImage =
  | ProvidedFileImage
  | ProvidedUrlImage
  | { kind: 'remove' }
  | { kind: 'no-change' }

// CONTEXT
export interface Context {
  issuer: Issuer
  doc: ResourceDoc
  contentRejectedReason: null | string | ResourceEditsValidationErrors
  noAccessReason: null | 'unauthorized' | 'not available' | 'provided content is not valid'
  generatedMeta: null | GeneratedMeta
  lastPublishingModerationRejectionReason: null | string
  resourceEditsValidationErrors: null | ResourceEditsValidationErrors
  publishMetaValidationErrors: null | PublishMetaValidationErrors
  // providedCreationContent?: ProvidedCreationContent
}
export interface PublishMetaValidationErrors {
  meta: ResourceMetaValidationErrors
}
export type ResourceMetaValidationErrors = {
  [metaKey in keyof ResourceMeta]?: string
}

export interface ResourceEditsValidationErrors {
  meta: null | ResourceMetaValidationErrors
  image: null | string
}

export type Actor_StoreResourceEdits_Data =
  | Actor_StoreResourceEdits_Success
  | Actor_StoreResourceEdits_ValidationError
export interface Actor_StoreResourceEdits_Success {
  success: true
  doc: ResourceDoc
}
export interface Actor_StoreResourceEdits_ValidationError {
  success: false
  validationErrors: ResourceEditsValidationErrors
}

export type Actor_StoreNewResource_Data =
  | Actor_StoreNewResource_Success
  | Actor_StoreNewResource_ValidationError
export interface Actor_StoreNewResource_Success {
  success: true
  doc: ResourceDoc
}
export interface Actor_StoreNewResource_ValidationError {
  success: false
  reason: string
}
export interface Actor_GenerateMeta_Data {
  generetedResourceEdits: GeneratedMeta
}

export type Actor_ModeratePublishingResource_Data =
  | Actor_ModeratePublishingResource_Passed
  | Actor_ModeratePublishingResource_NotPassed
export interface Actor_ModeratePublishingResource_Passed {
  passed: true
}
export interface Actor_ModeratePublishingResource_NotPassed {
  passed: false
  reason: string
}

export interface Actor_ScheduleDestroy_Data {}

// EVENTS
export type Event = EventOf<
  Typegen0,
  {
    'provide-content': Event_ProvideContent_Data
    'edit-meta': Event_EditMeta_Data
    'request-publish': Event_RequestPublish_Data
    'unpublish': Event_Unpublish_Data
    'reject-publish': Event_RejectPublish_Data
    'trash': Event_Trash_Data
    'request-meta-generation': Event_RequestMetaGeneration_Data
    'cancel-meta-generation': Event_CancelMetaAutogen_Data
    'restore': Event_Restore_Data
  }
>

export interface ProvidedCreationFileContent {
  kind: 'file'
}
export interface ProvidedCreationLinkContent {
  kind: 'link'
  url: string
}
export type ProvidedCreationContent = ProvidedCreationFileContent | ProvidedCreationLinkContent
export interface Event_Restore_Data {}
export interface Event_EditMeta_Data {
  edits: ResourceEdits
}
export interface Event_RequestPublish_Data {}

export interface Event_RejectPublish_Data {
  reason: string
}
export interface Event_Unpublish_Data {}
export interface Event_ProvideContent_Data {
  content: ProvidedCreationContent
  meta?: Partial<ResourceMeta>
  image?: ProvidedImage
}

export interface Event_Trash_Data {}
export interface Event_RequestMetaGeneration_Data {}
export interface Event_CancelMetaAutogen_Data {}
