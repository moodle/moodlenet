import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import {
  assertRpcFileReadable,
  readableRpcFile,
  RpcStatus,
  setRpcStatusCode,
} from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import { getCurrentSystemUser, setPkgCurrentUser } from '@moodlenet/system-entities/server'
import { waitFor } from 'xstate/lib/waitFor.js'
import { shell } from './shell.mjs'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import type { EditDraftForm } from '@moodlenet/core-domain/resource/lifecycle'
import { matchState, nameMatcher } from '@moodlenet/core-domain/resource/lifecycle'
import { getSubjectHomePageRoutePath } from '@moodlenet/ed-meta/common'
import { href } from '@moodlenet/react-app/common'
import { boolean, object } from 'yup'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import type { EditResourceRespRpc, ResourceRpc } from '../common/types.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { resourceFiles } from './init/fs.mjs'
import { getImageAssetInfo } from './lib.mjs'
import {
  getResourceFileUrl,
  getResourceLogicalFilename,
  getResourcesCountInSubject,
  getValidations,
  incrementResourceDownloads,
  RESOURCE_DOWNLOAD_ENDPOINT,
  searchResources,
  validationsConfigs,
} from './services.mjs'
import xsm from './xsm/machinery.mjs'

export type FullResourceExposeType = PkgExposeDef<ResourceExposeType & ServerResourceExposeType>

