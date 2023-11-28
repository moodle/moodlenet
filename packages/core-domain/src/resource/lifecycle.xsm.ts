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
  generatedData: null,
  publishRejected: null,
  publishingErrors: null,
  resourceEdits: null,
  state: 'Checking-In-Content',
  enableMetaGenerator: false,
}

export interface EdResourceMachineDeps {
  services: {
    StoreNewResource(context: T.Context): Promise<T.Actor_StoreNewResource_Data>
    StoreResourceEdits(context: T.Context): Promise<T.Actor_StoreResourceEdits_Data>
    // MetaGenerator(context: T.Context): Promise<T.Actor_MetaGenerator_Data>
    ModeratePublishingResource(context: T.Context): Promise<T.Actor_ModeratePublishingResource_Data>
    ScheduleDestroy(context: T.Context): Promise<T.Actor_ScheduleDestroy_Data>
  }
  actions: {
    notify_creator(context: T.Context /*,event:T.Event_????_Data */): unknown
    destroy_all_data(context: T.Context): unknown
    request_generate_meta_suggestions(context: T.Context): unknown
  }
  validationConfigs: T.ValidationConfigs
}

export function getEdResourceMachine(deps: EdResourceMachineDeps) {
  const schemas = getValidationSchemas(deps.validationConfigs)

  const EdResourceMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQDaADALqKgAOmsAlgC4OYB21IAHogLQDMARgAcZAHQB2AEzCArABZ+E2VLJSANCACefQQDYyeyf1nD5giYKkT58vQF97m1Blg4CYMQGUmmXAzYoXgA5MAB3Xld3QiIIdk8AgDdMAGtPFyw8Qm9ff0CQ8MjMjwQkzHwAQxZ2cgpazjpGao4kbj4pfnlhMQBOJX5+HtsVQc0dBF5ZCzEpKT0esmlhQUFZPSlHZ3Ri7J8-AKDQiKis4ji2BLZktLEMt1Oc-fyjovuSssrm2pJBKlbG5isFqgHgTfT8KRiUR6CT8PTyOaDCRjPhTCQzOY9axwiyKYSbEB3aKeACC2F8MAuuCqB14AFkwEwKkRKmxCAAbXgAW0ZFV4lLA1K+lAa9EB7E4oN4FmUYiE8h6EjMSsUsn4KImqiM+g6gz0ckVwnWBKJDzJFLAVJp+QZTKIAqFkG5vN4sGwUBgsGasHq-zFzUl7X4al6sPkaiVYb0Gul6zlenW60ESnWEkWJu2b2yAFU2DRsAAjdkMWAAC0gRFwYAAjtg4ExePmiyXS77aP6gYGwbIJD1enC8VI+oNZBq7PIZhDzGRDMt5CoMycPGJc03i2WK1Xa-XnUz+ZbBTSaiK-U1O60pSI42thMI5rIyHflDHZt1ZO+5gY5Ap9Iudp5V0LddywgIgmGpMs2xAAEAwvPgegWMRw1hMxzD0HtBB6DVPzEQR5ykfR1mEZQhnkP8swAvMgJbCsvT8MBeEgZgfRPdszwlOCJgkNMNVkcjiRXKjmw3UCaFwTBEgYCAGKrCjGIgZioJg88QV0PD0X0PCuiHfRH2EGNpmkdD0PnfRZB6d9+H4h4AAVqLLWk6UwaShSBWJ4jEMoblNZc7OE0tHOcw9mlKK5yiPNhvlY6COw41SwQWfhcODNZuLwoRrA1eEJwIlLBhWJVk2s3z7ICm0gtc9h3IuTywu8zMBL84DApciLQuST4gW+X5RXY4E2jBW8kukMh53WecJvkDVlEEXC9EwhZBFGuZYWK7IAEk2F4AAVCDS2qy5rnSBqHk2na9va8LhTqaLlLigbeGUWQxBnBR+DkDpFjkXipGesgH1MNV1lfKynEJE7lzO3aKjLSt63opTYv6qU0z7B89SmdDdQ0bREBwvCVEImQSNsNbPCamjQKrAArMB8AbNcW0Rvqu14X6pAnLFMIUKYlDvLKEUkZMyAQ+QVXMsmxApkSiGwITgOZ8VkfaDpnoTUXiZFozeOmMWlR6AnfvMfEwZ87JpdLIpafpis5cZyDbqR1mdL7ZZFgTDm1kMXi016LoxZ6fUlThSW9jyIJUGYg7aqO24Id2XJaUjphYEuzrjxuv42KV1mrEWF9bCQro1nMmwFjMUGtiXbJbT5Lx3U9ZpeBJRIKgYdkKiLYgxIkqSZP-eTFMdlnOLZ6xXZkMw1SsdZR1xhBfbkcxTAr0RZgkSWAGFy3wFJaTOzf2CYS0mCIHvJOk3gLgiWTiUV2D4rZ0RZuEPoJHWfo1XVefpXlSQ71Vo+dYZAIRbx3nvfIB8j4nzPuJC+DFr68FvqcH4WcYoj0fhzYiUIbCiFfqYRQ-0DLT1DIHFC1g7wmyrv+MQ286YQKCFAtgx9mFEDolWK+hRkEeHvipB6HRZSdGUO-ZMIglQGQsK7BYfRMJyHmqtU28dPB0N3vvLah9mEwPYQgrh-5UG9RzqPT6Rh3yLFynItUMZA4TmWKIA2QiP6gzBmwIK8BWhmzAAYh+D0IQyEkDIN6yhVA43GLGIYk5TAgLhCA42ktgiYGbvgQgsA3HZ28VKYM3Feh3gVMITocwtYGWDElOwICRZEQ6AqUOidniFGrp408hjMH3jEPMKYBtVCKixHPUJoh0TBmTNlaJPQzCS3NJgB01ogi1y8XwqUsxEIIkGDOPoBhVQvksP4uY1glQEQfIISWgF-KQFmfdS8ShxAG0wss6wIsQmIGTM9FQ5d3rmFyXxRR9SpalRasFPhd1lZgnMH2eEiwUI2DhEMLKhgZjC1UGQR5HzqEUTEFDPapzAWPQMEhBM-1YSJX1PchAgxIQrAJu9Pohg8WSwticxp6SVZ+I6aoEwY0oXzwMEYSwGUFDYxATS0qVs6bHwgBi52t5xAqHfEtSwCL3oC0hJYIcCp2kiBFpLAAIvWcSWg6VpLmXwd+kIp5zBWHYMwj4sodBxa-biWI0zmR6NUp4EcFIpzFaPA26JuK4MWBYUaQgXwqBepZOEeCOYWCoeDL5tdeD1w9PWIEzdW7t07uyBp+qzkqwGK0gGCKRnoQKgZcQahlhetUAaecG9Pk0JUQw3gTCWFMA9c0+ck47zCwwplH+cLYVqHfMoUtBzHD2CAA */
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

            onDone: [
              {
                target: 'Autogenerating-Meta',
                actions: ['assign_doc'],
                cond: 'meta generator enabled',
              },
              {
                target: 'Unpublished',
                actions: 'assign_doc',
              },
            ],
          },
        ],
      },

      'Autogenerating-Meta': {
        on: {
          'cancel-meta-generation': {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },

          'generated-meta-suggestions': {
            target: 'Meta-Suggestion-Available',
            actions: 'assign_suggested_meta',
            cond: 'issuer is system',
          },
        },

        entry: 'request_generate_meta_suggestions',
      },

      'Unpublished': {
        // entry: 'persist_context',
        entry: 'assign_validations',
        on: {
          'request-publish': {
            target: 'Publishing-Moderation',
            cond: 'issuer is creator and issuer is publisher and meta valid for publishing',
          },
          'request-meta-generation': {
            target: 'Autogenerating-Meta',
            cond: 'issuer is creator and meta generator enabled',
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
            actions: ['assign_resource_edits'],
            cond: 'issuer is creator',
          },
        },

        description: `for Edits: Whatever data is ok.
    
even empty. 
    
Just check upper bound size`,
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
              target: '#EdResource.Publish-Rejected',
              actions: 'assign_last_publishing_moderation_rejection_reason',
            },
          ],
        },

        // entry: 'persist_context',
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

        // entry: 'persist_context',
      },

      'Published': {
        on: {
          'reject-publish': {
            target: '#EdResource.Publish-Rejected',
            cond: 'issuer is admin',
          },

          'unpublish': {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },

        description: `Must contain *all* meta data fields

image is optional`,

        // entry: 'persist_context',
      },

      'Publish-Rejected': {
        on: {
          unpublish: {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },

        // entry: 'persist_context',
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
          'provide-resource-edits': {
            target: 'Unpublished',
            cond: 'issuer is creator',
            actions: 'assign_resource_edits',
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
      'issuer is creator and meta generator enabled'({ issuer, enableMetaGenerator }) {
        return issuer.type === 'user' && issuer.feats.creator && enableMetaGenerator
      },
      'issuer is system'({ issuer }) {
        return issuer.type === 'system'
      },
      'issuer is not an authenticated user'({ issuer }) {
        return issuer.type !== 'user'
      },
      'meta generator enabled'({ enableMetaGenerator }) {
        return enableMetaGenerator
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
          issuer.type === 'system' ||
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
      assign_validations: assign(context => {
        const publishingErrors = schemas.publishable(context.doc.meta).errors
        // console.log(
        //   // event.type,
        //   context.resourceEdits,
        //   // providedResourceEditsValidation_or_currentMetaValidations,
        //   publishingErrors,
        //   'assign_validations',
        // )

        return produce(context, proxy => {
          // proxy.resourceEdits = providedResourceEditsValidation_or_currentMetaValidations
          proxy.publishingErrors = publishingErrors
        })
      }),
      request_generate_meta_suggestions(context) {
        deps.actions.request_generate_meta_suggestions(context)
      },
      assign_resource_edits: assign((context, { edits }) => {
        const contextResourceEdits = getContextResourceEdits(edits)
        // console.log('assign_resource_edits', contextResourceEdits)
        return produce(context, proxy => {
          proxy.resourceEdits = contextResourceEdits
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
      assign_suggested_meta: assign((context, { generatedData }) => {
        return produce(context, proxy => {
          proxy.generatedData = generatedData
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
    },
    services: {
      // async MetaGenerator(context /* ,event */) {
      //   return deps.services.MetaGenerator(context)
      // },
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

    const imageResponse = !edits.image
      ? null
      : edits.image.kind === 'no-change' || edits.image.kind === 'remove'
      ? {
          valid: true,
          data: edits.image,
          errors: undefined,
        }
      : edits.image.kind === 'file' || edits.image.kind === 'url'
      ? schemas.providedImage(edits.image)
      : null // {valid : true} as const

    if (!(resourceMetaResponse || imageResponse)) {
      return null
    }
    const resourceMetaErrors: null | Partial<T.ResourceEditsValidationErrors> =
      !resourceMetaResponse || resourceMetaResponse.valid ? null : resourceMetaResponse.errors
    const imageErrors: null | Partial<T.ResourceEditsValidationErrors> =
      !imageResponse || imageResponse.valid ? null : imageResponse.errors

    const errors: T.ResourceEditsValidationErrors | null = !(resourceMetaErrors || imageErrors)
      ? null
      : {
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
