import { produce } from 'immer'
import { assign, createMachine } from 'xstate'
import { matchStateName } from '../../common/exports'
import type { Typegen0 } from './lifecycle.xsm.typegen'
import type { Refs } from './types/document'
import type * as T from './types/lifecycle'
const REFS_PLACEHOLDERS_FOR_CREATION: Refs = {
  content: { kind: 'link' },
  id: 'ID::RefsPlaceholdersForCreation',
  image: null,
}
export const DEFAULT_CONTEXT: T.Context = {
  issuer: { type: 'unauthenticated' },
  meta: {
    description: '',
    title: '',
    learningOutcomes: [],
    references: REFS_PLACEHOLDERS_FOR_CREATION,
  },
}

export const EdResourceMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQDaADALqKgAOmsAlgC4OYB21IAHogLQBMAFgCcAZgB0AdgCsADlGzJ-UQDYVogIySANCACefDcI2zx04XI0qhkoysEBfB7tQZYOAmHEBlJplwMbFC8AHJgAO68AMLsTGBsTEQQ7F6BAG6YANZerlh4hD5+AUGhEdGx8UwI6Zj4AIYs7OQUzZx0jI0cSNyGwvwq4rLCxtKCKmRy0qK6Bgi8GgvSZvwaE2SiNoL8-E4u6Hmehf6BwWGRMQmVSSniNdniue75Xr7HJWfllwnVbBn1nc0SBoqN12sxWF1QDw5hoxpIzLIyMJxpJ1tJJNYZoZpCtlqtpOtNttdiBHh4CgBBbB+GBsMC4BonXgAWTATDq1zpt1+WRy+yehypNPi9MZJVZ7J+f0ZTUorVB9HB7E40PmOKWSK0-EkMi2iJUWJhZAW4jI4ysKmRsiEshUJLJz3EQswtNFLHFbI59TYhAANrwALae3h1aku+Ly2iKzoqwy2jQI1GiTTjQTSaQG-R8OTCcQLQRGbaw9WSe388leACqbBo2AARr6GLAABaQIi4MAAR2wcCYvFrDabzcjIDBMe6qo0OPho0kFhtYg0ycNvGTZgJomRadEkmTZEczlJ5cd1YHjZbbY73d7geDroZAMobWjENjMLTCYmsOESeksLIsgrtsAyiABZBCGoii2MSh4Oocp71uerYQEQkDMLe7IjmOr4ToYxqCIM4GCOBu4qLYWwriY8ILFoYyyAS6a7jssHHvBNaIUObZMAyLZYS+yq4XMwjyGYWgqFYGb8Fu-CUZugxDKMoHmOJ0hlm4FbiAAChxLZMsymAQG6EKcqkPL3HBBTaYOunigZRnsFKtQymwgJPgqHQ4VCcZmqJxpkGQGI-oIGKGvwiLiIIoFhcRGLif5dosepjpWUhel2Q+xnJFydx8klhwpUOaWGRlDk1P8EKAsCz4eQJXkwtaBFbCYsJGEuSg6FmCB7uIO7GPRsLWMFB57HlBQAJJsLwAAqPHNiZ3IZOZrHjZNM11C2jnlbKLRuVGNWQj074SEiBKrPIYgTIBnVLgR8hpvRwwDSoshqQcK3TbN7a9v4YB8ftb68Gm8JWpu4EmNstgdbM8xTuIEMyBo-SCGmFgJSNb1eAVF4oR2ABWYD4H2Z5Dn9SoHaq-AZhIc4-vI+5zqIUyhZIpgXRs+4qFM-nDUeo2YzpyFENg7HWcOu2jvx5N8NsGw9bYoEAVYQwaKF-BkOIloEraIhpisfSvQKlkC7wGD44TbbC8TvHi9htWHQI8gDGozvWOYsWGi14io8mUyqLTyMGxprzFMEEocllpmLblGNHCHLKeptzmuSCe1kwDqxaIMLOtbIU7I+YK44qYKbpkuRgbJageOsHemevNOUPMtLxFLXkplUncpVe5aeCfMxqmJMREAcFfQyZ1gM4oMwhA0u4m5xiVeHGHvDeNgUAwLAnS8BSaR1Awvp1A2xBoX2QaYTbksA2oEiKP5yJiCpO4rrTZi7rnljGpMi8FFErb4JkTIJqfDiAkIgNBcCYDSAwQyvB8AVASKTccdV5hDAGLnCun8dyc0EJRJQ6t+5vyXOYYwpZEox1-gTABJQgEXBAYkcBkDoFgFgfApgQIU4S3+r3NWwxBhLn6JgjEoxKLnVEooBQRDHqkMPGwOy8BugWTANVHuyCwqyAIi7NQlMfxqCAvFU0FhbSU22Bmae38vAhEwNvfAhBYDyNTkg+2etTDiVUORYhJhcFbB6tqEYCg5C63MbHJkHxaGVGUY4yc8hTBbCmEML8YUn7jzLvCFmGxkZMVAhoIJzp7xilDp6CJnl7YmB3HDSQxFNQTGEABK60Mfy5mTKoLWiTLRo15jHBCotIBFLtpORmAw0z7nisFJGdTDC2B6mIYYUxkQVPWKQ9Ght+aiyKvZA6tspYwlEN4xJoFrQ1MUJmWY-QEwzJMTqIiyJVJkOWeIIBa0Wy9K2fMYSWdCSIwCvMzxySwpe38tUw5WgfZBKxshZ5AMVhqCkEMMK9gRAVLHiclmXtQLszGFzfcoLjamwJnECAELuGIlZhsBG-khjCVCv5KQcVNCaFzpFIQQSAAivYIF6B6d3SJhgdlmD6Oo5E7M5ws1CgoU0jNtgBTIs9dY7TFHBI9OyQlyDrCfgxLEzW6JlArkZgmXc4FVCqDNMmOVTdxDL1XuvXsEJt6733ofX0SiuXFNVNPDU6C5DQQzDg8eL90QSI-lOeiQSKH-0AZNMJCRlUlMRPCQQ8TEY7OtAykRc4NYWDohkzcjMnBOCAA */
    id: 'EdResource',

    predictableActionArguments: true,
    initial: 'Checking-In-Content',
    context: DEFAULT_CONTEXT,

    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./lifecycle.xsm.typegen').Typegen0,

    schema: {
      events: {} as T.Event,
      services: {} as {
        StoreNewResource: { data: T.Actor_StoreNewResource_Data }
        StoreMetaEdits: { data: T.Actor_StoreMetaEdits_Data }
        MetaGenerator: { data: T.Actor_GenerateMeta_Data }
        ModeratePublishingResource: { data: T.Actor_ModeratePublishingResource_Data }
        ScheduleDestroy: { data: T.Actor_ScheduleDestroy_Data }
      },
    },

    states: {
      'No-Access': {
        type: 'final',
      },

      'Storing-New-Content': {
        invoke: [
          {
            src: 'StoreNewResource',

            onDone: [
              {
                target: 'Autogenerating-Meta',
                actions: ['assign_identifiers'],
                cond: 'store new resource success',
              },
              {
                target: 'Checking-In-Content',
                actions: 'assign_provided_content_rejection_reason',
              },
            ],
          },
        ],
      },

      'Autogenerating-Meta': {
        on: {
          'cancel-meta-autogen': {
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
            cond: 'issuer is creator and issuer has publishing permission and meta is formally vallid for publishing',
            description: `Must contain *all* meta data fiedls (image is optional)`,
          },

          'request-meta-generation': {
            target: 'Autogenerating-Meta',
            cond: 'issuer is creator',
          },

          'edit-meta': {
            target: 'Storing-Meta',
            cond: 'issuer is creator',
            internal: true,
          },

          'trash': {
            target: 'In-Trash',
            cond: 'issuer is creator',
          },
        },

        description: `<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>`,
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
            cond: 'issuer has moderation permission',
          },

          'unpublish': {
            target: 'Unpublished',
            cond: 'issuer is creator',
          },
        },
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

      'Storing-Meta': {
        invoke: {
          src: 'StoreMetaEdits',

          onDone: [
            {
              target: 'Unpublished',
              cond: 'store meta edits success',
              actions: 'assign_updated_meta_and_image_ref',
            },
            {
              target: 'Unpublished',
              actions: ['assign_edit_meta_errors'],
            },
          ],
        },

        description: `Whatever, even empty. Just check upper bound sizes`,
        entry: 'validate_edit_meta_and_assign_errors',
      },

      'Meta-Suggestion-Available': {
        on: {
          'edit-meta': {
            target: 'Storing-Meta',
            cond: 'issuer is creator',
          },
        },
      },

      'Checking-In-Content': {
        on: {
          'provide-content': [
            {
              target: 'Storing-New-Content',
              cond: 'issuer has creation permission',
            },
            {
              target: 'No-Access',
              actions: 'assign_unauthorized',
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
  },
  {
    guards: {
      'issuer is creator and issuer has publishing permission and meta is formally vallid for publishing'({
        issuer,
        publishMetaValidationErrors,
      }) {
        return (
          issuer.type === 'user' &&
          issuer.feats.creator &&
          issuer.feats.publisher &&
          !publishMetaValidationErrors
        )
      },
      'issuer has creation permission'({ issuer }) {
        return issuer.type === 'user'
      },
      'issuer has moderation permission'({ issuer }) {
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
        return data.passed
      },
      'store meta edits success'(_, { data }) {
        return data.success
      },
      'store new resource success'({}, { data }) {
        return data.success
      },
      // 'provided meta edits not formally valid'({ metaEditsValidationErrors }) {
      //   return !!metaEditsValidationErrors
      // },
    },
    actions: {
      assign_edit_meta_errors: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.metaEditsValidationErrors = data.success ? undefined : data.validationErrors
        })
      }),
      assign_identifiers: assign((context, { data }) => {
        return produce(context, proxy => {
          if (!data.success) return
          proxy.meta.references = data.refs
        })
      }),
      assign_last_publishing_moderation_rejection_reason: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.lastPublishingModerationRejectionReason = data.passed ? '' : data.reason
        })
      }),
      assign_suggested_meta: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.generatedMeta = data.generetedMetaEdits
        })
      }),
      assign_unauthorized: assign(context => {
        return produce(context, proxy => {
          proxy.noAccessReason = 'unauthorized'
        })
      }),
      assign_updated_meta_and_image_ref: assign((context, { data }) => {
        return produce(context, proxy => {
          if (!data.success) return
          proxy.meta = { ...proxy.meta, ...data.meta }
          proxy.meta.references.image = data.image
        })
      }),
      assign_provided_content_rejection_reason: assign((context, { data }) => {
        return produce(context, proxy => {
          proxy.contentRejectedReason = data.success ? undefined : data.reason
        })
      }),
    },
  },
)
