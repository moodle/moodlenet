import { produce } from 'immer'
import { assign, createMachine } from 'xstate'
import { matchStateName } from '../common/xsm-typegen-extract/util'
import type { Typegen0 } from './lifecycle.xsm.typegen'
import type * as T from './types/lifecycle'
import { getValidationSchemas } from './validationSchema'
export const DEFAULT_CONTEXT: T.Context = {
  issuer: { type: 'unauthenticated' },
  doc: {
    id: Symbol('ID PLACEHOLDER FOR CREATION') as any,
    content: Symbol('CONTENT PLACEHOLDER FOR CREATION') as any,
    image: Symbol('IMAGE PLACEHOLDER FOR CREATION') as any,
    meta: {
      title: '',
      description: '',
      learningOutcomes: [],
      license: null,
      subject: null,
      language: null,
      level: null,
      originalPublicationInfo: null,
      type: null,
    },
  },
  providedContent: null,
  contentRejected: null,
  noAccess: null,
  generatedMeta: null,
  publishRejected: null,
  publishingErrors: null,
  resourceEdits: null,
}

export interface EdResourceMachineDeps {
  services: {
    StoreNewResource(context: T.Context): Promise<T.Actor_StoreNewResource_Data>
    StoreResourceEdits(context: T.Context): Promise<T.Actor_StoreResourceEdits_Data>
    MetaGenerator(context: T.Context): Promise<T.Actor_MetaGenerator_Data>
    ModeratePublishingResource(context: T.Context): Promise<T.Actor_ModeratePublishingResource_Data>
    ScheduleDestroy(context: T.Context): Promise<T.Actor_ScheduleDestroy_Data>
  }
  actions: {
    notify_creator(context: T.Context /*,event:T.Event_????_Data */): unknown
    destroy_all_data(context: T.Context): unknown
  }
  validationConfigs: T.ValidationConfigs
}

