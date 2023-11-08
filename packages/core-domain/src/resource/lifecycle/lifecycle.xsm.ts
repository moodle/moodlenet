import { produce } from 'immer'
import { assign, createMachine } from 'xstate'
import { matchStateName } from '../../common/exports'
import { DraftDocument, EdResourceDocument, PublishableMeta, ResourceContent } from './exports'
import { Typegen0 } from './lifecycle.xsm.typegen'
import type * as T from './types/lifecycle.types'
export const EdResourceMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQBUA2gAwC6ioADprAJYAuTmAdrSAB6IC0AJgDMAVmEA6QQBZBAdgCMANlFKVChcIA0IAJ4CFcwQA4JxwUuHHjCioNVKAnAF9nO1Blg4CxcgppIIAzMbJzcfAhC0krSEtIUSnJyjgnqmjr6kcoUohIK4sbR+VbRru7oWHiEEgDCABZg+ADWTBxQ-ACSHPw1nCxgHCxEEJxgEq0AbphNYx6VPrUNza3tXT19AywIk5j4AIahHJRUx9zBrOxcgRH8CtKaEoqOdxTCggk5ghkGgo6ShsYxL9RNJRACyiA5l4qmN6o0Wm1Ot1eoNNkQwLhcJhcBI6AAbA4AM2xAFsJFDvNU4ctEWsUf1BtsOFN9odjqdAudDuEBI54hI+b8KNIkiKxEpvllhIoBckFCZ3o5RKoIRSYYt4SsketUYMiHt8IQ6Cx+PgNoMOfRGBcwtcDMYVBIVNJxY5rHJVNo9AYKOYJL7RDI3Xy1FZVRVoQtqQjVsjzUNcGAAFaNE1m3UsS1Ba3cu1ZaR++RyQFK8SOd5ezK3BTGCgCmzRB2aZSGcOeSljAAiuD2hKGkFY-AgPb7-BJYBYeyzXMuPKyyoUEmECkccisMkKjj+kv4Sge+TUmiUOSShTb82q3d7Qz22BYmBgHAxBzAY4nU+oZxzs7z1cSUkcNQlBsCgjArHdbBdPJ4nLYQ4JSOxRHPSNLxHBMwAAR2wOATTobAACM8SYWA6mnb9bVAG58kAqQ1DFZc1FeHdlzkf0KFeTQchrYULGQjsJCvPsiBYHsSLIkIf0ogw7kEMwKGUYEgKY71Ii3f0QVeOwimsEQ+PVelNn4DAU3wfoIGGHCsV0cSbSuKTIlkWJhHkv5QQ0URrEcZi-XY5Ja0EExfRkPSFgABQIoiSK1ABZTAIGfQ59UNMBjX4PDCOIuoVhs3N7NuIxF3k+JEKcUQ+WYutLCcCw91A4xi2MELqnCjKosRWL4p7RLExM3CIsy7LP05ci7N4AQAtkR4VwoJVhD3eqZElQMl1rPkj2SYQXSQtxIQjfiWsihpzNgCchzQnLJLGrJrEXLdQRiQD7DXStxqsJdYNkJwHuPYQmrGNYABVRLqIhEzNCYMQuiirt3FIzFEeSa2VGRpHLHd3iUf1onEF1axFQC5D+iRAeBizYBEzBrKGq0JOhm4nEcdSi3EaVkclO5GcDe5kmkbGPXlImDoGxFjNTSAiBOk1h2vKHRpuQQa1YvcPXkQC5qSF7IhkSRGzdaVYOMPkiYAQTvB8BgSmL3yIfYOEIPE30nfhb3vR9ZbnW5rFMQxhBSZdChiTX+EKWSQUDQ3sZBZITbNx9Lfa62XfNp8usgR2PwCGnbI9hXLCdVRedRxRQVEHdy1iTRNuLBW10FGPXYt1OIH4aLrYHKW0PT93fxkd5HiVZ49bkOwFB3cRCsSTaXKVeJpCJmpEwOFYiDoLEJiYeLTXjbu8prEUnSPOarGPALjAg49TALQoxHqhGV1cHaODiuBuDVHwv1puXxrBWT4kSZJUhgnSCpT2yglwWAxpYNce4lDzyWDGbUBlBgf2zr+Qwah3o6Wrh8QMEEwSVRyKoLcLFSg7Tfqha8KDcow00PyZyCklRKSDrzWSd0yyrQSCKee8YjLJjFhAKhl0biAUXBoYwIJpSo3qmoCCudwGbQ8kkcshRtrlHbOqIWbV2gdUttDGcdMDBwVks5IwUd7p7iDu8Uwyp4jORkPNcwv0yF7Q0f1EikBBEGKyMkVhIoyqWBXGVaQEENBSGcjkBs+C1wKCJiTPYJFPFf0iE4OsgEXRyCqqjVGXwQExAFBfaUiREjylEITZx6iwpuKyiLPhpkPHDU-jnFsUgI52DVv-IOthMa-CsJtNQ9g4J2HrsneO2j3yJI9txQqAUax3GsH0iUIC3Te3kOrQCTgNCwPKReMYpsG4pxfM3Vuk4Jk92ctYkU9heYOlgqXEBgJumgjXIbQwGhBBE07JZSm9Ss7UJuHBViORWZbj1r7QCkoFY6z+MKPk5g3TxFUbtCp1RjbJVgLAfgnyOBMB+dmRpPd5CFUFAAtQQDOkikXAjUqXFh4HnnovNgbRTm72HqxeU5YLEOjsCYCCrKJBlTdPYE+DgXAPyAA */
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
          onDone: [{ actions: ['assign-identifiers-and-content'] }],
          onError: [{ actions: ['assign-rejected-content-reason'], target: 'Content-Rejected' }],
        },
      },

      'Draft': {
        on: {
          'edit-draft-meta': {
            target: 'Draft',
            cond: { type: 'issuer is creator and draft-form is formally valid' },
            internal: true,
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
              ? undefined
              : providedImage.type === 'remove'
              ? null
              : providedImage.type === 'update'
              ? providedImage.provide
              : undefined
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
  publishable: PublishableMeta | undefined
} {
  // FIXME: model context|services|? for using a validation lib here
  const codes: (keyof EdResourceDocument)[] = [
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
    publishable: isPublishable ? (draft as any as PublishableMeta) : undefined,
  }
}
