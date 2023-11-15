import type { Context, Issuer, MetaEdits, Refs, StateName } from '@moodlenet/core-domain/resource'
import {
  DEFAULT_CONTEXT,
  EdResourceMachine,
  stateMatcher,
  SYSTEM_ISSUER,
  UNAUTHENTICATED_ISSUER,
} from '@moodlenet/core-domain/resource'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import {
  createResource,
  delResource,
  delResourceFile,
  EMPTY_RESOURCE,
  fromXsm,
  getImageLogicalFilename,
  getResource,
  patchResource,
  publicFiles,
  setResourceImage,
  storeResourceFile,
  toXsm,
} from '@moodlenet/ed-resource/server'
import type { AccessEntitiesRecordType } from '@moodlenet/system-entities/server'
import { createEntityKey, getCurrentSystemUser } from '@moodlenet/system-entities/server'
import { interpret } from 'xstate'
import { verifyCurrentTokenCtx } from '../../srv/web-user.mjs'

async function reviveStateAndContext(
  res:
    | { type: 'create' }
    | { type: 'data'; data: AccessEntitiesRecordType<ResourceDataType, unknown, any> }
    | { type: 'key'; key: string },
): Promise<
  [StateName, Context, AccessEntitiesRecordType<ResourceDataType, unknown, any> | undefined]
> {
  if (res.type === 'create') {
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
    res.type === 'data'
      ? res.data
      : res.type === 'key'
      ? await getResource(res.key, {
          // projectAccess: ['u', 'd'],
          // project: {
          //   canPublish: canPublish(),
          //   isCreator: isCurrentUserCreatorOfCurrentEntity(),
          //   contributor: creatorUserInfoAqlProvider(),
          // },
        })
      : (() => {
          throw 'never'
        })()
  if (!resourceRecord) {
    return [
      'No-Access',
      {
        ...DEFAULT_CONTEXT,
        issuer: await getIssuer(['creator', false]),
        noAccessReason: 'not available',
      },
      undefined,
    ]
  }

  const [state, meta] = toXsm.resourceMeta(resourceRecord.entity)

  //   const { /* draftValid, */ publishable } = draftFormalValidation({
  //     draft,
  //     validationConfigs,
  //   })
  //   return [
  //     state,
  //     {
  //       draft,
  //       issuer,
  //       validationConfigs,
  //       published: publishable,
  //       identifiers: { resourceKey },
  //     },
  //     resourceRecord,
  //   ] as const
  // }

  return [
    state,

    {
      meta,
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
      'Storing-New-Content',
      'No-Access',
      'Destroyed',
    ]
    if (noSaveStates.some(stateMatches)) {
      return // no-op
    }

    await patchResource(initialContext.meta?.references.id.resourceKey, {
      lifecycleState: state.toStrings()[0] as StateName,
    })
  })

  return {
    interpreter,
    machine,
    data: resourceRecord,
  }
}
async function getImagePatch(
  resourceKey: string,
  maybeImage: MetaEdits['image'],
): Promise<{ image?: Refs['image'] }> {
  if (!maybeImage || maybeImage === 'no-change') {
    return {}
  }
  if (maybeImage === 'remove') {
    await setResourceImage(resourceKey, null)
    return { image: null }
  }

  if (maybeImage.kind === 'file') {
    const resp = await setResourceImage(resourceKey, maybeImage.rpcFile)
    if (!resp || resp.patched.image?.kind !== 'file') {
      // throw 'never' ?
      return {}
    }
    return { image: { kind: 'file', ref: resp.patched.image } }
  } else {
    return { image: { kind: 'link', ref: maybeImage, url: maybeImage.url } }
  }
}
function configureMachine(initialContext: Context) {
  return EdResourceMachine.withConfig(
    {
      services: {
        async StoreNewResource(_, createEvent) {
          const newResourceKey = createEntityKey()
          const resourceContentDb: ResourceDataType['content'] =
            createEvent.content.kind === 'link'
              ? { kind: 'link', url: createEvent.content.url }
              : {
                  kind: 'file',
                  fsItem: await storeResourceFile(newResourceKey, createEvent.content.rpcFile),
                }

          const created = await createResource(
            {
              _key: newResourceKey,
              ...EMPTY_RESOURCE,
              ...fromXsm.resourceData(createEvent.initialMeta, 'Checking-In-Content'),
            },
            resourceContentDb,
          )
          const content: ResourceContent =
            resourceContentDb.kind === 'file'
              ? {
                  kind: 'file',
                  ref: resourceContentDb,
                }
              : {
                  kind: 'link',
                  ref: resourceContentDb,
                  url: resourceContentDb.url,
                }
          if (!created) {
            throw new Error('resource creation failed for unknown reasons')
          }
          return { resourceKey: created._key, content }
        },
      },
      actions: {
        notify_creator(_, ev) {
          //@ALE: TBD
          console.log('notify_creator', ev.type)
        },
        destroy_all_data() {
          destroyAllData(initialContext.meta.references.id.resourceKey)
        },
      },
      guards: {} as any,
    },
    initialContext,
  )
}

