import { produce } from 'immer'
import { assign, createMachine } from 'xstate'
import { matchStateName } from '../../common/exports'
import { DraftDocument, PublishableDocument, ResourceContent } from './exports'
import { Typegen0 } from './lifecycle.xsm.typegen'
import type * as T from './types/lifecycle.types'
export const EdResourceMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQBUA2gAwC6ioADprAJYAuTmAdrSAB6IC0AJgDMAVmEA6QQBZBAdgCMANlFKVChcIA0IAJ4CFcwQA4JxwUuHHjCioNVKAnAF9nO1Blg4CxcgppIIAzMbJzcfAhC0krSEtIUSnJyjgnqmjr6kcoUohIK4sbR+VbRru7oWHiEEgDCABZg+ADWTBxQ-ACSHPw1nCxgHCxEEJxgEq0AbphNYx6VPrUNza3tXT19AywIk5j4AIahHJRUx9zBrOxcgRH8hhYSVqI2VjYqctIZBsKKEo7JCiZBBRHKJVGUQHMvFUxvVGi02p1ur1BpsiGBcLhMLgJHQADYHABmWIAthJId5qrDlgi1sj+oNthwpvtDsdToFzodwgJHPFfrIUtIkkKxEpPllvgpfv9AcDQUpweToYs4StEesUYMiHt8IQ6Cx+PgNoN2fRGBcwtcDMYVBIVNJRY5rHJVNo9AYKOYJJ7RDInby1FZFRUoQsqfDVkjjUNcGAAFaNA1GzUsU1Bc1cq1ZaRe+RyYzCEHiRxAt2ZW4KYwUX42aI2zTKQzBzwUsYAEVwewJQ0grH4EE73f4xLALD2ac5l25WVBUuECj+VhkhUcjjLAiUmjyDk0ShySUKzfm1Q7XaGe2wLEwMA46IOYGHo-H1DOGanWYriSkjjUShsFCMUtxVuCgHTyeIS2EKCUjsUQj1DE9BxjMAAEdsDgA06GwAAjXEmFgOoJzfS1QBufIfykNQRXnNQKHXSJ5zkb0KDozQckrUCLHg1sJFPbsiBYTsCKIkJ31IgwFFkMwKGUQQQV-OjgNXb1RHiYQ7CKawRG45U6U2fgMATfB+ggYYMMxXQRItK5xMiWRYnUhdhGkUQNCeYxHGApdmOSKtBBMT0ZB0hYAAUcLwgi1QAWUwCA70ObVdTAfV+Cw3D8LqFYrMzWzbiMKUZPiWCnFEXkvOrSwnAsTcAOMfNjGC6owvSyKERiuLOwS2MjMw8KMqyl8OWImzeAEfypMUFIQWETc6pkcVfQeKteV3ZJnLERqxmaiKGlM2BR37JDsrE0asmsKVVxcmIf3sOQoOAkRTELERZCca692ETaJDWAAVIS6iIWMjQmdFjpI07+CcatjFEGTK1BGRpBLB6Em9aJxAdKshR-OQvt+-6zNgQTMEswazVE8GbicRwVLzcRvgR8VJJp31pEMXl0ZdAEvu2-qEUMxNICIfaDQHM8wZGm5BErJjNxdeQfxmpJ6KiSQ6ydb5II86QvoAQUva8Bni6KnyIfYOEIXFHzHfgLyvG8JenW5rFMQxC1YwoYhVwpBAkVTfW1lRVOSPWDZvY22tNu3DdvTrIGt58AnJ6ynelyw7VUaQs7+STQSUmQ8igoVzDd3lBFD+2jbjiB+Ci03e1FpCE8dj8ZCBCRklKhcCzkOwFGA8QCsSZyZNXVTQK+mpYwOFYiDoTEJiYOLDWjFvcsrIU7V3GarD3fzjGA7JTBzQoxDq2GF1cNwQA4WK4G4JUfFfCnJbG1zffiRJklSVz0ndM7lAPAsC8RcCMFTX0fpSJYEZ1R6UGM-FOH5DBqAeE6cw+YgR7l9IfVyFUciqFXIxUoECQw8T4iwBBOUIaaD5I5JQckHAfWAlnX2l1izLQSEKSe0YDLxkFhAShJ0bg-ilBoGGDp3hOjkGoQ+acgHOSeEkEshQ4IkJbMqXmrV2jtWNuDSclMvjCF9upIwwcrqbhVkCUwoI1IaVmuYT6ajjxbT6gRSAgiDFZGSKwoUpVLALlKh8f+FYpQiBYk8XOtg7oKDxt0P6ewCIeNfpEKGvwvbSJmkjJGghgIxDSZ6b4iREgAlELjJxCEXEtUyvzPhxl3FDRfqnRsUhtZ2EVl-FWtglDfisM5NQ9goJ2ArjHCO2inxJKdhxAq-lKySWsH0sUwS0F5HkErH8TgNDgPKOohY+tK6x3vDXOuY4Jmt3UtYoU9gs42kgqIYCBZukyFKVYRwhgNDl3KWQ8yJN6nJyoTcKCTEcgM1XBrQsP5xTSzVmuUCvJzBOniKo7ZziJC6ySrAWA-A2wDCYL89MjTW7yAKmXb+ahf6dKFFKWGJV2K93yFsiEpDdLTzYG0U569e5MQBCWCxNo7AmEPpyv2q5zCqGKk4K+zggA */
    id: 'EdResource',

    predictableActionArguments: true,
    preserveActionOrder: true,
    version: '1',

    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./lifecycle.xsm.typegen').Typegen0,

    schema: {
      context: {} as T.Context,
      events: {} as T.Event,
      services: {} as {
        CreateNewResource: {
          data: { resourceKey: string; content: ResourceContent }
        }
      },
    },

    on: {
      '*': [
        {
          cond: 'on creating issuer is not authenticated',
          target: 'Access-Denied',
          actions: assign(c => {
            return produce(c, proxy => {
              proxy.readAccessDeniedReason = 'unauthorized'
            })
          }),
        },
        {
          cond: 'resource is not published and issuer is neither creator, admin or system',
          target: 'Access-Denied',
          actions: assign(c => {
            return produce(c, proxy => {
              proxy.readAccessDeniedReason = 'unauthorized'
            })
          }),
        },
      ],
    },

    states: {
      'Checking-In-Content': {
        exit: 'notify_creator',
        on: {
          'accept-content': {
            target: 'Autogenerating-Meta',
            cond: 'issuer is system',
          },

          'reject-content': {
            target: 'Content-Rejected',
            cond: 'issuer is system',
          },
        },

        invoke: {
          src: 'CreateNewResource',
          onDone: [
            {
              actions: ['assign-identifiers-and-content'],
              internal: false,
            },
          ],
          onError: [
            {
              actions: ['assign-rejected-content-reason'],
              target: 'Content-Rejected',
              internal: false,
            },
          ],
        },
      },

      'Draft': {
        on: {
          'edit-draft-meta': {
            target: 'Draft',
            cond: { type: 'issuer is creator and draft-form is formally valid' },
            internal: false,
            actions: ['assign-draft'],
          },

          'autogenerate-meta': {
            target: 'Autogenerating-Meta',
            cond: 'issuer is creator',
          },

          'request-publish': {
            target: 'Publishing-Moderation',
            cond: 'issuer is creator+publisher and draft-form is formally valid for publishing',
          },

          'trash': {
            target: 'In-Trash',
            cond: 'issuer is creator or admin',
          },
        },
      },

      'Content-Rejected': {
        on: {
          destroy: {
            target: 'Destroyed',
            cond: 'issuer is creator or admin or system',
          },
        },

        entry: 'schedule_destroy',
      },

      'Publishing-Moderation': {
        on: {
          'accept-publishing': {
            target: 'Published',
            cond: 'issuer is admin or system',
          },
          'reject-publishing': {
            target: 'Publishing-Rejected',
            cond: 'issuer is admin or system',
          },
        },

        exit: 'notify_creator',
      },

      'Published': {
        on: {
          'set-draft': {
            target: 'Draft',
            cond: 'issuer is creator or admin',
          },
        },
      },

      'In-Trash': {
        entry: ['notify_creator', 'schedule_destroy'],

        exit: 'cancel_destroy_schedule',

        on: {
          recover: {
            target: 'Draft',
            cond: 'issuer is creator',
          },

          destroy: {
            target: 'Destroyed',
            cond: 'issuer is creator or system',
          },
        },
      },

      'Publishing-Rejected': {
        on: {
          'set-draft': {
            target: 'Draft',
            cond: 'issuer is creator',
          },
        },
      },

      'Autogenerating-Meta': {
        on: {
          'cancel-meta-autogen': {
            target: 'Draft',
            cond: 'issuer is creator',
            actions: 'cancel_meta_autogen_process',
          },
          'autogenerated-meta': {
            target: 'Autogenerated-Meta',
            cond: 'issuer is system',
          },
        },
      },

      'Autogenerated-Meta': {
        on: {
          'edit-draft-meta': {
            cond: 'issuer is creator and draft-form is formally valid',
            target: 'Draft',
            actions: ['assign-draft'],
          },
        },

        entry: 'notify_creator',
      },

      'Destroyed': {
        type: 'final',
        entry: 'destroy_all_data',
      },

      'Access-Denied': {
        type: 'final',
      },

      'Creating': {
        on: {
          'provide-content': {
            target: 'Checking-In-Content',
            cond: 'provided content is formally valid',
          },
        },
      },
    },

    initial: 'Creating',
  },
  {
    guards: {
      'issuer is creator and draft-form is formally valid'({ issuer, draft, validationConfigs }) {
        return (
          issuer.feats.creator && draftFormalValidation({ draft, validationConfigs }).draftValid
        )
      },
      'issuer is creator+publisher and draft-form is formally valid for publishing'({
        issuer,
        draft,
        validationConfigs,
      }) {
        return (
          issuer.feats.creator &&
          issuer.feats.publisher &&
          !!draftFormalValidation({ draft, validationConfigs }).publishable
        )
      },
      'issuer is admin or system'({ issuer }) {
        return issuer.feats.admin || issuer.type === 'system'
      },
      'issuer is creator'({ issuer }) {
        return issuer.feats.creator
      },
      'issuer is creator or admin'({ issuer }) {
        return issuer.feats.creator || issuer.feats.admin
      },
      'provided content is formally valid'({ validationConfigs }, { providedContent: content }) {
        return (
          content.kind === 'link' ||
          content.info.size <= validationConfigs.contentMaxUploadBytesSize
        )
      },
      'issuer is system'({ issuer }) {
        return issuer.type === 'system'
      },
      'issuer is creator or admin or system'({ issuer }) {
        return issuer.feats.creator || issuer.feats.admin || issuer.type === 'system'
      },
      'issuer is creator or system'({ issuer }) {
        return issuer.feats.creator || issuer.type === 'system'
      },
      'resource is not published and issuer is neither creator, admin or system'(
        { issuer },
        _,
        { state },
      ) {
        return (
          !matchStateName<Typegen0>(state, 'Published') &&
          !(issuer.feats.creator || issuer.feats.admin || issuer.type === 'system')
        )
      },
      'on creating issuer is not authenticated'({ issuer }, _, { state }) {
        return matchStateName<Typegen0>(state, 'Creating') && issuer.type === 'anonymous'
      },
    },
    actions: {
      'assign-draft': assign((c, e) => {
        return produce(c, proxy => {
          const { image: providedImage, ...draftMeta } = e.updateWith
          const image: DraftDocument['image'] =
            !providedImage || providedImage.type === 'no-change'
              ? proxy.draft.image
              : providedImage.type === 'remove'
              ? null
              : providedImage.type === 'update'
              ? providedImage.provide
              : proxy.draft.image
          proxy.draft = { ...proxy.draft, ...draftMeta, image }
        })
      }),
      'assign-identifiers-and-content': assign((c, { data }) => {
        return produce(c, proxy => {
          proxy.identifiers = { resourceKey: data.resourceKey }
          proxy.draft.content = data.content
        })
      }),
      'assign-rejected-content-reason': assign((c, { data }) => {
        return produce(c, proxy => {
          const err = String(data)
          proxy.contentRejectedReason = `couldn't create resource for unexpected error: ${err}`
        })
      }),
    },
  },
)

