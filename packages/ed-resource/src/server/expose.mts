import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import {
  assertRpcFileReadable,
  readableRpcFile,
  RpcStatus,
  setRpcStatusCode,
} from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import {
  creatorUserInfoAqlProvider,
  getCurrentSystemUser,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
import { waitFor } from 'xstate/lib/waitFor.js'
import { shell } from './shell.mjs'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import type {
  Event,
  Event_EditMeta_Data,
  Event_ProvideContent_Data,
  StateName,
} from '@moodlenet/core-domain/resource'
import { matchState, nameMatcher } from '@moodlenet/core-domain/resource'
import { getSubjectHomePageRoutePath } from '@moodlenet/ed-meta/common'
import { href } from '@moodlenet/react-app/common'
import { boolean, object } from 'yup'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import type { EditResourceRespRpc, ResourceRpc } from '../common/types.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { stateMeta2ResourceData } from './exports.mjs'
import { resourceFiles } from './init/fs.mjs'
import { getImageAssetInfo } from './lib.mjs'
import {
  getResource,
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
        const resourceRecord = await getResource(_key)
        if (!resourceRecord) {
          return { done: false }
        }
        const { interpreter } = await xsm.interpreterAndMachine({
          type: 'data',
          data: resourceRecord,
        })
        let snap = interpreter.getSnapshot()
        if (!snap.can(publish ? 'request-publish' : 'unpublish')) {
          interpreter.stop()
          return { done: false }
        }
        interpreter.send(publish ? 'request-publish' : 'unpublish')

        snap = interpreter.getSnapshot()

        await waitFor(interpreter, nameMatcher(publish ? 'Published' : 'Unpublished'))

        interpreter.stop()
        return { done: true }
      },
    },
    'webapp/:action(cancel|start)/meta-autofill/:_key': {
      guard: () => void 0,
      fn: async (_, { _key, action }) => {
        const resourceRecord = await getResource(_key, {
          project: {
            isCreator: isCurrentUserCreatorOfCurrentEntity(),
          },
        })
        if (!resourceRecord) {
          return { done: false }
        }
        const { interpreter } = await xsm.interpreterAndMachine({
          type: 'data',
          data: resourceRecord,
        })
        const ev = action === 'cancel' ? `cancel-meta-generation` : `request-meta-generation`
        const done = interpreter.getSnapshot().can(ev)
        interpreter.send(ev)
        interpreter.stop()
        return { done }
      },
    },

    'webapp/get/:_key': {
      guard: () => void 0,
      fn: async (_, { _key }) => {
        const resourceRecord = await getResource(_key, {
          projectAccess: ['u', 'd'],
          project: {
            canPublish: canPublish(),
            isCreator: isCurrentUserCreatorOfCurrentEntity(),
            contributor: creatorUserInfoAqlProvider(),
          },
        })
        if (!resourceRecord) {
          return null
        }
        const { interpreter } = await xsm.interpreterAndMachine({
          type: 'data',
          data: resourceRecord,
        })
        const snap = interpreter.getSnapshot()
        if (matchState(snap, 'No-Access') || !resourceRecord) {
          return null
        }
        const image = getImageAssetInfo(snap.context.meta.references.image?.ref)

        const contentUrl =
          snap.context.meta.references.content.kind === 'file'
            ? await getResourceFileUrl({
                _key,
                rpcFile: snap.context.meta.references.content.ref.fsItem.rpcFile,
              })
            : snap.context.meta.references.content.ref.url

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
            contentType: resourceRecord.entity.content.kind,
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
        // const resourceRecord = await getResource(_key)
        // const { interpreter } = await xsm.interpreterAndMachine(resourceRecord)
        const { interpreter } = await xsm.interpreterAndMachine({ type: 'key', key: _key })
        const snap = interpreter.getSnapshot()

        const metaEdits: Event_EditMeta_Data = {
          metaEdits: {
            title: values.title,
            description: values.description,
            language: values.language ? { code: values.language } : undefined,
            learningOutcomes: (values.learningOutcomes ?? [])
              .filter(({ sentence }) => !!sentence)
              .map(value => ({ value })),
            level: values.level ? { code: values.level } : undefined,
            license: values.license ? { code: values.license } : undefined,
            subject: values.subject ? { code: values.subject } : undefined,
            type: values.type ? { code: values.type } : undefined,
            originalPublicationInfo: Number(values.year)
              ? { month: Number(values.month || 1), year: Number(values.year) }
              : undefined,

            image:
              !values.image || values.image.type === 'no-change'
                ? 'no-change'
                : values.image.type === 'remove'
                ? 'remove'
                : values.image.type === 'file'
                ? {
                    kind: 'file',
                    rpcFile: values.image.file[0],
                  }
                : 'no-change',
          },
        }

        const event: Event = { type: 'edit-meta', ...metaEdits }
        if (!snap.can(event)) {
          return null
        }
        interpreter.send(event)

        await waitFor(interpreter, nameMatcher('Unpublished'))
        const state = interpreter.getSnapshot()

        const { image, lifecycleState, ...resourceData } = stateMeta2ResourceData(
          state.context.meta,
          String(state.value) as StateName,
        )
        lifecycleState
        const editResourceRespRpc: EditResourceRespRpc = {
          ...resourceData,
          image: getImageAssetInfo(image),
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
        const { interpreter } = await xsm.interpreterAndMachine({ type: 'create' })
        let snap = interpreter.getSnapshot()
        const contentEventData: Event_ProvideContent_Data = {
          initialMeta: {
            title: name,
            description,
          },
          content:
            'string' === typeof resourceContent
              ? { kind: 'link', url: resourceContent }
              : { kind: 'file', rpcFile: resourceContent },
        }
        const provideContentEvent: Event = { type: 'provide-content', ...contentEventData }
        if (!snap.can(provideContentEvent)) {
          interpreter.stop()
          throw RpcStatus('Unauthorized')
        }
        interpreter.send(provideContentEvent)

        await waitFor(interpreter, nameMatcher(['Checking-In-Content', 'Autogenerating-Meta']))
        snap = interpreter.getSnapshot()

        if (matchState(snap, 'Checking-In-Content')) {
          throw RpcStatus('Bad Request', snap.context.contentRejectedReason)
        }
        const newMeta = snap.context.meta
        const newResourceKey = newMeta.references.id.resourceKey
        const contentUrl =
          newMeta.references.content.kind === 'file'
            ? await getResourceFileUrl({
                _key: newResourceKey,
                rpcFile: newMeta.references.content.ref.fsItem.rpcFile,
              })
            : newMeta.references.content.url

        setRpcStatusCode('Created')
        return {
          _key: newResourceKey,
          description,
          homepage: getWebappUrl(
            getResourceHomePageRoutePath({ _key: newResourceKey, title: name }),
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
        const { interpreter } = await xsm.interpreterAndMachine({ type: 'key', key: _key })
        interpreter.send('trash')
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

        const { interpreter } = await xsm.interpreterAndMachine({ type: 'create' })
        let snap = interpreter.getSnapshot()
        const contentEventData: Event_ProvideContent_Data = {
          content:
            'string' === typeof resourceContent
              ? { kind: 'link', url: resourceContent }
              : { kind: 'file', rpcFile: resourceContent },
        }
        const provideContentEvent: Event = { type: 'provide-content', ...contentEventData }
        if (!snap.can(provideContentEvent)) {
          interpreter.stop()
          throw RpcStatus('Unauthorized')
        }
        interpreter.send(provideContentEvent)

        await waitFor(interpreter, nameMatcher(['Checking-In-Content', 'Autogenerating-Meta']))
        snap = interpreter.getSnapshot()

        if (matchState(snap, 'Checking-In-Content')) {
          // throw RpcStatus('Bad Request', snap.context.contentRejectedReason)
          return null
        }
        const newMeta = snap.context.meta
        const newResourceKey = newMeta.references.id.resourceKey

        return { resourceKey: newResourceKey }
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
