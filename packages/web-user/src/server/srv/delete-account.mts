import { delCollection } from '@moodlenet/collection/server'
import { nameMatcher } from '@moodlenet/core-domain/resource'
import { jwt } from '@moodlenet/crypto/server'
import { ensureUnpublish, stdEdResourceMachine } from '@moodlenet/ed-resource/server'
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
  isWebUserAccountDeletionToken,
  patchWebUser,
  setCurrentUnverifiedJwtToken,
  signWebUserJwt,
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
    return deleteWebUserAccountNow(webUserAccountDeletionToken.payload.webUserKey, {
      deletionReason: 'user-request',
    })
  })
}

type UserAccountDeletionReason = 'moderation' | 'user-request' | 'inactivity'

export async function deleteWebUserAccountNow(
  webUserKey: string,
  { deletionReason }: { deletionReason: UserAccountDeletionReason },
) {
  const currentSysUser = await getCurrentSystemUser()
  const currWebUserIds = await getCurrentWebUserIds()
  const isPkg = currentSysUser.type === 'pkg'
  const isAdmin = currWebUserIds?.isAdmin === true
  const isPkgOrAdmin = isPkg || isAdmin
  if (deletionReason === 'moderation' && !isPkgOrAdmin) {
    return { status: 'only-admins-and-system-can-delete-for-moderation' } as const
  }
  if (deletionReason === 'inactivity' && !isPkgOrAdmin) {
    return { status: 'only-admins-and-system-can-delete-for-inactivity' } as const
  }
  if (deletionReason === 'user-request' && !isPkg) {
    return { status: 'only-system-can-delete-by-user-request' } as const
  }
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

  if (deletionReason === 'moderation' && profile.publisher) {
    /*  const changeProfilePublisherPermResp = */ await changeProfilePublisherPerm({
      profileKey: profile._key,
      setIsPublisher: false,
      forceUnpublish: true,
    })
  }
  const deletedEvent = await shell.initiateCall(async () => {
    await setCurrentSystemUser({
      type: 'entity',
      entityIdentifier: { _key: profile._key, entityClass: profileRecord.meta.entityClass },
      restrictToScopes: false,
    })

    await setCurrentUnverifiedJwtToken(
      await signWebUserJwt({
        webUser: { _key: webUser._key, displayName: webUser.displayName, isAdmin: webUser.isAdmin },
        profile: {
          _key: profile._key,
          _id: profile._id,
          publisher: profile.publisher,
        },
      }),
    )
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

    const leftCollectionsRecords = ownCollections.filter(({ entity: { published } }) => published)
    const leftResourcesRecords = ownResources.filter(({ entity: { published } }) => published)
    const deletedCollectionsRecords = ownCollections.filter(
      ({ entity: { published } }) => !published,
    )
    const deletedResourcesRecords = ownResources.filter(({ entity: { published } }) => !published)

    await Promise.allSettled([
      ...deletedCollectionsRecords.map(async ({ entity: { _key } }) => {
        await delCollection(_key).catch(e => e)
        return { _key }
      }),
      ...deletedResourcesRecords.map(async data => {
        await ensureUnpublish({ key: data.entity._key, by: 'key' })
        const [interpreter, , , , writeStatus] = await stdEdResourceMachine({
          key: data.entity._key,
          by: 'key',
        })

        if (interpreter.getSnapshot().can('trash')) {
          interpreter.send('trash')
          await waitFor(interpreter, nameMatcher('Destroyed'))
        }
        interpreter.stop()
        await writeStatus
        return { _key: data.entity._key }
      }),
    ])

    const event: WebUserEvents['deleted-web-user-account'] = {
      displayName: profile.displayName,
      profile: { ...profileRecord.entity, _meta: profileRecord.meta },
      webUser: webUser,
      deletedCollections: deletedCollectionsRecords.map(({ entity: { _key } }) => ({ _key })),
      deletedResources: deletedResourcesRecords.map(({ entity: { _key } }) => ({ _key })),
      leftCollections: leftCollectionsRecords.map(({ entity: { _key } }) => ({ _key })),
      leftResources: leftResourcesRecords.map(({ entity: { _key } }) => ({ _key })),
    }

    return event
  })
  const isLeavingContributions =
    deletedEvent.leftCollections.length + deletedEvent.leftResources.length > 0

  if (isLeavingContributions) {
    await setProfileAvatar({ _key: profile._key, rpcFile: null })
    await setProfileBackgroundImage({ _key: profile._key, rpcFile: null })
    await Profile.collection.update(
      profile._key,
      {
        deleted: true,
        aboutMe: '',
        displayName: `deleted user`,
        knownFeaturedEntities: [],
        location: '',
        organizationName: '',
        settings: { interests: null },
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
        displayName: `deleted user for ${deletionReason}`,
        isAdmin: false,
      },
      { keepNull: true },
    )
  } else {
    await WebUserCollection.remove(webUser._key)
    await Profile.collection.remove(profile._key)
  }
  shell.events.emit('deleted-web-user-account', deletedEvent)
  return { status: 'done', deletedEvent } as const
}
