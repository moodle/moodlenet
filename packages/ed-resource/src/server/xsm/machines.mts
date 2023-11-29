import type {
  Actor_StoreNewResource_Data,
  Actor_StoreResourceEdits_Data,
  Context,
  EdResourceMachineDeps,
  StateName,
} from '@moodlenet/core-domain/resource'
import { DEFAULT_CONTEXT, getEdResourceMachine } from '@moodlenet/core-domain/resource'
import { interpret } from 'xstate'

import type { AccessEntitiesRecordType } from '@moodlenet/system-entities/server'
import { createEntityKey } from '@moodlenet/system-entities/server'
import { Resource } from '../exports.mjs'
import { env } from '../init/env.mjs'
import {
  createResource,
  deleteImageFile,
  delResource,
  delResourceFile,
  getResource,
  patchResource,
  storeResourceFile,
  updateImage,
  validationsConfigs,
} from '../services.mjs'
import { shell } from '../shell.mjs'
import type { ResourceDataType } from '../types.mjs'
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
      enableMetaGenerator: env.enableMetaGenerator,
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
      enableMetaGenerator: env.enableMetaGenerator,
    }
    const deps = getEdResourceMachineDeps()
    return [deps, initialContext]
  }

  const persistentContext = map.db.doc_2_persistentContext(resourceRecord.entity)

  const initialContext: Context = {
    ...DEFAULT_CONTEXT,
    ...persistentContext,
    issuer: await providers.getIssuer(
      resourceRecord.meta.creatorEntityId
        ? ['current-resource-creator-id', resourceRecord.meta.creatorEntityId]
        : ['creator', false],
    ),
  }
  const deps = getEdResourceMachineDeps()
  const depsAndInitializations: DepsAndInitializations = [deps, initialContext]
  return depsAndInitializations
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
        const created = await createResource(
          {
            ...resourceDataTypeMeta,
            _key: newResourceKey,
          },
          contentResourceDataType,
        )

        if (!created) {
          contentResourceDataType.kind === 'file' && delResourceFile(newResourceKey)
          throw new Error('resource creation failed for unknown reasons')
        }
        const image = context.resourceEdits?.data?.image
        if (image?.kind === 'file' || image?.kind === 'url')
          await updateImage(newResourceKey, image)

        const persistentContext = map.db.doc_2_persistentContext(created)
        const response: Actor_StoreNewResource_Data = {
          doc: persistentContext.doc,
        }
        return response
      },
      async ModeratePublishingResource() {
        return new Promise(resolve => {
          setTimeout(() => resolve({ notPassed: false }), 100)
        })
      },
      async ScheduleDestroy() {
        return new Promise(resolve => {
          setTimeout(() => resolve(true), 100)
        })
      },
      async StoreResourceEdits(context) {
        const resourceKey = context.doc.id.resourceKey
        const imageEdits = context.resourceEdits?.data.image
        const meta = context.resourceEdits?.data.meta

        const resourceDataTypeMeta = map.db.meta_2_db({
          ...context.doc.meta,
          ...meta,
        })

        const patchRes =
          (await updateImage(resourceKey, imageEdits)) &&
          (await patchResource(resourceKey, {
            ...resourceDataTypeMeta,
          }))

        if (!patchRes) {
          throw new Error('StoreResourceEdits (patchResource) failed for unknown reasons')
        }

        const persistentContext = map.db.doc_2_persistentContext(patchRes.patched)
        const res: Actor_StoreResourceEdits_Data = {
          doc: persistentContext.doc,
        }
        return res
      },
    },
    actions: {
      notify_creator(/* _, ev */) {
        //@ALE: TBD
        // console.log('notify_creator' /* , ev.type */)
      },
      destroy_all_data(context) {
        const resourceKey = context.doc.id.resourceKey
        if (resourceKey === DEFAULT_CONTEXT.doc.id.resourceKey) {
          return
        }
        delResource(resourceKey)
        deleteImageFile(resourceKey)
        delResourceFile(resourceKey)
      },
      request_generate_meta_suggestions(context) {
        shell.events.emit('resource:request-metadata-generation', {
          resourceKey: context.doc.id.resourceKey,
        })
      },
    },

    validationConfigs: {
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
    },
  }
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
  interpreter.onStop(() => {
    if (!tx) return
    const state = interpreter.getSnapshot()
    // https://github.com/statelyai/xstate/discussions/1294
    const currentState = state.value as StateName
    const saveOnStates: StateName[] = [
      'Autogenerating-Meta',
      'Unpublished',
      'Publishing-Moderation',
      'In-Trash',
      'Published',
      'Meta-Suggestion-Available',
      'Publish-Rejected',
    ]
    if (!saveOnStates.includes(currentState)) {
      return
    }
    //if (state.history && !state.history.matches(currentState)) {
    const persistentContext: ResourceDataType['persistentContext'] = {
      generatedData:
        currentState === 'Meta-Suggestion-Available' ? state.context.generatedData : null,
      publishRejected: currentState === 'Publish-Rejected' ? state.context.publishRejected : null,
      state: currentState,
      publishingErrors: currentState === 'Unpublished' ? state.context.publishingErrors : null,
    }
    Resource.collection.update(
      state.context.doc.id.resourceKey,
      {
        persistentContext,
        published: currentState === 'Published',
      },
      { mergeObjects: false, silent: true, keepNull: true },
    )
    // .then(
    //   () => console.log(`updated ${state.context.doc.id.resourceKey} ${currentState}`),
    //   e => console.log(`could not update ${state.context.doc.id.resourceKey} ${currentState}`, e),
    // )
    //}
  })
  interpreter.start(initializeContext.state)

  return [interpreter, initializeContext, machine, configs] as const
}