export function getEdResourceMachine(deps: EdResourceMachineDeps) {
  const schemas = getValidationSchemas(deps.validationConfigs)

  const EdResourceMachine = createMachine({
    /** @xstate-layout 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-QuiAOssITsOY1BYlEMqfF2y5wABE-TIS0OMgRKTpSjDTPoVUsMAXTQxa3Qkt02VsqRAHM0p9dZxN4FbVxZMP66NOlecCthbpWGVIoXQ7sVCIhoqsZlPj7z0JDmHfOfoY5xwTknFOZLUmMUKZSaaNErCKHRVvRu1E7CyFbrTUQWtlU60YbA3g8CR63w9W2WmlKExy1sdYEYQT0lV1EFiGYMhdBOCcEAA */
    id: 'EdResource',

    predictableActionArguments: true,
    initial: 'Checking-In-Content',
    context: DEFAULT_CONTEXT,

    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./lifecycle.xsm.typegen').Typegen0,

    schema: {
      events: {} as T.Event,
      services: {} as T.Actors,
    },

    states: {
      'No-Access': {
        type: 'final',
      },

      'Storing-New-Resource': {
        invoke: [
          {
            src: 'StoreNewResource',

            onDone: {
              target: 'Autogenerating-Meta',
              actions: ['assign_doc'],
            },
          },
        ],

        entry: 'validate_provided_content_and_assign_errors',
      },

      'Autogenerating-Meta': {
        on: {
          'cancel-meta-generation': {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },

        invoke: {
          src: 'MetaGenerator',

          onDone: {
            target: 'Meta-Suggestion-Available',
            actions: 'assign_suggested_meta',
          },
        },
      },

      'Unpublished': {
        on: {
          'request-publish': {
            target: 'Publishing-Moderation',
            cond: 'issuer is creator and issuer is publisher and meta valid for publishing',
          },
          'request-meta-generation': {
            target: 'Autogenerating-Meta',
            cond: 'issuer is creator',
          },

          'trash': {
            target: 'In-Trash',
            cond: 'issuer is creator',
          },

          'store-edits': {
            target: 'Storing-Edits',
            cond: 'issuer is creator and edits are valid',
          },

          'provide-resource-edits': {
            actions: ['assign_resource_edits_and_validations'],

            description: `Whatever data is ok.
    
    even empty. 
    
    Just check upper bound sizes`,

            cond: 'issuer is creator',
          },
        },
      },

      'Publishing-Moderation': {
        exit: 'notify_creator',

        invoke: {
          src: 'ModeratePublishingResource',
          onDone: [
            {
              target: 'Published',
              cond: 'moderation passed',
            },
            {
              target: 'Publish-Rejected',
              actions: 'assign_last_publishing_moderation_rejection_reason',
            },
          ],
        },
      },

      'In-Trash': {
        invoke: {
          src: 'ScheduleDestroy',
          onDone: 'Destroyed',
        },

        on: {
          restore: {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },
      },

      'Published': {
        on: {
          'reject-publish': {
            target: 'Publish-Rejected',
            cond: 'issuer is admin',
          },

          'unpublish': {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },

        description: `Must contain *all* meta data fields

image is optional`,
      },

      'Publish-Rejected': {
        on: {
          unpublish: {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },
      },

      'Destroyed': {
        entry: 'destroy_all_data',
        type: 'final',
      },

      'Storing-Edits': {
        invoke: {
          src: 'StoreResourceEdits',

          onDone: {
            target: 'Unpublished',
            actions: 'assign_doc',
          },
        },
      },

      'Meta-Suggestion-Available': {
        on: {
          'accept-meta-suggestions': {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },
      },

      'Checking-In-Content': {
        on: {
          'provide-new-resource': [
            {
              target: 'No-Access',
              cond: 'issuer is not an authenticated user',
              actions: 'assign_unauthorized',
            },
            {
              actions: 'assign_provided_content_validations',
              description: `file: check size limit

link: url string format`,
            },
          ],
          'store-new-resource': [
            {
              target: 'No-Access',
              cond: 'provided content+meta are not valid',
            },
            {
              target: 'Storing-New-Resource',
            },
          ],
        },
      },
    },

    always: {
      target: '.No-Access',
      actions: 'assign_unauthorized',
      description: `resource is not published and issuer is not creator or admin or system`,
      cond: 'issuer has no read permission',
      internal: false,
    },
  }).withConfig({
    // },
    // {
    guards: {
      'issuer is creator and issuer is publisher and meta valid for publishing'({
        issuer,
        publishingErrors,
      }) {
        return (
          issuer.type === 'user' &&
          issuer.feats.creator &&
          issuer.feats.publisher &&
          !publishingErrors
        )
      },
      'issuer is not an authenticated user'({ issuer }) {
        return issuer.type !== 'user'
      },
      'issuer is admin'({ issuer }) {
        return issuer.type === 'user' && issuer.feats.admin
      },
      'issuer is creator'({ issuer }) {
        return issuer.type === 'user' && issuer.feats.creator
      },
      'issuer has no read permission'({ issuer }, _, { state }) {
        return !(
          matchStateName<Typegen0>(state, 'Published') ||
          (issuer.type === 'user' && (issuer.feats.creator || issuer.feats.admin))
        )
      },
      'moderation passed'(_, { data }) {
        return data.notPassed === false
      },
      'provided content+meta are not valid'(context) {
        return !!context.contentRejected
      },
      'issuer is creator and edits are valid'({ resourceEdits, issuer }) {
        return issuer.type === 'user' && issuer.feats.creator && !resourceEdits?.errors
      },
    },
    actions: {
      assign_resource_edits_and_validations: assign((context, { edits }) => {
        const validatedResourceEdits = getContextResourceEdits(edits)
        // console.log('assign_resource_edits_and_validations', edits, validatedResourceEdits)
        return produce(context, proxy => {
          proxy.resourceEdits = validatedResourceEdits
        })
      }),
      assign_doc: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.doc = data.doc
        })
      }),
      assign_last_publishing_moderation_rejection_reason: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.publishRejected = data.notPassed ? data.notPassed : null
        })
      }),
      assign_suggested_meta: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.generatedMeta = data.generatedData
        })
      }),
      assign_unauthorized: assign(context => {
        return produce(context, proxy => {
          proxy.noAccess = { reason: 'unauthorized' }
        })
      }),
      assign_provided_content_validations: assign((context, { content, image, meta }) => {
        const overriddenInitialMeta = { ...context.doc.meta, ...meta }
        const contextResourceEdits = getContextResourceEdits({
          meta: overriddenInitialMeta,
          image,
        })
        const validatedContent = schemas.providedContent(content)
        // console.log({ validatedContent })
        const { contentRejected, providedContent } = validatedContent.valid
          ? { contentRejected: null, providedContent: validatedContent.providedContent }
          : { contentRejected: { reason: validatedContent.reason }, providedContent: null }

        return produce(context, proxy => {
          proxy.resourceEdits = contextResourceEdits
          proxy.contentRejected = contentRejected
          proxy.providedContent = providedContent
        })
      }),
      destroy_all_data(context) {
        deps.actions.destroy_all_data(context)
      },
      notify_creator(context) {
        deps.actions.notify_creator(context)
      },
      validate_provided_content_and_assign_errors() {
        //TODO: validate content !!!!!!!!!!
      },
    },
    services: {
      async MetaGenerator(context /* ,event */) {
        return deps.services.MetaGenerator(context)
      },
      async ModeratePublishingResource(context /* , event */) {
        return await deps.services.ModeratePublishingResource(context)
      },
      async ScheduleDestroy(context /* , event */) {
        return deps.services.ScheduleDestroy(context)
      },
      async StoreNewResource(context) {
        return deps.services.StoreNewResource(context)
      },
      async StoreResourceEdits(context) {
        return deps.services.StoreResourceEdits(context)
      },
    },
  })
  return EdResourceMachine
  function getContextResourceEdits(edits: T.ResourceEdits) {
    const resourceMetaResponse = edits.meta ? schemas.resourceMeta(edits.meta) : null

    const imageResponse =
      edits.image && (edits.image.kind === 'file' || edits.image.kind === 'url')
        ? schemas.providedImage(edits.image)
        : null // {valid : true} as const

    if (!(resourceMetaResponse || imageResponse)) {
      return null
    }
    const resourceMetaErrors: Partial<T.ResourceEditsValidationErrors> =
      !resourceMetaResponse || resourceMetaResponse.valid ? {} : resourceMetaResponse.errors
    const imageErrors: Partial<T.ResourceEditsValidationErrors> =
      !imageResponse || imageResponse.valid ? {} : imageResponse.errors

    const errors: T.ResourceEditsValidationErrors | null = {
      ...resourceMetaErrors,
      ...imageErrors,
    }

    const data: T.ResourceEdits = {
      image: imageResponse?.data,
      meta: resourceMetaResponse?.meta,
    }

    const contextResourceEdits: T.Context['resourceEdits'] = {
      data,
      errors,
    }
    return contextResourceEdits
  }
}
