import type { EventOf, StateOf } from '../../common/xsm-typegen-extract/types'
import type { Typegen0 } from '../lifecycle.xsm.typegen'
import type { Credits, ResourceDoc, ResourceMeta } from './document'
import type { Issuer } from './issuer'

export type StateName = StateOf<Typegen0>

export interface ValidationConfigs {
  meta: {
    title: { length: { max: number; min: number } }
    description: { length: { max: number; min: number } }
    learningOutcomes: {
      sentence: { length: { max: number; min: number } }
      amount: { max: number; min: number }
    }
  }
  image: { sizeBytes: { max: number } }
  content: { sizeBytes: { max: number } }
}

export interface ProvidedGeneratedData {
  meta: null | Partial<ResourceMeta>
  // image: null | { url: string }
}
export interface ResourceEdits {
  meta?: ResourceMeta
  image?: ImageEdit
}
export interface ProvidedFileImage {
  kind: 'file'
  size: number
}
export interface ProvidedUrlImage {
  kind: 'url'
  url: string
  credits: null | Credits
}
export type ProvidedImage = ProvidedFileImage | ProvidedUrlImage

export type ImageEdit = ProvidedImage | { kind: 'remove' } | { kind: 'no-change' }

// CONTEXT
export interface Context extends PersistentContext {
  noAccess: null | ReasonString<'unauthorized' | 'not available'>
  contentRejected: null | ReasonString
  issuer: Issuer
  resourceEdits: null | {
    data: ResourceEdits
    errors: ResourceEditsValidationErrors | null
  }
  providedContent: null | ProvidedCreationContent
  metaGeneratorEnabled: boolean
  publishingErrors?: ResourceMetaValidationErrors
  publishRejected?: ReasonString
}

interface GeneratedData {
  // image: null | { url: string }
  meta: null | Partial<ResourceDoc['meta']>
}

export interface PersistentContext {
  doc: ResourceDoc
  generatedData: null | GeneratedData
  state: StateName
}

interface ReasonString<Reason extends string = string> {
  reason: Reason
}

export type ResourceMetaValidationErrors = {
  [metaKey in keyof ResourceMeta]?: string
}

export type ResourceEditsValidationErrors = ResourceMetaValidationErrors & {
  image?: string
}

export type Actors = {
  StoreNewResource: {
    data: Actor_StoreNewResource_Data
  }
  StoreResourceEdits: {
    data: Actor_StoreResourceEdits_Data
  }
  // MetaGenerator: {
  //   data: Actor_MetaGenerator_Data
  // }
  // ModeratePublishingResource: {
  //   data: Actor_ModeratePublishingResource_Data
  // }
  ScheduleDestroy: {
    data: Actor_ScheduleDestroy_Data
  }
}

export interface Actor_StoreResourceEdits_Data {
  doc: ResourceDoc
}

export interface Actor_StoreNewResource_Data {
  doc: ResourceDoc
}

// export interface Actor_MetaGenerator_Data {
//   generatedData: ProvidedGeneratedData
// }

// export interface Actor_ModeratePublishingResource_Data {
//   notPassed:
//     | false
//     | {
//         reason: string
//       }
// }

export type Actor_ScheduleDestroy_Data = NonNullable<unknown>

// EVENTS
export type Event = EventOf<
  Typegen0,
  {
    'store-new-resource': Event_StoreNewResource_Data
    'provide-new-resource': Event_ProvideNewResource_Data
    'store-edits': Event_StoreEdits_Data
    'provide-resource-edits': Event_ProvideResourceEdits_Data
    'unpublish': Event_Unpublish_Data
    'publish': Event_Publish_Data
    'reject-publish': Event_RejectPublish_Data
    'trash': Event_Trash_Data
    'request-meta-generation': Event_RequestMetaGeneration_Data
    'cancel-meta-generation': Event_CancelMetaAutogen_Data
    'generated-meta-suggestions': Event_GeneratedMetaSuggestions_Data
  }
>
export interface Event_GeneratedMetaSuggestions_Data {
  generatedData: ProvidedGeneratedData
}

export type Event_StoreEdits_Data = NonNullable<unknown>
export type Event_StoreNewResource_Data = NonNullable<unknown>
// type interface Event_AcceptMetaSuggestions_Data = NonNullable<unknown>
export interface ProvidedCreationFileContent {
  kind: 'file'
  size: number
}
export interface ProvidedCreationLinkContent {
  kind: 'link'
  url: string
}
export type ProvidedCreationContent = ProvidedCreationFileContent | ProvidedCreationLinkContent
export type Event_Restore_Data = NonNullable<unknown>
export interface Event_ProvideResourceEdits_Data {
  edits: ResourceEdits
}
// type interface Event_RequestPublish_Data = NonNullable<unknown>

export interface Event_RejectPublish_Data {
  reason: string
}
export type Event_Unpublish_Data = NonNullable<unknown>
export type Event_Publish_Data = NonNullable<unknown>
export interface Event_ProvideNewResource_Data {
  content: ProvidedCreationContent
  meta?: Partial<ResourceMeta>
  image?: ProvidedImage
}

export type Event_Trash_Data = NonNullable<unknown>
export type Event_RequestMetaGeneration_Data = NonNullable<unknown>
export type Event_CancelMetaAutogen_Data = NonNullable<unknown>