export function draftFormalValidation({
  draft,
  validationConfigs: { descriptionLength, titleLength, learningOutcomes },
}: Pick<T.Context, 'draft' | 'validationConfigs'>): {
  draftValid: boolean
  publishable: PublishableDocument | undefined
} {
  // FIXME: model context|services|? for using a validation lib here
  const codes: (keyof DraftDocument)[] = [
    'language',
    'level',
    'license',
    'subject',
    'type',
    'year',
    'month',
  ]
  const draftValid =
    draft.title.length <= titleLength.max &&
    draft.description.length <= descriptionLength.max &&
    draft.learningOutcomes.length <= learningOutcomes.amount.max &&
    draft.learningOutcomes.every(
      ({ sentence }) => sentence.length <= learningOutcomes.sentenceLength.max,
    ) &&
    codes.every(code => code.length <= 10)

  const isPublishable =
    draftValid &&
    draft.title.length >= titleLength.min &&
    draft.description.length >= descriptionLength.min &&
    draft.learningOutcomes.length >= learningOutcomes.amount.min &&
    draft.learningOutcomes.every(
      ({ sentence }) => sentence.length >= learningOutcomes.sentenceLength.min,
    ) &&
    !!draft.language &&
    !!draft.level &&
    !!draft.license &&
    !!draft.subject &&
    !!draft.type &&
    !!draft.year &&
    !!draft.month &&
    codes.every(code => !!code)

  return {
    draftValid,
    publishable: isPublishable ? (draft as any as PublishableDocument) : undefined,
  }
}
