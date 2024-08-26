import type {
  Actor_StoreNewResource_Data,
  Actor_StoreResourceEdits_Data,
  Context,
  EdResourceMachineDeps,
  ImageEdit,
  ResourceDoc,
  StateName,
  ValidationConfigs,
} from '@moodlenet/core-domain/resource'
import {
  DEFAULT_CONTEXT,
  getEdResourceMachine,
  getValidationSchemas,
} from '@moodlenet/core-domain/resource'
import { interpret } from 'xstate'

import type { RpcFile } from '@moodlenet/core'
import { webImageResizer } from '@moodlenet/react-app/server'
import type { AccessEntitiesRecordType } from '@moodlenet/system-entities/server'
import { createEntityKey, getCurrentEntityUserIdentifier } from '@moodlenet/system-entities/server'
import { Resource } from '../exports.mjs'
import { env } from '../init/env.mjs'
import {
  createResource,
  delResource,
  delResourceFile,
  deleteImageFile,
  getResource,
  patchResource,
  storeResourceFile,
  updateImage,
  validationsConfigs,
} from '../services.mjs'
import { shell } from '../shell.mjs'
import type { EventResourceMeta, ResourceDataType } from '../types.mjs'
import * as map from './mappings/exports.mjs'
import providers from './providers.mjs'

export type ProvideBy =
  | {
      by: 'data'
      data: AccessEntitiesRecordType<ResourceDataType, unknown, any>
    }
  | {
      by: 'key'
      key: string
    }
  | {
      by: 'create'
    }

export type DepsAndInitializations = [deps: EdResourceMachineDeps, initializeContext: Context]

export async function provideEdResourceMachineDepsAndInits(
  reviveBy: ProvideBy,
): Promise<DepsAndInitializations> {
  if (reviveBy.by === 'create') {
    const initialContext: Context = {
      ...DEFAULT_CONTEXT,
      state: 'Checking-In-Content',
      issuer: await providers.getIssuer(['creator', true]),
      metaGeneratorEnabled: env.enableMetaGenerator,
    }
    const deps = getEdResourceMachineDeps()
    return [deps, initialContext]
  }
  const resourceRecord =
    reviveBy.by === 'data'
      ? reviveBy.data
      : reviveBy.by === 'key'
        ? await getResource(reviveBy.key)
        : (() => {
            throw new TypeError('never')
          })()

  if (!resourceRecord) {
    const initialContext: Context = {
      ...DEFAULT_CONTEXT,
      state: 'No-Access',
      issuer: await providers.getIssuer(['creator', false]),
      noAccess: { reason: 'not available' },
      metaGeneratorEnabled: env.enableMetaGenerator,
    }
    const deps = getEdResourceMachineDeps()
    return [deps, initialContext]
  }

  const persistentContext = map.db.doc_2_persistentContext(resourceRecord.entity)
  const schemas = getResourceValidationSchemas()

  const initialContext: Context = {
    ...DEFAULT_CONTEXT,
    ...persistentContext,
    publishingErrors: schemas.publishable(persistentContext.doc.meta).errors,
    issuer: await providers.getIssuer(
      resourceRecord.meta.creatorEntityId
        ? ['current-resource-creator-id', resourceRecord.meta.creatorEntityId]
        : ['creator', false],
    ),
    metaGeneratorEnabled: env.enableMetaGenerator,
  }
  const deps = getEdResourceMachineDeps()
  const depsAndInitializations: DepsAndInitializations = [deps, initialContext]
  return depsAndInitializations
}

