import { Actor_StoreNewResource_Data, Context, ResourceDoc, UserIssuer } from '../exports'
import { EdResourceMachineDeps } from '../lifecycle.xsm'

export function userIssuer({ feats }: { feats?: Partial<UserIssuer['feats']> }) {
  const issuer: UserIssuer = {
    type: 'user',
    feats: {
      admin: false,
      creator: false,
      publisher: false,
      ...feats,
    },
  }
  return issuer
}
export function getEdResourceMachineDeps() {
  const edResourceMachineDeps: EdResourceMachineDeps = {
    actions: {
      destroy_all_data() {
        console.log('destroy_all_data')
      },
      notify_creator() {
        console.log('notify_creator')
      },
      request_generate_meta_suggestions() {
        console.log('request_generate_meta_suggestions')
      },
    },
    services: {
      async ModeratePublishingResource() {
        return { notPassed: false }
      },
      async ScheduleDestroy() {
        return {}
      },
      async StoreNewResource(context) {
        if (!context.providedContent) {
          throw new TypeError('StoreNewResource (never): no providedContent available')
        }

        const storedNew: Actor_StoreNewResource_Data = {
          doc: {
            id: {},
            content: context.providedContent,
            ...edits2docParts(context),
          },
        }
        return storedNew
      },
      async StoreResourceEdits(context) {
        return {
          doc: {
            ...context.doc,
            ...edits2docParts(context),
          },
        }
      },
    },
    validationConfigs: {
      content: { sizeBytes: { max: 1000 } },
      image: { sizeBytes: { max: 100 } },
      meta: {
        description: { length: { max: 5, min: 2 } },
        title: { length: { max: 5, min: 2 } },
        learningOutcomes: { amount: { max: 2, min: 1 }, sentence: { length: { max: 5, min: 2 } } },
      },
    },
  }
  return edResourceMachineDeps
}

export function timeoutPromise<DataOrError>(
  dataOrError: DataOrError,
  timeout?: number,
  log?: string,
): Promise<DataOrError> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      log && console.log(`timeoutPromise ${log} `, dataOrError)
      dataOrError instanceof Error ? reject(dataOrError) : resolve(dataOrError)
    }, timeout)
  })
}

export function edits2docParts(context: Context) {
  const image: ResourceDoc['image'] =
    context.resourceEdits?.data.image?.kind === 'file' ||
    context.resourceEdits?.data.image?.kind === 'url'
      ? context.resourceEdits?.data.image
      : context.resourceEdits?.data.image?.kind === 'remove'
      ? null
      : context.doc.image
  const meta: ResourceDoc['meta'] = context.resourceEdits?.data.meta ?? context.doc.meta
  return { meta, image }
}
