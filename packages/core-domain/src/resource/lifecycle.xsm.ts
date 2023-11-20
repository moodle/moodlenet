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
    // persist_context(context: T.Context): unknown
  }
  validationConfigs: T.ValidationConfigs
}

export function getEdResourceMachine(deps: EdResourceMachineDeps) {
  const schemas = getValidationSchemas(deps.validationConfigs)

  const EdResourceMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQDaADALqKgAOmsAlgC4OYB21IAHogLQBMATn4BWAHQB2fgA4RAFgDMEkfzL8ANCACefAIwA2MrskKR0ubom7+EuXP0BfB5tQZYOAmDEBlJplwMbFC8AHJgAO68bh6ERBDsXoEAbpgA1l6uWHiEPn4BQaERUVmeCMmY+ACGLOzkFHWcdIw1HEjcfKoKZGLSgmT6gvqq+voKspo6CLwiZOJCasr69iIKCqJOLuglOQCC2H4wbGC41YHBALJgTJVxCWLl6WKZ7tleewdgRycsBZfXZWwUlUWnUGm0msxWK1QDwpqobGIyEjdGQ1nJpLoRBIFBM9ApBD1LENBMoRJj9BJHM4QM8Ym99phDsdTr8rjcqmxCAAbXgAWzZvCZ3yhYNo9Eh7E4sN4RP0YjGujkEn6IkEZNRuLhinl5kEcnkXRW-FMGxpWxenjEAFU2DRsAAjLkMWAAC0gRFwYAAjtg4ExeHbHc6XaKQBCWlK9FiCYIFEsxkJVmrNfY5GJjfwLEj9Bj9fxTbTXtbbQ6na73Z6fX6+QKhadapRGuKI21pQZ0WIyV1TBY5INpJreAp9Tq+-rFLM1goC+a6cXA2W3RAiEwTq7Q+GoZGpijBNJESjDKMyHvpJnNaICRiRPpMcOT0SRDPokWbQvg+7YHkwLxIMxYBuzZbq2fASMqmpPtShaWm+pYfsuNC4JgSQMBAP6ehahC-hA-6Ac0wEwnoui9PKZgSH0-AoiI8gaNoehkGmax9LosYrIY0jSM+2xeAACnBrpnLw5yYGhwrsLcRz3ICaQZLORZ8UGAm-CJzItACQL1mwoKNuCQGSiBO59AoYi6IaFJWIo1gSJqSxppRhr4rolgYtOUFyZaCmLoJwmiZpEmJNJjzQTknnBt5KliWw6kVJpoK6FQun4fphE7hxxlSAxN6ZvI8hyJqyjGAYLHMQx-AUq5mwvpaACSbC8AAKmuLr+VJKRBe5OS1Q1TXRcCIqUHhErQu0UyyMZTlyKI5jmEMSwQaZYh2KMBirPqxEVWaVWdXVjWVK6Hp+v4YCDS2KW8BI0jGTM0gnsaazZvoF6qoSN5KPiSgqEsXGYbx-FLgdABWYD4P677rjpYpJcN0qiJmYjCCxOWmRdtGTEs-CSKZJ56hd+qCN9c6heWy7YCWikhhDYZ6dDHTGuIIyCHqMjKiSZXzRIi1gb0ioqPIxEE-Jf3FEDIPuqTYMUwlkNDduAiCCxhJkJSQz6keEHKvD6JKv2F1xgLlq+P4gmoP+LUPLJW1eIb+TBCbTCwL1sUDZTm7JSNMqqNZdFammdiyPoqq2H05gbcFXh-JUvDeNgUAwF+UK8DsSSVAwXKVI6xCIchqHodx2G4S71Oy6ogySErRWTbIxH5eIsgWGYIc3fwNj6zkADCbr4KkgldW37BMJ8TBEFnKFobwRyRBhdInQR7uiPYPSxpSxrYisOLezKXQEijdNkNIQyovmbmW2IHfA93BS9-3g-D0ho8-hPvBT68JDxU2UPFxmPS2DdvRmBOIhByYjKvDci5Uzwo04sfbip9O4X2CFfNgA8kFEC-EdceRRn6eBnm7GG1hujDmUJSUyxELpAMsGmXoJ4FAsX9pYUOHUvBny7j3OqfckE3zQZ6DBk9uKvyllTD+BkBCzGMNRJW9l-YrEHGqK8xEHyEKGKsJw1I2AqXgG0MO78ZbCKENiSQMgDTKHhEAnMBI6aM37IYIyrcvAhEwInfAhBYAaOlqdOeZ4MZ7kzHuYcZUTxe0mB7Pci1DBbyGGeYc+NoE-VyEbAoYRIiW20e4mGATQnESMsqZulJBxSHECSNYl0brKmurYsQ7xGSfFUt5NkKTZ5pJoT0GQwwsQrBuo9DeiZETy36NiWYOMGEn1guTSA9TcF4g1vLFi+IFi3U1KZcQKhg5jF7HuSClUYFExdOFXy7jXY0x3BYAkSwlbYmkLYOMeobL9HTFjVQRhTAbM2jArqu1XTjMObwWQ+4sTojAqYFiBhNRJnlEsMCSw9RKF6EMrZf0xmJR0WdZuMh4bWE6DlAYeVvZHkxjQ+ed1OjlO2cLYGA8ICfOLhxbovN1RWEeQOHFk1MZCD7GSeWN1ombNiQAET9EhLQCK3ENL4OYGlk1VjNwuaIGhNk4YqEcoqZQqITQxLnNbY2OF7aUuEfLDmYEf7l2VJZQcsNETUVWDmPemZnLlIjlHGOccWiJ2TqndOXIwA6uRZlUBIxSRYkVHGIB3Rem5VkNjYQZhynMPgbwRByCmBevdsVboxozxYwDWVTpQTrAkjuWoaiyqZC6BUQ4IAA */
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

        // entry: 'persist_context',
      },

      'Unpublished': {
        // entry: 'persist_context',
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
            cond: 'issuer is creator',
          },
        },

        description: `Whatever data is ok.
    
    even empty. 
    
    Just check upper bound sizes`,
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
            actions: 'assign_resource_edits_and_validations',
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
        console.log('assign_resource_edits_and_validations', context, edits, validatedResourceEdits)
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
          proxy.generatedData = data.generatedData
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
