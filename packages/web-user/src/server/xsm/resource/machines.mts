import type {
  Actor_MetaGenerator_Data,
  Actor_StoreNewResource_Data,
  Actor_StoreResourceEdits_Data,
  Context,
  EdResourceMachineDeps,
  Issuer,
} from '@moodlenet/core-domain/resource'
import {
  DEFAULT_CONTEXT,
  SYSTEM_ISSUER,
  UNAUTHENTICATED_ISSUER,
} from '@moodlenet/core-domain/resource'
import type {
  DepsAndInitializations,
  ProvideBy,
  ResourceDataType,
} from '@moodlenet/ed-resource/server'
import {
  createResource,
  deleteImageFile,
  delResource,
  delResourceFile,
  getResource,
  map,
  patchResource,
  storeResourceFile,
  updateImage,
  validationsConfigs,
} from '@moodlenet/ed-resource/server'
import { createEntityKey, getCurrentSystemUser } from '@moodlenet/system-entities/server'
import { verifyCurrentTokenCtx } from '../../srv/web-user.mjs'

export async function provideEdResourceMachineDepsAndInits(
  reviveBy: ProvideBy,
): Promise<DepsAndInitializations> {
  if (reviveBy.by === 'create') {
    const initialContext: Context = {
      ...DEFAULT_CONTEXT,
      state: 'Checking-In-Content',
      issuer: await getIssuer(['creator', true]),
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
      issuer: await getIssuer(['creator', false]),
      noAccess: { reason: 'not available' },
    }
    const deps = getEdResourceMachineDeps()
    return [deps, initialContext]
  }

  const persistentContext = map.db.doc_2_persistentContext(resourceRecord.entity)

  const initialContext: Context = {
    ...DEFAULT_CONTEXT,
    ...persistentContext,
    issuer: await getIssuer(
      resourceRecord.meta.creatorEntityId
        ? ['creator-id', resourceRecord.meta.creatorEntityId]
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
      async MetaGenerator(/* context */) {
        return new Promise<Actor_MetaGenerator_Data>(resolve => {
          setTimeout(() => {
            const metaGeneratorData: Actor_MetaGenerator_Data = {
              generatedData: {
                meta: {
                  title: 'test generated title',
                  description: 'test generated description',
                },
              },
            }
            resolve(metaGeneratorData)
          }, 20 * 1000)
        })
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

async function getIssuer([paramType, val]:
  | ['creator-id', string]
  | ['creator', boolean]): Promise<Issuer> {
  const currentSystemUser = await getCurrentSystemUser()

  return currentSystemUser.type === 'root' || currentSystemUser.type === 'pkg'
    ? SYSTEM_ISSUER
    : currentSystemUser.type === 'entity'
    ? await (async (): Promise<Issuer> => {
        const currentWebUser = await verifyCurrentTokenCtx()
        if (!currentWebUser) {
          return UNAUTHENTICATED_ISSUER
        } else if (currentWebUser.payload.isRoot) {
          return SYSTEM_ISSUER
        }

        const creator = paramType === 'creator' ? val : currentWebUser.payload.profile._id === val
        return {
          type: 'user',
          feats: {
            admin: currentWebUser.payload.webUser.isAdmin,
            creator,
            publisher: currentWebUser.payload.profile.publisher,
          },
        }
      })()
    : UNAUTHENTICATED_ISSUER
}