async function destroyAllData(resourceKey: string) {
  const delResult = await delResource(resourceKey)
  if (!delResult) {
    return
  }
  const imageLogicalFilename = getImageLogicalFilename(resourceKey)
  await publicFiles.del(imageLogicalFilename)
  if (delResult.entity.content?.kind === 'file') {
    await delResourceFile(resourceKey)
  }
  return
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

// declare const verifyCurrentTokenCtx :any

// export async function createNewResource(content: ProvidedCreationContent) {
//   const IDENTIFIERS_CREATING_PLACEHOLDER = {
//     resourceKey: 'resourceKey temp placeholder to keep type consistency',
//   } as const
//   const CONTENT_CREATING_PLACEHOLDER = {
//     kind: 'link',
//     url: 'creating ... temp placeholder to keep type consistency',
//   } as const
//   const issuer: Issuer = await getIssuer(['creator', true])
//   const [state, draft] = toXsm.draft({
//     ...EMPTY_RESOURCE,
//     content: CONTENT_CREATING_PLACEHOLDER,
//   })
//   // assert(
//   //   state !== '^^^NO-CONTENT^^^',
//   //   `toXsm.draft returned '^^^NO-CONTENT^^^' on create. this should never happen if db migration  and cleanup(delete resources without content) is done correctly, and refactored that bit`,
//   // )
//   assert(
//     state === 'Creating',
//     `toXsm.draft did not return state === 'Creating'. this should never happen`,
//   )
//   const machine = configureMachine({
//     draft,
//     issuer,
//     validationConfigs: getXsmValidationConfigs(),
//     identifiers: IDENTIFIERS_CREATING_PLACEHOLDER,
//   })
//   const createInterpreter = interpret(machine, {})
//   createInterpreter.start(state)

//   let snap = createInterpreter.getSnapshot()

//   if (matchState(snap, 'Access-Denied')) {
//     return 'unauthorized'
//   }
//   const provideContentEvent: Event = {
//     type: 'provide-content',
//     providedContent: content,
//   }
//   if (!snap.can(provideContentEvent)) {
//     return 'invalid content'
//   }

//   createInterpreter.send(provideContentEvent)

//   await Promise.race([
//     waitFor(createInterpreter, nameMatcher('Content-Rejected')),
//     waitFor(createInterpreter, state => {
//       return (
//         matchState(state, 'Checking-In-Content') &&
//         state.context.identifiers !== IDENTIFIERS_CREATING_PLACEHOLDER &&
//         state.context.draft.content !== CONTENT_CREATING_PLACEHOLDER
//       )
//     }),
//   ])
//   snap = createInterpreter.getSnapshot()
//   createInterpreter.stop()
//   if (matchState(snap, 'Content-Rejected')) {
//     return {
//       success: false,
//       reason: snap.context.contentRejectedReason ?? 'unknown',
//     } as const
//   }

//   const { interpreter } = await reviveInterpreterAndMachine(snap.context.identifiers.resourceKey)
//   return {
//     success: true,
//     resourceKey: snap.context.identifiers.resourceKey,
//     interpreter,
//   } as const
// }
