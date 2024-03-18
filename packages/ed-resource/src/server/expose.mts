import type { PkgExposeDef, RpcFile } from '@moodlenet/core'
import {
  RpcStatus,
  assertRpcFileReadable,
  readableRpcFile,
  setRpcStatusCode,
} from '@moodlenet/core'
import { getWebappUrl } from '@moodlenet/react-app/server'
import {
  creatorUserInfoAqlProvider,
  getCurrentEntityUserIdentifier,
  isCurrentUserCreatorOfCurrentEntity,
} from '@moodlenet/system-entities/server'
import { waitFor } from 'xstate/lib/waitFor.js'
import { shell } from './shell.mjs'
// import { ResourceDataResponce, ResourceFormValues } from '../common.mjs'
import type {
  Event,
  Event_ProvideResourceEdits_Data,
  StateName,
} from '@moodlenet/core-domain/resource'
import { DEFAULT_CONTEXT, matchState, nameMatcher } from '@moodlenet/core-domain/resource'
import { getSubjectHomePageRoutePath } from '@moodlenet/ed-meta/common'
import { href } from '@moodlenet/react-app/common'
import { boolean, object } from 'yup'
import type { ResourceExposeType } from '../common/expose-def.mjs'
import type { EditResourceRespRpc, ResourceRpc } from '../common/types.mjs'
import { getResourceHomePageRoutePath } from '../common/webapp-routes.mjs'
import { canPublish } from './aql.mjs'
import { getImageAssetInfo } from './lib.mjs'
import {
  RESOURCE_DOWNLOAD_ENDPOINT,
  getResource,
  getResourceFile,
  getResourceFileUrl,
  getResourcesCountInSubject,
  getValidations,
  incrementResourceDownloads,
  searchResources,
  validationsConfigs,
} from './services.mjs'
import { stdEdResourceMachine } from './xsm/machines.mjs'
import * as map from './xsm/mappings/rpc.mjs'

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
        const [interpreter] = await stdEdResourceMachine({ by: 'data', data: resourceRecord })
        let snap = interpreter.getSnapshot()
        const { event, awaitNextState } = ((): { event: Event; awaitNextState: StateName } =>
          publish
            ? { awaitNextState: 'Published', event: { type: 'publish' } }
            : { awaitNextState: 'Unpublished', event: { type: 'unpublish' } })()
        if (!snap.can(event)) {
          interpreter.stop()
          return { done: false }
        }
        interpreter.send(event)

        await waitFor(interpreter, nameMatcher(awaitNextState))
        snap = interpreter.getSnapshot()
        interpreter.stop()

        return { done: true }
      },
    },
    'webapp/:action(cancel|start)/meta-autofill/:_key': {
      guard: () => void 0,
      fn: async (_, { _key, action }) => {
        action === 'start' && (await ensureUnpublish(_key))
        const resourceRecord = await getResource(_key, {
          project: {
            isCreator: isCurrentUserCreatorOfCurrentEntity(),
          },
        })
        if (!resourceRecord) {
          return { done: false }
        }
        const [interpreter] = await stdEdResourceMachine({
          by: 'data',
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
        const [interpreter] = await stdEdResourceMachine({
          by: 'data',
          data: resourceRecord,
        })
        const snap = interpreter.getSnapshot()
        interpreter.stop()
        if (matchState(snap, 'No-Access') || !resourceRecord) {
          return null
        }

        const image = getImageAssetInfo(snap.context.doc.image?.ref)

        const contentUrl =
          snap.context.doc.content.kind === 'file'
            ? await getResourceFileUrl({
                _key,
                rpcFile: snap.context.doc.content.ref.fsItem.rpcFile,
              })
            : snap.context.doc.content.ref.url

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
            value: snap.value.toString() as StateName,
            autofillSuggestions: {
              // image: snap.context.generatedData?.image
              //   ? { credits: null, location: snap.context.generatedData?.image.url }
              //   : null,
              meta: snap.context.generatedData?.meta
                ? map.meta_2_form({
                    title:
                      snap.context.doc.meta.title || snap.context.generatedData.meta.title || '',
                    description:
                      snap.context.doc.meta.description ||
                      snap.context.generatedData.meta.description ||
                      '',
                    language:
                      snap.context.doc.meta.language ??
                      snap.context.generatedData.meta.language ??
                      null,
                    level:
                      snap.context.doc.meta.level ?? snap.context.generatedData.meta.level ?? null,
                    license:
                      snap.context.doc.meta.license ??
                      snap.context.generatedData.meta.license ??
                      null,
                    originalPublicationInfo:
                      snap.context.doc.meta.originalPublicationInfo ??
                      snap.context.generatedData.meta.originalPublicationInfo ??
                      null,
                    subject:
                      snap.context.doc.meta.subject ??
                      snap.context.generatedData.meta.subject ??
                      null,
                    type:
                      snap.context.doc.meta.type ?? snap.context.generatedData.meta.type ?? null,
                    learningOutcomes: snap.context.doc.meta.learningOutcomes.length
                      ? snap.context.doc.meta.learningOutcomes
                      : snap.context.generatedData.meta.learningOutcomes ?? [],
                  })
                : null,
              // image: snap.context.generatedData?.image
              //   ? await map.image_2_assetInfo(snap.context.generatedData.image,_key)
              //   : null,
            },
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
      guard: async () => {
        // const { draftResourceValidationSchema } = await getValidations()
        // body.form = await draftResourceValidationSchema.validate(body?.form?.meta, {
        //   stripUnknown: true,
        // })
      },
      fn: async ({ form }, { _key }) => {
        // const resourceRecord = await getResource(_key)
        // const { interpreter } = await xsm.interpreterAndMachine(resourceRecord)
        if (!(form.meta || form.image)) {
          // const editResourceRespRpc: EditResourceRespRpc = {
          //   meta: map.meta_2_form(snap.context.doc.meta),
          //   image: getImageAssetInfo(snap.context.doc.image?.ref ?? null),
          // }
          // return editResourceRespRpc
          return null
        }
        const [interpreter] = await stdEdResourceMachine({
          by: 'key',
          key: _key,
        })
        let snap = interpreter.getSnapshot()
        const resourceMeta = form.meta
          ? map.resourceMetaForm_2_meta(form.meta)
          : snap.context.doc.meta

        const resourceEdits: Event_ProvideResourceEdits_Data = {
          edits: {
            meta: resourceMeta,
            image:
              form.image?.kind === 'file'
                ? {
                    kind: 'file',
                    size: form.image.file[0].size,
                    rpcFile: form.image.file[0],
                  }
                : form.image?.kind === 'no-change'
                ? {
                    kind: 'no-change',
                  }
                : form.image?.kind === 'remove'
                ? {
                    kind: 'remove',
                  }
                : { kind: 'no-change' },
          },
        }

        const provideEditsEvent: Event = { type: 'provide-resource-edits', ...resourceEdits }
        if (!snap.can(provideEditsEvent)) {
          // console.log('cannot provide edits', provideEditsEvent, snap.value, snap.context)
          interpreter.stop()
          return null
        }
        interpreter.send(provideEditsEvent)
        const storeEvent: Event = { type: 'store-edits', ...resourceEdits }
        interpreter.send(storeEvent)

        await waitFor(interpreter, nameMatcher('Unpublished'))
        snap = interpreter.getSnapshot()

        const editResourceRespRpc: EditResourceRespRpc = {
          meta: map.meta_2_form(snap.context.doc.meta),
          image: getImageAssetInfo(snap.context.doc.image?.ref ?? null),
        }
        interpreter.stop()
        return editResourceRespRpc
      },
      bodyWithFiles: {
        fields: {
          '.form.image.file': 1,
        },
        maxSize: validationsConfigs.imageMaxUploadSize,
      },
    },
    'basic/v1/create': {
      guard: async body => {
        const { draftResourceValidationSchema, contentValidationSchema } = await getValidations()
        await contentValidationSchema.validate({ content: [body?.resource].flat()[0] })
        await draftResourceValidationSchema.validate(body, {
          stripUnknown: true,
        })
      },
      fn: async ({ name, description, resource }) => {
        const resourceContent = [resource].flat()[0]
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }
        const [interpreter] = await stdEdResourceMachine({ by: 'create' })
        let snap = interpreter.getSnapshot()
        const provideNewResourceEvent: Event = {
          type: 'provide-new-resource',
          meta: {
            ...DEFAULT_CONTEXT.doc.meta,
            title: name,
            description,
          },
          content:
            'string' === typeof resourceContent
              ? { kind: 'link', url: resourceContent }
              : { kind: 'file', rpcFile: resourceContent, size: resourceContent.size },
        }
        interpreter.send(provideNewResourceEvent)

        snap = interpreter.getSnapshot()

        if (matchState(snap, 'No-Access')) {
          interpreter.stop()
          if (snap.context.noAccess?.reason === 'unauthorized') {
            throw RpcStatus('Unauthorized')
          }
          if (snap.context.contentRejected) {
            throw RpcStatus('Bad Request', snap.context.contentRejected.reason)
          }
          if (snap.context.resourceEdits?.errors) {
            throw RpcStatus('Bad Request', snap.context.resourceEdits.errors)
          }
          throw RpcStatus('Unauthorized', 'unknown')
        }

        interpreter.send('store-new-resource')

        await waitFor(interpreter, nameMatcher(['Unpublished', 'Autogenerating-Meta']))
        snap = interpreter.getSnapshot()

        const newDoc = snap.context.doc
        const contentUrl =
          newDoc.content.kind === 'file'
            ? await getResourceFileUrl({
                _key: newDoc.id.resourceKey,
                rpcFile: newDoc.content.ref.fsItem.rpcFile,
              })
            : newDoc.content.url

        setRpcStatusCode('Created')
        interpreter.stop()
        snap = interpreter.getSnapshot()
        return {
          _key: newDoc.id.resourceKey,
          name: newDoc.meta.title,
          description: newDoc.meta.description,
          homepage: getWebappUrl(
            getResourceHomePageRoutePath({ _key: newDoc.id.resourceKey, title: newDoc.meta.title }),
          ),
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
        await ensureUnpublish(_key)
        const [interpreter] = await stdEdResourceMachine({ by: 'key', key: _key })

        interpreter.send('trash')
        await waitFor(interpreter, nameMatcher('Destroyed'))
        interpreter.stop()
        return
      },
    },
    'webapp/create': {
      guard: async body => {
        const { contentValidationSchema } = await getValidations()
        const validatedContent = await contentValidationSchema.validate(
          { content: body?.content?.[0] },
          { stripUnknown: true },
        )
        body.content = [validatedContent.content]
      },
      async fn({ content: [resourceContent] }) {
        if (!resourceContent) {
          throw RpcStatus('Bad Request')
        }

        const [interpreter] = await stdEdResourceMachine({ by: 'create' })
        let snap = interpreter.getSnapshot()
        // console.log({ resourceContent })
        const provideNewResourceEvent: Event = {
          type: 'provide-new-resource',
          content:
            'string' === typeof resourceContent
              ? { kind: 'link', url: resourceContent }
              : { kind: 'file', rpcFile: resourceContent, size: resourceContent.size },
        }
        interpreter.send(provideNewResourceEvent)
        if (matchState(snap, 'No-Access')) {
          interpreter.stop()
          return null
        }
        interpreter.send('store-new-resource')

        await waitFor(interpreter, nameMatcher(['Unpublished', 'Autogenerating-Meta']))
        snap = interpreter.getSnapshot()

        interpreter.stop()
        return { resourceKey: snap.context.doc.id.resourceKey }
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
        const fsItem = await getResourceFile(_key)
        if (!fsItem) {
          throw RpcStatus('Not Found')
        }
        const readable = await assertRpcFileReadable(fsItem.rpcFile)

        readable.on('end', async () => {
          const userId = await getCurrentEntityUserIdentifier()
          shell.events.emit('downloaded', { resourceKey: _key, userId })
          userId && incrementResourceDownloads({ _key })
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
          filterAs,
        },
      ) {
        const { endCursor, list } = await searchResources({
          limit,
          sortType,
          text,
          after,
          strictFilters: filterAs === 'strict',
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

async function ensureUnpublish(_key: string) {
  const [interpreter] = await stdEdResourceMachine({ by: 'key', key: _key })
  const snap = interpreter.getSnapshot()
  const event =
    matchState(snap, 'Published') || matchState(snap, 'Publish-Rejected')
      ? 'unpublish'
      : matchState(snap, 'Autogenerating-Meta')
      ? 'cancel-meta-generation'
      : matchState(snap, 'Meta-Suggestion-Available')
      ? ({ type: 'provide-resource-edits', edits: {} } as const)
      : null
  if (event) {
    interpreter.send(event)
    await waitFor(interpreter, nameMatcher('Unpublished'))
  }
  interpreter.stop()
  return new Promise(r => setTimeout(r, 300))
}
