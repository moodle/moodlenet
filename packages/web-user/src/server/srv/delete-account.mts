import { delCollection } from '@moodlenet/collection/server'
import { nameMatcher } from '@moodlenet/core-domain/resource'
import { jwt } from '@moodlenet/crypto/server'
import { stdEdResourceMachine } from '@moodlenet/ed-resource/server'
import {
  getCurrentSystemUser,
  setCurrentSystemUser,
  setPkgCurrentUser,
} from '@moodlenet/system-entities/server'
import assert from 'assert'
import { waitFor } from 'xstate/lib/waitFor.js'
import { Profile } from '../exports.mjs'
import { WebUserCollection } from '../init/arangodb.mjs'
import { shell } from '../shell.mjs'
import type { WebUserAccountDeletionToken, WebUserEvents } from '../types.mjs'
import { reduceToKnownFeaturedEntities } from './known-entity-types.mjs'
import {
  changeProfilePublisherPerm,
  entityFeatureAction,
  getProfileOwnKnownEntities,
  getProfileRecord,
  setProfileAvatar,
  setProfileBackgroundImage,
} from './profile.mjs'
import {
  getCurrentWebUserIds,
  getWebUser,
  isWebUserAccountDeletionToken,
  patchWebUser,
} from './web-user.mjs'

export async function deleteWebUserAccountConfirmedByToken(token: string) {
  const webUserAccountDeletionToken = await jwt.verify<WebUserAccountDeletionToken>(
    token,
    isWebUserAccountDeletionToken,
  )
  if (!webUserAccountDeletionToken) {
    return
  }
  return await shell.initiateCall(async () => {
    await setPkgCurrentUser()
    return _deleteWebUserAccountNow(webUserAccountDeletionToken.payload.webUserKey)
  })
}

