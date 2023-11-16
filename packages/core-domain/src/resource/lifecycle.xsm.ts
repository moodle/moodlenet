import { produce } from 'immer'
import { assign, createMachine } from 'xstate'
import { matchStateName } from '../common/xsm-typegen-extract/util'
import type { Typegen0 } from './lifecycle.xsm.typegen'
import type { Refs } from './types/document'
import type * as T from './types/lifecycle'
// const REFS_PLACEHOLDERS_FOR_CREATION: Refs = {
//   content: { kind: 'link', url: 'CONTENT URL::RefsPlaceholdersForCreation' },
//   id: 'ID::RefsPlaceholdersForCreation',
//   image: null,
// }
const REFS_PLACEHOLDERS_FOR_CREATION = null as any as Refs
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
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQDaADALqKgAOmsAlgC4OYB21IAHogLQBMAVgCMAFgB0AZkEBOAGwB2GfxmiF-ABwKANCACeffmUkTZgjcLn81w+aIC+93agywcBMOIDKTTLgZsULwAcmAA7rwAwuxMYGxMRBDsngEAbpgA1p4uWHiE3r7+gSHhUTFxTAhpmPgAhizs5BRNnHSMDRxI3Hy2-HLiGjIywoKicmTmgpK6Bgi8wguC4oL8whPG1gqi-PyOzui5HgV+AUGhEdHxFYnJ4tVZ4jlueZ4+J8XnZVfxVWzpdR0miRhFQum1mKxOqAeHMxDINOIJiMxhpRKIVooZj1NDJEYIJvwFBZJBpJKo9iAnu58gBBbC+GBsMC4eqnXgAWTATFqNyZdz+mWyB2eRzpDLizNZxU53N+-1ZjUoLTB9Ah7E4MPm436ZGG6gUClGmjIcixcxWEkklkEIitMkkfRkFKpL3EYswjMlLGlXJ5dTYhAANrwALa+3ielmAyitVUdDU9DRJ8Q4pQkkRGab6PgmBFjMhGfFE4RCZ3C6meACqbBo2AARoGGLAABaQIi4MAAR2wcCYvFrDabzeVtDjkITsJWCmWahkFsGVskWdmvCXy3xZLk6MkCiXZAcTkp5dd1YHjZbbY73d7ofDkYVbBHIHB8a6mrhuKRohkCmMIlEZAaGaAgrFIgEFmMchaAoJa7IeLpHKe9bnq2EBEJAzC3tyT4vuOb49GQYgDBBBa7ooYj8MBwhaOICzCFsUH4jau5wfsrgVuISGDheaFMCyLY4WO6r4XM8KSMs9FyNaVh2JR2awmSAyDKMkgTPIIxluxroAArIUObLspgEBepCvIpAKDwIfkuncc2BlGSZ7ByjUD5AjGKrtHh0KJiaEmEWQZAKHIP5qKa8nGuIoiqZoAFBVJAVyJphzWXpLb2cZUamUkfL3EKWlHDZKHpY5bDOQCkJAiCsaecJ3mwho1iRasFiiLYwg7oSZp7lISjUf+VhqAebHJZ4ACSbC8AAKvxzZmfy6SWceRzjVNM1la5SruaONVQt0sK-oic7+aS9oTEB8lamBBbKFaowaCsghJSK+QrdNtQtu2vZ+GAgk7ROvDotO8gnQW1E7DBOgXYsKaEoaJZbuic6JfBS0pbZl5gAAVmA+B9meQ6-Wqu2akIcjiUoP6kvuaZTGahIIqdDr7nIUwBUNR75WjKFttgNapcOW3PkJxOGPwDo9e1AUWFBwx00Y4jBfiGhbqoKy9E9HGFUOvAYNjuM83ztmE6+dUCKS-RyJbVtCD+ltmmIwjiEjS5TJIwVEmiGuum8RRBDKPLZeZC15SNxy+xyvrrdGzSC7htV7fMakDMWwwWKMYzAds-BSNatq2A6wVe0cPsGb6c25Y8qOvIUpeytU5WKs0VUeUT-1rOMyz3SRqJKDswEmP0gyA+1UkWEFRf5P7vBeNgUAwLAHS8DSqS1Awga1A2xAYX2YbYbHwtt5oSxaAF8j2lJUyQyuRKD0uA2ATdFgT54kStvgGRsitlyxPERA0LgmBUgMGMrwfA5R4jGy8gnWwvliR9EIpfFmogqJxURNRXcxJZB6kcIeNgDl4BdCsmAaqrcRJm1RArK2lsbZxWAqsHYh1BBEhEMMcwO5n7iGCJgJe+BCCwAIdtUhptrALAViPGCiNU5USQVIQkrD0yohWBwkuHxSjfwqCQk20DBhkHEEFOcGhAKs06lDUQDVKE2h-MoXcO5JAcPdPeb0ftfSaKge+CwuJUwOmlszc6K50RLEsBTPov4lBTA4VxbmEBXHx3fNIfo6J9wJTUH0MxKDHZkjJHOTcWxjAKA4VrNK0oHKZXjnHEWCltgplJKpBqMhAJBTplJJ2c4dhMN-NYeQj0UaczGhNN6LYYkVPmPCZOGwSyBVydRKimgnYBTUvUseLsCn80gEM-6qxLZ6MGJoBGIU5KzHpk7VSTMxis33Cs2yOssY41iNEluWiSaGIZg6OGUshh+MQEYXRQU1iLmomIB07MiHiAACK9gAXoNZDy3GJiWLIGK8gmZKCJHTNcf4diBUUFBYwyNhrPWru8Zx3J1lkKsEsLF2xBCKyYWLTO349HRTdm7E0d8OFTxnnPXskIl4rzXhvQMxCYWxJ6LIacJpzb3SNK7YCN8Bh32sA-MWT8emh1fjjD+xQv7gKYKS021FAqRR0SWXMmgxBUS0LiRWKI0S7ntN0xwQA */
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
          'provide-content': {
            target: 'Storing-New-Content',
            cond: 'issuer has creation permission',
          },
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
