import { readableRpcFile } from '@moodlenet/core'
import { resource } from '@moodlenet/core-domain'
import type { ResourceContent } from '@moodlenet/core-domain/resource/lifecycle'
import type { ResourceDataType } from '@moodlenet/ed-resource/server'
import {
  createResource,
  delResource,
  delResourceFile,
  EMPTY_RESOURCE,
  getImageLogicalFilename,
  getResource,
  patchResource,
  publicFiles,
  storeResourceFile,
  validationsConfigs,
} from '@moodlenet/ed-resource/server'
import { createEntityKey, getCurrentSystemUser } from '@moodlenet/system-entities/server'
import assert from 'assert'
import { createReadStream } from 'fs'
import { interpret } from 'xstate'
import { waitFor } from 'xstate/lib/waitFor.js'
import { verifyCurrentTokenCtx } from '../../exports.mjs'
import * as fromXsm from './mappings/from-xsm.mjs'
import * as toXsm from './mappings/to-xsm.mjs'

export async function createNewResource(content: resource.lifecycle.ProvidedResourceContent) {
  const IDENTIFIERS_CREATING_PLACEHOLDER = {
    resourceKey: 'resourceKey temp placeholder to keep type consistency',
  } as const
  const CONTENT_CREATING_PLACEHOLDER = {
    kind: 'link',
    url: 'creating ... temp placeholder to keep type consistency',
  } as const
  const issuer: resource.lifecycle.Issuer = await getIssuer(['creator', true])
  const [state, draft] = toXsm.draft({
    ...EMPTY_RESOURCE,
    content: CONTENT_CREATING_PLACEHOLDER,
  })
  assert(
    state !== '^^^NO-CONTENT^^^',
    `toXsm.draft returned '^^^NO-CONTENT^^^' on create. this should never happen if db migration  and cleanup(delete resources without content) is done correctly, and refactored that bit`,
  )
  assert(
    state === 'Creating',
    `toXsm.draft did not return state === 'Creating'. this should never happen`,
  )
  const machine = configureMachine({
    draft,
    issuer,
    validationConfigs: getXsmValidationConfigs(),
    identifiers: IDENTIFIERS_CREATING_PLACEHOLDER,
  })
  const interpreter = interpret(machine, {})
  interpreter.start(state)

  let snap = interpreter.getSnapshot()

  if (resource.lifecycle.matchState(snap, 'Access-Denied')) {
    return 'cannot create'
  }
  const provideContentEvent: resource.lifecycle.Event = {
    type: 'provide-content',
    providedContent: content,
  }
  if (!snap.can(provideContentEvent)) {
    return 'invalid content'
  }

  await Promise.race([
    waitFor(interpreter, resource.lifecycle.nameMatcher('Content-Rejected')),
    waitFor(
      interpreter,
      state =>
        resource.lifecycle.matchState(state, 'Autogenerating-Meta') &&
        state.context.identifiers !== IDENTIFIERS_CREATING_PLACEHOLDER &&
        state.context.draft.content !== CONTENT_CREATING_PLACEHOLDER,
    ),
  ])
  snap = interpreter.getSnapshot()
  if (resource.lifecycle.matchState(snap, 'Content-Rejected')) {
    return {
      success: false,
      reason: snap.context.contentRejectedReason ?? 'unknown',
    } as const
  }

  const resourceKey = snap.context.identifiers.resourceKey

  interpreter.send('cancel-meta-autogen')
  return {
    success: true,
    resourceKey,
  } as const
}

async function reviveStateAndContext(
  resourceKey: string,
): Promise<[resource.lifecycle.StateName, resource.lifecycle.Context]> {
  const validationConfigs = getXsmValidationConfigs()
  const resourceRecord = await getResource(resourceKey)
  const issuer: resource.lifecycle.Issuer = await getIssuer(
    resourceRecord?.meta.creatorEntityId
      ? ['creator-id', resourceRecord.meta.creatorEntityId]
      : ['creator', false],
  )
  if (!resourceRecord) {
    return [
      'Access-Denied',
      {
        draft: null as any,
        issuer,
        readAccessDeniedReason: 'not available',
        validationConfigs,
        identifiers: { resourceKey },
      },
    ]
  }

  const [state, draft] = toXsm.draft(resourceRecord.entity)
  // FIXME: this should never happen if db migration
  // and cleanup(delete resources without content) is done correctly
  if (state === '^^^NO-CONTENT^^^') {
    await destroyAllData(resourceKey)
    return [
      'Access-Denied',
      {
        draft: null as any,
        issuer,
        readAccessDeniedReason: 'not available',
        validationConfigs,
        identifiers: { resourceKey },
      },
    ]
  }

  const { /* draftValid, */ publishable } = resource.lifecycle.draftFormalValidation({
    draft,
    validationConfigs,
  })
  return [
    state,
    {
      draft,
      issuer,
      validationConfigs,
      published: publishable,
      identifiers: { resourceKey },
    },
  ]
}