export async function pkgDeletesWebUserAccountNow({ webUserKey }: { webUserKey: string }) {
  const currentSysUser = await getCurrentSystemUser()
  assert(currentSysUser.type === 'pkg')
  return adminDeletesWebUserAccountNow({ webUserKey })
}
export async function adminDeletesWebUserAccountNow({ webUserKey }: { webUserKey: string }) {
  const currentSysUser = await getCurrentSystemUser()
  const currWebUser = await getCurrentWebUserIds()
  if (currentSysUser.type !== 'pkg' && !currWebUser?.isAdmin) {
    return { status: 'non-admins-cannot-delete-others' } as const
  }
  const targetWebUser = await getWebUser({ _key: webUserKey })
  if (!targetWebUser) {
    return { status: 'not-found' } as const
  }
  /*  const changeProfilePublisherPermResp = */ await changeProfilePublisherPerm({
    profileKey: targetWebUser.profileKey,
    setIsPublisher: false,
    forceUnpublish: true,
  })
  // console.log('changeProfilePublisherPermResp ', changeProfilePublisherPermResp)
  return _deleteWebUserAccountNow(webUserKey)
}
async function _deleteWebUserAccountNow(webUserKey: string) {
  const { old: webUser } = await patchWebUser({ _key: webUserKey }, { deleting: true })
  if (!webUser) {
    return { status: 'not-found' } as const
  }
  if (webUser.deleting) {
    return { status: 'deleting' } as const
  }
  const profileRecord = await getProfileRecord(webUser.profileKey)
  assert(profileRecord, '_deleteWebUserAccountNow: profile#${webUser.profileKey} not found')
  const profile = profileRecord.entity
  if (profile.publisher) {
    const knownFeaturedEntities = reduceToKnownFeaturedEntities(profile.knownFeaturedEntities)
    const allDiscardingFeatures = [
      ...knownFeaturedEntities.follow.collection.map(
        ({ _key }) => ({ entityType: 'collection', feature: 'follow', _key } as const),
      ),
      ...knownFeaturedEntities.follow.profile.map(
        ({ _key }) => ({ entityType: 'profile', feature: 'follow', _key } as const),
      ),
      ...knownFeaturedEntities.follow.subject.map(
        ({ _key }) => ({ entityType: 'subject', feature: 'follow', _key } as const),
      ),
      ...knownFeaturedEntities.like.resource.map(
        ({ _key }) => ({ entityType: 'resource', feature: 'like', _key } as const),
      ),
    ]
    await shell.initiateCall(async () => {
      await setCurrentSystemUser({
        type: 'entity',
        entityIdentifier: { _key: profile._key, entityClass: profileRecord.meta.entityClass },
        restrictToScopes: false,
      })
      await Promise.all(
        allDiscardingFeatures.map(({ _key, entityType, feature }) =>
          entityFeatureAction({
            _key,
            entityType,
            feature,
            action: 'remove',
            profileKey: profile._key,
          }),
        ),
      )
    })
  }
  const ownCollections = await getProfileOwnKnownEntities({
    knownEntity: 'collection',
    profileKey: profile._key,
    limit: 100000,
  })

  const ownResources = await getProfileOwnKnownEntities({
    knownEntity: 'resource',
    profileKey: profile._key,
    limit: 100000,
  })
  // console.log({
  //   ownCollections: ownCollections.map(_ => ({
  //     _key: _.entity._key,
  //     published: _.entity.published,
  //   })),
  //   ownResources: ownResources.map(_ => ({ _key: _.entity._key, published: _.entity.published })),
  // })

  const leftCollectionsRecords = ownCollections.filter(({ entity: { published } }) => published)
  const leftResourcesRecords = ownResources.filter(({ entity: { published } }) => published)
  const deletedCollectionsRecords = ownCollections.filter(({ entity: { published } }) => !published)
  const deletedResourcesRecords = ownResources.filter(({ entity: { published } }) => !published)
  // console.log('leftCollectionsRecords', leftCollectionsRecords.length)
  // console.log('leftResourcesRecords', leftResourcesRecords.length)
  // console.log('deletedCollectionsRecords', deletedCollectionsRecords.length)
  // console.log('deletedResourcesRecords', deletedResourcesRecords.length)
  await shell.initiateCall(async () => {
    await setCurrentSystemUser({
      type: 'entity',
      entityIdentifier: { _key: profile._key, entityClass: profileRecord.meta.entityClass },
      restrictToScopes: false,
    })
    await Promise.all(
      deletedCollectionsRecords.map(async ({ entity: { _key } }) => {
        await delCollection(_key)
        // shell.log('debug', { delCollection: _key })
        return { _key }
      }),
    )
    await Promise.all(
      deletedResourcesRecords.map(async data => {
        const [interpreter /* , initializeContext, machine, configs */] =
          await stdEdResourceMachine({
            by: 'data',
            data,
          })
        if (interpreter.getSnapshot().can('trash')) {
          interpreter.send('trash')
          await waitFor(interpreter, nameMatcher('Destroyed'))
        }
        interpreter.stop()
        // shell.log('debug', { delResource: _key })
        return { _key: data.entity._key }
      }),
    )
  })

  await setProfileAvatar({ _key: profile._key, rpcFile: null })
  await setProfileBackgroundImage({ _key: profile._key, rpcFile: null })
  await Profile.collection.update(
    profile._key,
    {
      deleted: true,
      aboutMe: '',
      displayName: 'deleted user',
      knownFeaturedEntities: [],
      location: '',
      organizationName: '',
      publisher: false,
      settings: { interests: null },
      popularity: null,
      siteUrl: null,
      webslug: 'deleted-user',
    },
    { keepNull: true },
  )
  await WebUserCollection.update(
    webUser._key,
    {
      contacts: { email: '###@###.###' },
      deleted: true,
      deleting: false,
      displayName: 'deleted user by moderator',
      isAdmin: false,
      publisher: false,
    },
    { keepNull: true },
  )

  const event: WebUserEvents['deleted-web-user-account'] = {
    displayName: profile.displayName,
    profile: { ...profileRecord.entity, _meta: profileRecord.meta },
    webUser: webUser,
    deletedCollections: deletedCollectionsRecords.map(({ entity: { _key } }) => ({ _key })),
    deletedResources: deletedResourcesRecords.map(({ entity: { _key } }) => ({ _key })),
    leftCollections: leftCollectionsRecords.map(({ entity: { _key } }) => ({ _key })),
    leftResources: leftResourcesRecords.map(({ entity: { _key } }) => ({ _key })),
  }
  shell.events.emit('deleted-web-user-account', event)
  return { status: 'done', event } as const
}
