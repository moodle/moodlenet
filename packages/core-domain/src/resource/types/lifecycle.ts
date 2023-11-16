import type { EventOf, StateOf } from '../../common/xsm-typegen-extract/types'
import type { Typegen0 } from '../lifecycle.xsm.typegen'
import {
  Credits,
  Language,
  LearningOutcome,
  Level,
  License,
  OriginalPublicationInfo,
  Refs,
  ResourceMeta,
  Subject,
  Type,
} from './document'
import { Issuer } from './issuer'

export type StateName = StateOf<Typegen0>

export interface GeneratedMeta {
  metaEdits: MetaEdits
}
export interface MetaEdits {
  title?: string
  description?: string
  license?: License
  subject?: Subject
  language?: Language
  level?: Level
  originalPublicationInfo?: OriginalPublicationInfo
  type?: Type
  learningOutcomes?: LearningOutcome[]
  image?: ProvidedImage | 'remove' | 'no-change'
}
export interface ProvidedFileImage {
  kind: 'file'
}
export interface ProvidedUrlImage {
  kind: 'url'
  url: string
  credits?: Credits
}
export type ProvidedImage = ProvidedFileImage | ProvidedUrlImage

// CONTEXT
export interface Context {
  issuer: Issuer
  meta: ResourceMeta
  contentRejectedReason?: string | MetaEditsValidationErrors
  noAccessReason?: 'unauthorized' | 'not available' | 'provided content is not valid'
  generatedMeta?: GeneratedMeta
  lastPublishingModerationRejectionReason?: string
  metaEditsValidationErrors?: MetaEditsValidationErrors
  publishMetaValidationErrors?: PublishMetaValidationErrors
  // providedCreationContent?: ProvidedCreationContent
}
export interface PublishMetaValidationErrors {
  fields: { [metaKey in keyof ResourceMeta]?: string }
}
export interface MetaEditsValidationErrors {
  fields: { [metaKey in keyof MetaEdits]?: string }
}

export type Actor_StoreMetaEdits_Data =
  | Actor_StoreMetaEdits_Success
  | Actor_StoreMetaEdits_ValidationError
export interface Actor_StoreMetaEdits_Success {
  success: true
  meta: Omit<ResourceMeta, 'references'>
  image: Refs['image']
}
export interface Actor_StoreMetaEdits_ValidationError {
  success: false
  validationErrors: MetaEditsValidationErrors
  reason?: 'not found' | 'not valid'
}

export type Actor_StoreNewResource_Data =
  | Actor_StoreNewResource_Success
  | Actor_StoreNewResource_ValidationError
export interface Actor_StoreNewResource_Success {
  success: true
  refs: Refs
}
export interface Actor_StoreNewResource_ValidationError {
  success: false
  reason: string
}
export interface Actor_GenerateMeta_Data {
  generetedMetaEdits: GeneratedMeta
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
  metaEdits: MetaEdits
}
export interface Event_RequestPublish_Data {}

export interface Event_RejectPublish_Data {
  reason: string
}
export interface Event_Unpublish_Data {}
export interface Event_ProvideContent_Data {
  content: ProvidedCreationContent
  initialMeta?: MetaEdits
}

export interface Event_Trash_Data {}
export interface Event_RequestMetaGeneration_Data {}
export interface Event_CancelMetaAutogen_Data {}