export const expose = await shell.expose<FullResourceExposeType>({
  rpc: {
    'webapp/get-configs': {
      guard: () => void 0,
      async fn() {
        const { config } = await getValidations()
        return { validations: config }
      },
    },
    'webapp/set-is-published/:_key': {
      guard: _ =>
        object({
          publish: boolean().required(),
        }).isValid(_),
      fn: async ({ publish }, { _key }) => {
        const { interpreter } = await xsm.reviveInterpreterAndMachine(_key)
        let snap = interpreter.getSnapshot()
        if (!(publish ? snap.can('request-publish') : snap.can('set-draft'))) {
          return { done: false }
        }
        interpreter.send(publish ? 'request-publish' : 'set-draft')

        snap = interpreter.getSnapshot()
        shell.initiateCall(async () => {
          await setPkgCurrentUser()
          interpreter.send('accept-publishing')
        })

        return { done: true }
      },
    },
    'webapp/:action(cancel|start)/meta-autofill/:_key': {
      guard: () => void 0,
      fn: async (_, { _key, action }) => {
        const { interpreter } = await xsm.reviveInterpreterAndMachine(_key)
        const ev = action === 'cancel' ? `cancel-meta-autogen` : `autogenerate-meta`
        const done = interpreter.getSnapshot().can(ev)
        interpreter.send(ev)
        return { done }
      },
    },

    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const { interpreter, resourceRecord } = await xsm.reviveInterpreterAndMachine(_key)

        const snap = interpreter.getSnapshot()
        if (matchState(snap, 'Access-Denied') || !resourceRecord) {
          return null
        }
        const image = getImageAssetInfo(snap.context.draft.image?.ref)

        const contentUrl =
          snap.context.draft.content.kind === 'file'
            ? await getResourceFileUrl({
                _key,
                rpcFile: snap.context.draft.content.ref.fsItem.rpcFile,
              })
            : snap.context.draft.content.ref.url

        const resourceRpc: ResourceRpc = {
          contributor: {
            avatarUrl: resourceRecord.contributor.iconUrl,
            creatorProfileHref: {
              url: resourceRecord.contributor.homepagePath,
              ext: false,
            },
            displayName: resourceRecord.contributor.name,
            timeSinceCreation: resourceRecord.meta.created,
          },
          resourceForm: {
            description: resourceRecord.entity.description,
            title: resourceRecord.entity.title,
            license: resourceRecord.entity.license,
            subject: resourceRecord.entity.subject,
            language: resourceRecord.entity.language,
            level: resourceRecord.entity.level,
            month: resourceRecord.entity.month,
            year: resourceRecord.entity.year,
            type: resourceRecord.entity.type,
            learningOutcomes: resourceRecord.entity.learningOutcomes,
          },
          data: {
            contentType: resourceRecord.entity.content?.kind ?? null,
            contentUrl,
            downloadFilename:
              resourceRecord.entity.content?.kind === 'file'
                ? resourceRecord.entity.content.fsItem.rpcFile.name
                : null,
            id: resourceRecord.entity._key,
            mnUrl: getWebappUrl(
              getResourceHomePageRoutePath({ _key, title: resourceRecord.entity.title }),
            ),
            image,
            subjectHref: resourceRecord.entity.subject
              ? href(
                  getSubjectHomePageRoutePath({
                    _key: resourceRecord.entity.subject,
                    title: resourceRecord.entity.subject,
                  }),
                )
              : null,
          },
          state: {
            isPublished: resourceRecord.entity.published,
            autofillState: matchState(snap, 'Autogenerating-Meta') ? 'ai-generation' : undefined,
          },
          access: {
            canDelete: !!resourceRecord.access.d,
            canEdit: !!resourceRecord.access.u,
            canPublish: resourceRecord.canPublish,
            isCreator: resourceRecord.isCreator,
          },
        }

        return resourceRpc
      },
    },
    'webapp/edit/:_key': {
      guard: async body => {
        const { draftResourceValidationSchema } = await getValidations()
        body.values = await draftResourceValidationSchema.validate(body?.values, {
          stripUnknown: true,
        })
      },
      fn: async ({ values }, { _key }) => {
        const { interpreter } = await xsm.reviveInterpreterAndMachine(_key)
        const snap = interpreter.getSnapshot()
        const updateWith: Partial<EditDraftForm> = {
          description: values.description,
          language: values.language,
          learningOutcomes: (values.learningOutcomes ?? []).filter(({ sentence }) => !!sentence),
          level: values.level,
          license: values.license,
          month: values.month,
          year: values.year,
          title: values.title,
          subject: values.subject,
          type: values.type,
          image:
            !values.image || values.image.type === 'no-change'
              ? { type: 'no-change' }
              : values.image.type === 'remove'
              ? { type: 'remove' }
              : values.image.type === 'file'
              ? {
                  type: 'update',
                  provide: {
                    kind: 'file',
                    rpcFile: values.image.file[0],
                    info: values.image.file[0],
                  },
                }
              : { type: 'no-change' },
        }

        if (!snap.can({ type: 'edit-draft-meta', updateWith })) {
          return null
        }
        interpreter.send({ type: 'edit-draft-meta', updateWith })

        /* 
wont work .. 
        await waitFor(interpreter, state => {
          console.log(`--`, state.value, state.event, state.context.draft)
          return state.event.type !== 'edit-draft-meta' && nameMatcher('Draft')(state)
        })
 */
        /* 
 this neither
        const editedInterpreter = await xsm.reviveInterpreterAndMachine(_key)
 */
        const {
          context: { draft },
        } = /* editedI */ interpreter.getSnapshot()

        const editResourceRespRpc: EditResourceRespRpc = {
          description: draft.description,
          language: draft.language ?? '',
          image: getImageAssetInfo(draft.image?.ref),
          learningOutcomes: draft.learningOutcomes ?? '',
          level: draft.level ?? '',
          license: draft.license ?? '',
          month: draft.month ?? '',
          subject: draft.subject ?? '',
          title: draft.title ?? '',
          type: draft.type ?? '',
          year: draft.year ?? '',
        }
        return editResourceRespRpc
      },
      bodyWithFiles: {
        fields: {
          '.values.image.file': 1,
        },
        maxSize: validationsConfigs.imageMaxUploadSize,
      },
    },
    'basic/v1/create': {
      guard: async body => {
        const { draftResourceValidationSchema, draftContentValidationSchema } =
          await getValidations()
        await draftContentValidationSchema.validate({ content: body?.resource })
        await draftResourceValidationSchema.validate(body, {
          stripUnknown: true,
        })
      },
      fn: async ({ name, description, resource }) => {
        const resourceContent = [resource].flat()[0]
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }
        const createResponse = await xsm.createNewResource(
          'string' === typeof resourceContent
            ? { kind: 'link', url: resourceContent }
            : { kind: 'file', info: resourceContent, rpcFile: resourceContent },
        )
        if (createResponse === 'invalid content') {
          throw RpcStatus('Bad Request')
        }
        if (createResponse === 'unauthorized') {
          throw RpcStatus('Internal Server Error')
        }
        if (!createResponse.success) {
          throw new Error(createResponse.reason)
        }

        shell.initiateCall(async () => {
          await setPkgCurrentUser()
          createResponse.interpreter.send('accept-content')
        })

        const snap = createResponse.interpreter.getSnapshot()
        const contentUrl =
          snap.context.draft.content.kind === 'file'
            ? await getResourceFileUrl({
                _key: snap.context.identifiers.resourceKey,
                rpcFile: snap.context.draft.content.ref.fsItem.rpcFile,
              })
            : snap.context.draft.content.ref.url

        setRpcStatusCode('Created')
        return {
          _key: createResponse.resourceKey,
          description,
          homepage: getWebappUrl(
            getResourceHomePageRoutePath({ _key: createResponse.resourceKey, title: name }),
          ),
          name,
          url: contentUrl,
        }
      },
      bodyWithFiles: {
        fields: {
          '.resource': 1,
        },
        maxSize: validationsConfigs.contentMaxUploadSize,
      },
    },

    'webapp/trash/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const { interpreter } = await xsm.reviveInterpreterAndMachine(_key)
        interpreter.send('trash')
        waitFor(interpreter, nameMatcher('In-Trash')).finally(() => {
          interpreter.send('destroy')
        })
        return
      },
    },
    // 'webapp/set-image/:_key': {
    //   guard: async body => {
    //     const { imageValidationSchema } = await getValidations()
    //     const validatedImageOrNullish = await imageValidationSchema.validate(
    //       { image: body?.file?.[0] },
    //       { stripUnknown: true },
    //     )
    //     body.file = [validatedImageOrNullish]
    //   },
    //   async fn({ file: [uploadedRpcFile] }, { _key }) {
    //     const { interpreter, resourceRecord, machine } = await reviveInterpreterAndMachine(_key)
    //     if()
    //     const got = await getResource(_key, { projectAccess: ['u'] })

    //     if (!got?.access.u) {
    //       throw RpcStatus('Unauthorized')
    //     }
    //     const updateRes = await setResourceImage(_key, uploadedRpcFile)
    //     if (updateRes === false) {
    //       throw RpcStatus('Bad Request')
    //     }
    //     if (!updateRes) {
    //       return null
    //     }
    //     const imageUrl = updateRes.patched.image && getImageUrl(updateRes.patched.image)
    //     return imageUrl
    //   },
    //   bodyWithFiles: {
    //     fields: {
    //       '.file': 1,
    //     },
    //     maxSize: defaultImageUploadMaxSize,
    //   },
    // },
    'webapp/create': {
      guard: async body => {
        const { publishedContentValidationSchema } = await getValidations()
        const validatedContentOrNullish = await publishedContentValidationSchema.validate(
          { content: body?.content?.[0] },
          { stripUnknown: true },
        )
        body.content = [validatedContentOrNullish]
      },
      async fn({ content: [resourceContent] }) {
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }
        const createResponse = await xsm.createNewResource(
          'string' === typeof resourceContent
            ? { kind: 'link', url: resourceContent }
            : { kind: 'file', info: resourceContent, rpcFile: resourceContent },
        )
        if (createResponse === 'invalid content') {
          throw RpcStatus('Bad Request')
        }
        if (createResponse === 'unauthorized') {
          throw RpcStatus('Unauthorized')
        }
        if (!createResponse.success) {
          throw RpcStatus('Internal Server Error', createResponse.reason)
        }

        shell.initiateCall(async () => {
          await setPkgCurrentUser()
          const { interpreter } = await xsm.reviveInterpreterAndMachine(createResponse.resourceKey)
          interpreter.send('accept-content')
          setTimeout(() => {
            interpreter.send('autogenerated-meta')
          }, 30000)
        })

        return { resourceKey: createResponse.resourceKey }
      },
      bodyWithFiles: {
        fields: {
          '.content': 1,
        },
        maxSize: validationsConfigs.contentMaxUploadSize,
      },
    },
    'webapp/get-resources-count-in-subject/:subjectKey': {
      guard: () => void 0,
      async fn(_, { subjectKey }) {
        const count = await getResourcesCountInSubject({ subjectKey })
        return count ?? { count: 0 }
      },
    },
    [RESOURCE_DOWNLOAD_ENDPOINT]: {
      guard: () => void 0,
      async fn(_, { _key }: { _key: string }) {
        const resourceLogicalFilename = getResourceLogicalFilename(_key)
        const fsItem = await resourceFiles.get(resourceLogicalFilename)
        if (!fsItem) {
          throw RpcStatus('Not Found')
        }
        const readable = await assertRpcFileReadable(fsItem.rpcFile)

        readable.on('end', async () => {
          const currentSysUser = await getCurrentSystemUser()
          shell.events.emit('resource:downloaded', { resourceKey: _key, currentSysUser })
          incrementResourceDownloads({ _key })
        })
        return readableRpcFile({ ...fsItem.rpcFile }, () => readable)
      },
    },
    'webapp/search': {
      guard: () => void 0,
      async fn(
        _,
        __,
        {
          sortType,
          filterSubjects,
          filterLanguages,
          filterLevels,
          filterTypes,
          filterLicenses,
          limit,
          text,
          after,
        },
      ) {
        const { endCursor, list } = await searchResources({
          limit,
          sortType,
          text,
          after,
          filters: [
            ['subject', filterSubjects ? filterSubjects.split('|') : []],
            ['language', filterLanguages ? filterLanguages.split('|') : []],
            ['level', filterLevels ? filterLevels.split('|') : []],
            ['type', filterTypes ? filterTypes.split('|') : []],
            ['license', filterLicenses ? filterLicenses.split('|') : []],
          ],
        })
        return {
          list: list.map(({ entity: { _key } }) => ({ _key })),
          endCursor,
        }
      },
    },
  },
})

type ServerResourceExposeType = {
  rpc: {
    [RESOURCE_DOWNLOAD_ENDPOINT](
      body: null,
      params: { _key: string; filename: string },
    ): Promise<RpcFile>
    'basic/v1/create'(body: {
      name: string
      description: string
      resource: string | [RpcFile]
    }): Promise<{
      _key: string
      name: string
      description: string
      url: string
      homepage: string
    }>
  }
}