export function getEventResourceMeta(resourceDoc: ResourceDoc): EventResourceMeta {
  const { image, meta } = resourceDoc
  return { image, ...meta }
}
function getEdResourceMachineDeps(): EdResourceMachineDeps {
  return {
    services: {
      async StoreNewResource(context) {
        if (!context.providedContent) {
          throw new TypeError('StoreNewResource no content provided')
        }
        const newResourceKey = createEntityKey()

        const contentResourceDataType: ResourceDataType['content'] =
          context.providedContent.kind === 'link'
            ? { kind: 'link', url: context.providedContent.url }
            : {
                kind: 'file',
                fsItem: await storeResourceFile(newResourceKey, context.providedContent.rpcFile),
              }

        const resourceDataTypeMeta = await map.db.meta_2_db({
          ...context.doc.meta,
          ...context.resourceEdits?.data.meta,
        })
        const resourceDoc = await createResource(
          {
            ...resourceDataTypeMeta,
            _key: newResourceKey,
          },
          contentResourceDataType,
        )

        if (!resourceDoc) {
          contentResourceDataType.kind === 'file' && delResourceFile(newResourceKey)
          throw new Error('resource creation failed for unknown reasons')
        }
        const imageResource: ImageEdit | undefined =
          context.providedContent.kind === 'file' &&
          /^image\//.test(context.providedContent.rpcFile.type)
            ? await (async (rpcFile: RpcFile) => {
                const resizedRpcFile = await webImageResizer(rpcFile, 'image')

                const imageEdit: ImageEdit = {
                  kind: 'file',
                  rpcFile: resizedRpcFile,
                  size: resizedRpcFile.size,
                }
                return imageEdit
              })(context.providedContent.rpcFile)
            : undefined

        const image = imageResource ?? context.resourceEdits?.data?.image
        if (image?.kind === 'file' || image?.kind === 'url')
          await updateImage(newResourceKey, image)

        const persistentContext = map.db.doc_2_persistentContext(resourceDoc)
        const response: Actor_StoreNewResource_Data = {
          doc: persistentContext.doc,
        }

        const userId = await getCurrentEntityUserIdentifier()
        if (userId) {
          shell.events.emit('created', {
            resource: resourceDoc,
            userId,
          })
          // if (context.resourceEdits) {
          //   shell.events.emit('updated-meta', {
          //     resourceKey: newResourceKey,
          //     userId,
          //     meta: getEventResourceMeta(persistentContext.doc),
          //     oldMeta: getEventResourceMeta({}),
          //   })
          // }
        }
        return response
      },
      async ScheduleDestroy() {
        return new Promise(resolve => {
          setTimeout(() => resolve(true), 100)
        })
      },
      async StoreResourceEdits(context) {
        const oldDoc = context.doc
        const resourceKey = oldDoc.id.resourceKey
        const inputImage = context.resourceEdits?.data.image
        const inputMeta = context.resourceEdits?.data.meta

        const resourceDataTypeMeta = map.db.meta_2_db({
          ...oldDoc.meta,
          ...inputMeta,
        })

        const patchRes =
          (await updateImage(resourceKey, inputImage)) &&
          (await patchResource(resourceKey, {
            ...resourceDataTypeMeta,
          }))

        if (!patchRes) {
          throw new Error('StoreResourceEdits (patchResource) failed for unknown reasons')
        }
        const persistentContext = map.db.doc_2_persistentContext(patchRes.patched)

        const userId = await getCurrentEntityUserIdentifier()
        // console.log({ patchRes })
        if (userId && patchRes.changed) {
          shell.events.emit('updated-meta', {
            meta: getEventResourceMeta(persistentContext.doc),
            oldMeta: getEventResourceMeta(persistentContext.doc),
            resourceKey,
            userId,
          })
        }
        const res: Actor_StoreResourceEdits_Data = {
          doc: persistentContext.doc,
        }
        return res
      },
    },
    actions: {
      // notify_creator(/* _, ev */) {
      //   // console.log('notify_creator' /* , ev.type */)
      // },
      async destroy_all_data(context) {
        const resourceKey = context.doc.id.resourceKey
        if (resourceKey === DEFAULT_CONTEXT.doc.id.resourceKey) {
          return
        }
        const resource = await delResource(resourceKey)
        if (!resource) {
          return
        }
        deleteImageFile(resourceKey)
        delResourceFile(resourceKey)
        const userId = await getCurrentEntityUserIdentifier()
        if (userId) {
          shell.events.emit('deleted', {
            userId,
            resource: { ...resource.entity, _meta: resource.meta },
          })
        }
      },
      async request_generate_meta_suggestions(context) {
        const userId = await getCurrentEntityUserIdentifier()
        if (userId) {
          shell.events.emit('request-metadata-generation', {
            resourceKey: context.doc.id.resourceKey,
            userId,
          })
        }
      },
    },

    validationConfigs: getValidationConfigs(),
  }
}