export async function reviveInterpreterAndMachine(resourceKey: string) {
  const [state, initialContext] = await reviveStateAndContext(resourceKey)
  const machine = configureMachine(initialContext)
  const interpreter = interpret(machine, {})
  interpreter.start(state)
  interpreter.subscribe(async state => {
    const stateMatcher = resource.lifecycle.stateMatcher(state)
    const noOpStates: resource.lifecycle.StateName[] = ['Creating', 'Access-Denied']
    if (noOpStates.some(stateMatcher)) {
      return // no-op
    }

    if (stateMatcher('Destroyed')) {
      destroyAllData(resourceKey)
      return
    }

    const patch = fromXsm.patch(
      state.context.draft,
      state.toStrings()[0] as resource.lifecycle.StateName,
    )
    await patchResource(resourceKey, patch)
  })
  return {
    interpreter,
    machine,
  }
}

function configureMachine(initialContext: resource.lifecycle.Context) {
  return resource.lifecycle.EdResourceMachine.withConfig(
    {
      services: {
        async CreateNewResource({ draft }, { providedContent }) {
          const newResourceKey = createEntityKey()
          const resourceContentDb: ResourceDataType['content'] =
            providedContent.kind === 'link'
              ? { kind: 'link', url: providedContent.url }
              : {
                  kind: 'file',
                  fsItem: await storeResourceFile(
                    newResourceKey,
                    readableRpcFile(
                      {
                        name: providedContent.info.name,
                        size: providedContent.info.size,
                        type: providedContent.info.type,
                      },
                      () => createReadStream(providedContent.tmpFsLocation),
                    ),
                  ),
                }

          const created = await createResource(
            fromXsm.patch(draft, 'Checking-In-Content'),
            resourceContentDb,
          )
          const content: ResourceContent =
            resourceContentDb.kind === 'file'
              ? {
                  kind: 'file',
                  content: resourceContentDb,
                }
              : {
                  kind: 'link',
                  url: resourceContentDb.url,
                }
          if (!created) {
            throw new Error('resource creation failed for unknown reasons')
          }
          return { resourceKey: created._key, content }
        },
      },
      actions: {
        cancel_meta_autogen_process() {
          //@ALE: TBD
        },
        notify_creator() {
          //@ALE: TBD
        },
        schedule_destroy() {
          //@ALE: TBD
        },
        cancel_destroy_schedule() {
          //@ALE: TBD
        },
        destroy_all_data() {
          destroyAllData(initialContext.identifiers.resourceKey)
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

function getXsmValidationConfigs(): resource.lifecycle.DocFormalValidationConfigs {
  return {
    imageMaxUploadBytesSize: validationsConfigs.imageMaxUploadSize,
    contentMaxUploadBytesSize: validationsConfigs.contentMaxUploadSize,
    descriptionLength: validationsConfigs.descriptionLength,
    titleLength: validationsConfigs.titleLength,
    learningOutcomes: validationsConfigs.learningOutcomes,
  }
}

// type ResourceEntityDoc = Awaited<ReturnType<typeof getResource>>
async function getIssuer([paramType, val]:
  | ['creator-id', string]
  | ['creator', boolean]): Promise<resource.lifecycle.Issuer> {
  const currentSystemUser = await getCurrentSystemUser()

  return currentSystemUser.type === 'root' || currentSystemUser.type === 'pkg'
    ? resource.lifecycle.SystemIssuer
    : currentSystemUser.type === 'entity'
    ? await (async (): Promise<resource.lifecycle.Issuer> => {
        const currentWebUser = await verifyCurrentTokenCtx()
        if (!currentWebUser) {
          return resource.lifecycle.AnonIssuer
        } else if (currentWebUser.payload.isRoot) {
          return resource.lifecycle.SystemIssuer
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
    : resource.lifecycle.AnonIssuer
}
