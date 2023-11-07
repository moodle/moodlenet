import { produce } from 'immer'
import { assign, createMachine } from 'xstate'
import { matchStateName } from '../../common/exports'
import { EdResourceDocument, PublishableMeta, ResourceContent } from './exports'
import { Typegen0 } from './lifecycle.xsm.typegen'
import type * as T from './types/lifecycle.types'
export const EdResourceMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFEICU4HsCuAnAxmAMQBUA2gAwC6ioADprAJYAuTmAdrSAB6IC0AJgDMAVmEA6QQBZBAdgCMANlFKVChcIA0IAJ4CFcwQA4JxwUuHHjCioNVKAnAF9nO1Blg4CxcgppIIAzMbJzcfAhC0krSEtIUSnJyjgnqmjr6kcoUohIK4sbR+VbRru7oWHiEEgDCABZg+ADWTBxQ-ACSHPw1nCxgHCxEEJxgEq0AbphNYx6VPrUNza3tXT19AywIk5j4AIahHJRUx9zBrOxcgRH8CtKaEoqOdxTCggk5ghkGgo6ShsYxL9RNJRACyiA5l4qmN6o0Wm1Ot1eoNNkQwLhcJhcBI6AAbA4AM2xAFsJFDvNU4ctEWsUf1BtsOFN9odjqdAudDuEBI54hI+b8KNIkiKxEpvllhIoBckFCZ3o5RKoIRSYYt4SsketUYMiHt8IQ6Cx+PgNoMOfRGBcwtcDMYVBIVNJxY5rHJVNo9AYKOYJL7RDI3Xy1FZVRVoQtqQjVsjzUNcGAAFaNE1m3UsS1Ba3cu1ZaR++RyQFK8SOd5ezK3BTGCgCmzRB2aZSGcOeSljAAiuD2hKGEB7ff42DoEAOYCzXMuPKylliIpd0vE8Q9Eu9kWVsUENekjkciWSxjkbfm1W7vaGe2wLEwMA4GPH-BJYBYe0nOeneduFiUeSsxhBUExASYxJVuV5HEeFJhBXUQKD3EwT0jM9BwTMAAEdsDgE06GwAAjPEmFgOp3xCT9QBufJ9ykNQxWEZQlFeMD6Lkf0KFeTQchrYULCQjsJHPPsiBYHtiNIm0rgogw7kEMwKGUYE1EYyteUgnJ4mEOwimsEQ+PVelNn4DAU3wfoIGGbCsV0cTcykyJZFiTSFD+UENFEaxHGYv12MPOwTF9GQ9IWAAFfDCOIrUAFlMAgB9Dn1Q0wGNfhcIIoi6hWGzyN4AwjAUf0XjsVQlT5Zi60sJwf1sYti2MILqlCtKIsRaLYp7eLExMnCwvSzLqDOD9bTsoQZFkp54PEJQayMaRJUDCQrHg+5hESFyxHqsZGvChpzNgF9+AHC8sqGnKsmsfK91BGJ93sORhBUyIRFMYRyxgix913ZSNokNYABVRLqIhEzNCYMWOyTTv4Jw6wA+Sa2VGRdy+dchASf1omXRaRX3Y83EhCN+L+gGLNgETMGs-rOUGiGbicNTAyScQl0DSU7kgwN7mSaQMY9eVvq23rEWM1NICIPaTUOvtwZnIRpqdQwGf3FakgeqJJEbN1pVe4w+W+gBBa9bwGOKopfPYiH2DhCDxJ8zf4K8bzvaWvxraw8ju6CdxiVXClkkFAx1jGQWSfXDbvE2WrN-Uw+N9rIFt19neG7dLCdVRud3RRQVEMDy1iTQYOLbcPdkUPHdj8cIH4SKo8lk0RzHfok8h0b8pLYVZF9axZpRqbf1LKx5GVRQ5Gkb6akTA4ViIOgsQmJhYtNeNm8owpWKmlbN4dPzQJR7JTALQoxCPODnNcPGOBiuBuDVHwBrIk6bnseU4gSJIUjUMF0j3mxfzeSxEb3RUMIceSwYzagMoMe+EkZaGDUAtN05gi4fBZnvME5UcjFT+IYUoeNb4oQvNA2ykNND8ickoRSagmIo25rJS6ZZawfxFOPeMRlkwiwgEQ7KNx9z5Q0ABF0o83RyDUGBeUygFoiFBEeZIJhQT8x6s1dorUTYnSnI-Aw91ZKaSMMHK6G8wLvFMJuV4Wkpo6RAXggm6oBbEUgFwjRWRZEChFKIJWzk3E9yrBofKIh2LuTuOgu6ChvpEz2MRBxNMBDQwFN7ERK1dxIzAjEWJvppSJESPKUQuNyjthsYojKQt2GmXsVTB+UTHotikIHOwSsDyq1sL+X4VgYJqHsPdOwZcjb3naqbV8kTYG1nyn5GsdxrCtLXFWRBeR5DK33E4DQSgunhzjlXGu-SykwK-H44xIp7DcwdK9HOKNARNNBHdHWhgNCCG+p2Sy5NSlWnKTLe6rEchLj3JrF6+5JTbnVn8YUfJzBuniKIfWiVYCwH4HcjgTBHnZmeds+QwzBTJFSF-BpIp8pwScHBMEch5IqisXkqMk82BtAGS7AlrF5Tlg3tvQQJgxHUokG4t09hGIcqcOfZwQA */
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
          'draft-update': {
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
          'draft-update': {
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
        return produce(c, draft => {
          draft.draft = e.updateWith
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
