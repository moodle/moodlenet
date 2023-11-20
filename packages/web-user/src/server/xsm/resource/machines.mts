import type { ImageUploaded } from '@moodlenet/collection/server'
import type {
  Actor_StoreResourceEdits_Data,
  Context,
  Issuer,
  StateName,
} from '@moodlenet/core-domain/resource'
import {
  DEFAULT_CONTEXT,
  getEdResourceMachine,
  stateMatcher,
  SYSTEM_ISSUER,
  UNAUTHENTICATED_ISSUER,
} from '@moodlenet/core-domain/resource'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import {
  createResource,
  deleteImageFile,
  delResource,
  delResourceFile,
  EMPTY_RESOURCE,
  getResource,
  map,
  patchResource,
  saveResourceImage,
  setResourceImage,
  storeResourceFile,
  validationsConfigs,
} from '@moodlenet/ed-resource/server'
import type { AccessEntitiesRecordType } from '@moodlenet/system-entities/server'
import { createEntityKey, getCurrentSystemUser } from '@moodlenet/system-entities/server'
import { interpret } from 'xstate'
import { verifyCurrentTokenCtx } from '../../srv/web-user.mjs'

async function reviveStateAndContext(
  reviveBy:
    | { type: 'create' }
    | { type: 'data'; data: AccessEntitiesRecordType<ResourceDataType, unknown, any> }
    | { type: 'key'; key: string },
): Promise<
  [StateName, Context, AccessEntitiesRecordType<ResourceDataType, unknown, any> | undefined]
> {
  if (reviveBy.type === 'create') {
    return [
      'Checking-In-Content',
      {
        ...DEFAULT_CONTEXT,
        issuer: await getIssuer(['creator', true]),
        // identifiers: { resourceKey: createEntityKey() },
      },
      undefined,
    ] // as const
  }
  const resourceRecord =
    reviveBy.type === 'data'
      ? reviveBy.data
      : reviveBy.type === 'key'
      ? await getResource(reviveBy.key)
      : (() => {
          throw new TypeError('never')
        })()

  if (!resourceRecord) {
    return [
      'No-Access',
      {
        ...DEFAULT_CONTEXT,
        issuer: await getIssuer(['creator', false]),
        noAccess: { reason: 'not available' },
      },
      undefined,
    ]
  }

  const [state, doc] = map.db.doc_2_xsm(resourceRecord.entity)

  return [
    state,
    {
      ...DEFAULT_CONTEXT,
      doc,
      issuer: await getIssuer(
        resourceRecord.meta.creatorEntityId
          ? ['creator-id', resourceRecord.meta.creatorEntityId]
          : ['creator', false],
      ),
    },
    resourceRecord,
  ]
}

export async function interpreterAndMachine(
  res:
    | { type: 'create' }
    | { type: 'data'; data: AccessEntitiesRecordType<ResourceDataType, unknown, any> }
    | { type: 'key'; key: string },
) {
  const [state, initialContext, resourceRecord] = await reviveStateAndContext(res)
  const machine = configureMachine(initialContext)
  const interpreter = interpret(machine, {})
  interpreter.start(state)
  interpreter.subscribe(async state => {
    const stateMatches = stateMatcher(state)
    const noSaveStates: StateName[] = [
      'Checking-In-Content',
      'Storing-New-Resource',
      'No-Access',
      'Destroyed',
    ]
    if (noSaveStates.some(stateMatches)) {
      return // no-op
    }

    await patchResource(initialContext.doc.id.resourceKey, {
      lifecycleState: state.toStrings()[0] as StateName,
    })
  })

  return {
    interpreter,
    machine,
    data: resourceRecord,
  }
}

function configureMachine(initialContext: Context) {
  return getEdResourceMachine({
    services: {
      async StoreNewResource(provideDataEvent) {
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        const newResourceKey = createEntityKey()

        const contentResourceDataType: ResourceDataType['content'] =
          provideDataEvent.content.kind === 'link'
            ? { kind: 'link', url: provideDataEvent.content.url }
            : {
                kind: 'file',
                fsItem: await storeResourceFile(newResourceKey, provideDataEvent.content.rpcFile),
              }

        const imageResourceDataType: ResourceDataType['image'] =
          provideDataEvent.image?.kind === 'file'
            ? await saveResourceImage(
                newResourceKey,
                provideDataEvent.image.rpcFile,
              ).then<ImageUploaded>(res => ({
                kind: 'file',
                directAccessId: res.directAccessId,
              }))
            : map.db.providedImage_2_patchOrRpcFile(provideDataEvent.image) ?? null

        const resourceDataTypeMeta = await map.db.meta_2_db({
          ...DEFAULT_CONTEXT.doc.meta,
          ...provideDataEvent.meta,
        })
        const created = await createResource(
          {
            ...EMPTY_RESOURCE,
            ...resourceDataTypeMeta,
            image: imageResourceDataType,
            _key: newResourceKey,
          },
          contentResourceDataType,
        )
        if (!created) {
          provideDataEvent.content.kind === 'file' && delResourceFile(newResourceKey)
          imageResourceDataType?.kind === 'file' && deleteImageFile(newResourceKey)
          throw new Error('resource creation failed for unknown reasons')
        }

        const [, doc] = map.db.doc_2_xsm(created)

        return { doc }
      },
      async MetaGenerator() {
        return {
          generetedResourceEdits: {
            resourceEdits: {
              meta: {
                title: 'test generated title',
                description: 'test generated description',
              },
            },
          },
        }
      },
      async ModeratePublishingResource() {
        return { notPassed: false }
      },
      async ScheduleDestroy() {
        return true
      },
      async StoreResourceEdits(context, { edits }) {
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )
        // TODO: VALIDATE ( likely in action, with context.validationConfigs? )

        const imagePatch =
          edits.image?.kind === 'file'
            ? undefined
            : map.db.providedImage_2_patchOrRpcFile(edits.image)

        const resourceDataTypeMeta = map.db.meta_2_db({ ...context.doc.meta, ...edits.meta })
        const patchRes = await patchResource(context.doc.id.resourceKey, {
          ...resourceDataTypeMeta,
          image: imagePatch,
        })
        if (!patchRes) {
          throw new Error('patchResource failed for unknown reasons')
        }
        if (edits.image?.kind === 'file') {
          await setResourceImage(context.doc.id.resourceKey, edits.image.rpcFile)
        }

        const [, doc] = map.db.doc_2_xsm(patchRes.patched)
        const res: Actor_StoreResourceEdits_Data = {
          doc,
        }
        return res
      },
    },
    actions: {
      notify_creator(/* _, ev */) {
        //@ALE: TBD
        console.log('notify_creator' /* , ev.type */)
      },
      destroy_all_data(context) {
        const resourceKey = context.doc.id.resourceKey
        if (resourceKey === initialContext.doc.id.resourceKey) {
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
  })
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