export function getValidationConfigs(): ValidationConfigs {
  return {
    content: { sizeBytes: { max: validationsConfigs.contentMaxUploadSize } },
    image: { sizeBytes: { max: validationsConfigs.imageMaxUploadSize } },
    meta: {
      description: { length: validationsConfigs.descriptionLength },
      title: { length: validationsConfigs.titleLength },
      learningOutcomes: {
        amount: validationsConfigs.learningOutcomes.amount,
        sentence: { length: validationsConfigs.learningOutcomes.sentenceLength },
      },
    },
  }
}

export function getResourceValidationSchemas() {
  const schemas = getValidationSchemas(getValidationConfigs())
  return schemas
}

export async function stdEdResourceMachine(by: ProvideBy) {
  const [configs, initializeContext] = await provideEdResourceMachineDepsAndInits(by)
  const machine = getEdResourceMachine(configs).withContext(initializeContext)

  const interpreter = interpret(machine)
  let tx = false

  interpreter.onTransition((_, e) => {
    const ignoreEvents = ['xstate.init']
    if (ignoreEvents.includes(e.type)) {
      return
    }
    tx = true
  })
  const oldState = initializeContext.state

  let resolveStoredStatus: (changed: boolean) => void
  //let rejectStoredStatus: (e: any) => void
  const storedStatus = new Promise<boolean>((_resolveStoredStatus /* , _rejectStoredStatus */) => {
    resolveStoredStatus = _resolveStoredStatus
    // rejectStoredStatus = _rejectStoredStatus
  })
  interpreter.onStop(() => {
    if (!tx) return
    const state = interpreter.getSnapshot()
    // https://github.com/statelyai/xstate/discussions/1294
    const currentState = state.value as StateName
    const saveOnStates: StateName[] = [
      'Autogenerating-Meta',
      'Unpublished',
      'Published',
      'Meta-Suggestion-Available',
      'Publish-Rejected',
    ]
    if (!saveOnStates.includes(currentState)) {
      resolveStoredStatus(false)
      return
    }
    //if (state.history && !state.history.matches(currentState)) {
    const persistentContext: ResourceDataType['persistentContext'] = {
      generatedData:
        currentState === 'Meta-Suggestion-Available' ? state.context.generatedData : null,
      state: currentState,
      // publishRejected: currentState === 'Publish-Rejected' ? state.context.publishRejected : undefined,
      // publishingErrors: currentState === 'Unpublished' ? state.context.publishingErrors : undefined,
    }

    Resource.collection
      .update(
        state.context.doc.id.resourceKey,
        {
          persistentContext,
          published: currentState === 'Published',
        },
        { mergeObjects: false, keepNull: true, returnNew: true, returnOld: true },
      )
      .then(
        async updateResult => {
          if (!(updateResult?.new && updateResult?.old)) {
            // rejectStoredStatus(new Error('update failed for unknown reasons'))
            resolveStoredStatus(false)
            return
          }
          const publishEvent =
            oldState === currentState
              ? undefined
              : currentState === 'Published'
                ? 'published'
                : oldState === 'Published' && currentState === 'Unpublished'
                  ? 'unpublished'
                  : undefined
          // console.log('\n*****'.repeat(5), {
          //   oldState,
          //   currentState,
          //   publishEvent,
          // })
          const userId = await getCurrentEntityUserIdentifier()

          if (publishEvent && userId) {
            shell.events.emit(publishEvent, {
              resource: updateResult.new,
              userId,
            })
          }
          // console.log('resolveStoredStatus(true)')
          resolveStoredStatus(true)
        }, // rejectStoredStatus )
        () => resolveStoredStatus(false),
      )
    // .then(
    //   () => console.log(`updated ${state.context.doc.id.resourceKey} ${currentState}`),
    //   e => console.log(`could not update ${state.context.doc.id.resourceKey} ${currentState}`, e),
    // )
    //}
  })
  interpreter.start(initializeContext.state)

  return [interpreter, initializeContext, machine, configs, storedStatus] as const
}
