import { CollectionContext, useCollectionCardProps } from '@moodlenet/collection/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import { useImageUrl } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { ResourceContext, useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import type { OverallCardItem } from '@moodlenet/react-app/ui'
import { proxyWith } from '@moodlenet/react-app/ui'
import {
  createPlugin,
  createTaskManager,
  silentCatchAbort,
  useMainLayoutProps,
} from '@moodlenet/react-app/webapp'
import { FilterNone, Grade, PermIdentity } from '@mui/icons-material'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ProfileGetRpc } from '../../../../common/types.mjs'
import { getProfileFollowersRoutePath } from '../../../../common/webapp-routes.mjs'
import type { ProfileProps } from '../../../ui/exports/ui.mjs'
import { AuthCtx } from '../../context/AuthContext.js'
import { useProfileContext } from '../../context/ProfileContext.js'
import { useMyFeaturedEntity } from '../../context/useMyFeaturedEntity.js'
import { shell } from '../../shell.mjs'

export type ProfilePagePluginMap = {
  main_mainColumnItems?: AddOnMap<AddonItemNoKey>
  main_topItems?: AddOnMap<AddonItemNoKey>
  main_footerItems?: AddOnMap<AddonItemNoKey>
  main_subtitleItems?: AddOnMap<AddonItemNoKey>
  main_titleItems?: AddOnMap<AddonItemNoKey>
  mainColumnItems?: AddOnMap<AddonItemNoKey>
  rightColumnItems?: AddOnMap<AddonItemNoKey>
  wideColumnItems?: AddOnMap<AddonItemNoKey>
  overallCardItems?: AddOnMap<Omit<OverallCardItem, 'key'>>
}

export type ProfilePagePluginCtx = {
  profileKey: string
  profileGetRpc: ProfileGetRpc | null | undefined
  isCreator: boolean
}

export const ProfilePagePlugins = createPlugin<ProfilePagePluginMap, ProfilePagePluginCtx>()

const [useUpBgImageTasks] = createTaskManager<string | null, { file: File | null | undefined }>()
const [useUpAvatarTasks] = createTaskManager<string | null, { file: File | null | undefined }>()
type SaveState = {
  form: boolean
  image: boolean
  avatar: boolean
}
export const useProfileProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileProps | null | undefined => {
  const showAccountApprovedSuccessAlert = false
  const { validationSchemas } = useProfileContext()

  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)

  const { isAuthenticated, clientSessionData, updateMyLocalProfile } = useContext(AuthCtx)
  const [profileGetRpc, setProfileGetRpc] = useState<ProfileGetRpc | null>()

  const updateDataProp = useCallback(
    <K extends keyof ProfileGetRpc['data']>(k: K, v: ProfileGetRpc['data'][K]) =>
      setProfileGetRpc(rpcData => rpcData && { ...rpcData, data: { ...rpcData.data, [k]: v } }),
    [],
  )

  const [upBgImageTaskSet, upBgImageTaskId, upBgImageTaskCurrent] = useUpBgImageTasks(
    profileKey,
    res => {
      if (res.type === 'resolved') {
        updateDataProp('backgroundUrl', res.value ?? undefined)
      }
      setterSave('image', false)
    },
  )

  const [upAvatarTaskSet, upAvatarTaskId, upAvatarTaskCurrent] = useUpAvatarTasks(
    profileKey,
    res => {
      if (res.type === 'resolved') {
        updateDataProp('avatarUrl', res.value ?? undefined)
      }
      setterSave('avatar', false)
    },
  )
  const setterSave = useCallback(
    (key: keyof SaveState, val: boolean) =>
      setSaved(currentSaved => ({ ...currentSaved, [key]: val })),
    [],
  )
  const [, /* saveState */ setSaved] = useState<SaveState>(() => ({
    form: false,
    image: !!upBgImageTaskCurrent,
    avatar: !!upAvatarTaskCurrent,
  }))
  const toggleIsPublisher = useCallback(async () => {
    return (
      profileGetRpc &&
      shell.rpc
        .me('webapp/admin/roles/setIsPublisher')({
          profileKey,
          isPublisher: !profileGetRpc.isPublisher,
        })
        .then(
          done =>
            done && setProfileGetRpc(curr => curr && { ...curr, isPublisher: !curr.isPublisher }),
        )
    )
  }, [profileKey, profileGetRpc])
  const editProfile = useCallback<ProfileProps['actions']['editProfile']>(
    async values => {
      const { aboutMe, displayName, location, organizationName, siteUrl } = values

      await shell.rpc.me('webapp/profile/:_key/edit')(
        {
          editData: {
            displayName,
            aboutMe,
            location,
            organizationName,
            siteUrl,
          },
        },
        { _key: profileKey },
      )
      updateMyLocalProfile({
        aboutMe,
        displayName,
        organizationName,
        siteUrl,
        location,
      })
    },
    [profileKey, updateMyLocalProfile],
  )

  useEffect(() => {
    setProfileGetRpc(undefined)
    shell.rpc
      .me('webapp/profile/:_key/get', { rpcId: `profile/get#${profileKey}` })(
        void 0,
        {
          _key: profileKey,
        },
        { ownContributionListLimit: '300' },
      )
      .then(res => {
        setProfileGetRpc(res)
      })
      .catch(silentCatchAbort)
  }, [profileKey])

  const mainLayoutProps = useMainLayoutProps()
  const follow = useMyFeaturedEntity({ _key: profileKey, entityType: 'profile', feature: 'follow' })

  const [upBgImageTaskCurrentObjectUrl] = useImageUrl(upBgImageTaskCurrent?.ctx.file)
  const [upAvatarTaskCurrentObjectUrl] = useImageUrl(upAvatarTaskCurrent?.ctx.file)

  const isAdmin = !!clientSessionData?.isAdmin
  const isCreator = clientSessionData?.myProfile?._key === profileKey
  const plugins = ProfilePagePlugins.usePluginHooks({ profileKey, profileGetRpc, isCreator })

  const profileProps = useMemo<ProfileProps | null | undefined>(() => {
    if (!profileGetRpc) {
      return profileGetRpc
    }
    const resourceCardPropsList: ProfileProps['resourceCardPropsList'] =
      profileGetRpc.ownKnownEntities.resources.map(({ _key }) => {
        return {
          key: _key,
          props: proxyWith(function usePropProxy() {
            return { props: useResourceCardProps(_key) }
          }),
        }
      })
    const collectionCardPropsList: ProfileProps['collectionCardPropsList'] =
      profileGetRpc.ownKnownEntities.collections.map(({ _key }) => {
        return {
          key: _key,
          props: proxyWith(function usePropProxy() {
            return { props: useCollectionCardProps(_key) }
          }),
        }
      })

    const props: ProfileProps = {
      // saveState,
      // isSaving: Object.values(saveState).some(Boolean),
      mainLayoutProps,
      // followersHref: href(
      //   getFollowersRoutePath({
      //     key: profileKey,
      //     displayName: profileGetRpc.data.displayName,
      //   }),
      // ),
      access: {
        canApprove: profileGetRpc.canApprove,
        isPublisher: profileGetRpc.isPublisher,
        canEdit: profileGetRpc.canEdit,
        isAdmin,
        isAuthenticated,
        isCreator,
        canFollow: profileGetRpc.canFollow,
      },
      data: {
        userId: profileKey,
        displayName: profileGetRpc.data.displayName,
        avatarUrl: profileGetRpc.data.avatarUrl ?? undefined,
        backgroundUrl: profileGetRpc.data.backgroundUrl ?? undefined,
        profileHref: profileGetRpc.profileHref,
        points: profileGetRpc.points,
        ...(upBgImageTaskCurrent
          ? {
              backgroundUrl: upBgImageTaskCurrentObjectUrl,
            }
          : {}),
        ...(upAvatarTaskCurrent
          ? {
              avatarUrl: upAvatarTaskCurrentObjectUrl,
            }
          : {}),
      },
      state: {
        isPublisher: profileGetRpc.isPublisher,
        showAccountApprovedSuccessAlert,
        profileUrl: profileGetRpc.profileUrl,
        followed: follow.isFeatured,
        numFollowers: profileGetRpc.numFollowers,
      },
      actions: {
        approveUser: toggleIsPublisher,
        unapproveUser: toggleIsPublisher,
        editProfile,
        toggleFollow: () => {
          follow.toggle()
        },
        setAvatar: (avatar: File | undefined | null) => {
          upAvatarTaskSet(
            shell.rpc.me('webapp/upload-profile-avatar/:_key', { rpcId: upAvatarTaskId })(
              { file: [avatar] },
              { _key: profileKey },
            ),
            { file: avatar },
          ).promise.then(
            res => {
              updateMyLocalProfile({ avatarUrl: res ?? undefined })
            },
            () => void 0,
          )
        },
        setBackground: (background: File | undefined | null) => {
          upBgImageTaskSet(
            shell.rpc.me('webapp/upload-profile-background/:_key', { rpcId: upBgImageTaskId })(
              { file: [background] },
              { _key: profileKey },
            ),
            { file: background },
          )
        },
        sendMessage: (message: string) =>
          shell.rpc.me('webapp/send-message-to-user/:profileKey')({ message }, { profileKey }),
      },
      mainProfileCardSlots: {
        mainColumnItems: plugins.getKeyedAddons('main_mainColumnItems'),
        topItems: plugins.getKeyedAddons('main_topItems'),
        footerItems: plugins.getKeyedAddons('main_footerItems'),
        subtitleItems: plugins.getKeyedAddons('main_subtitleItems'),
        titleItems: plugins.getKeyedAddons('main_titleItems'),
      },
      createCollection: () => collectionCtx.createCollection(),
      createResource: () => resourceCtx.createResource(),
      resourceCardPropsList,
      collectionCardPropsList,
      mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
      rightColumnItems: plugins.getKeyedAddons('rightColumnItems'),
      wideColumnItems: plugins.getKeyedAddons('wideColumnItems'),
      overallCardItems: [
        {
          Icon: PermIdentity,
          name: 'Followers',
          className: 'followers',
          value: profileGetRpc.numFollowers,
          href: href(
            getProfileFollowersRoutePath({
              displayName: profileGetRpc.data.displayName,
              key: profileKey,
            }),
          ),
        },
        {
          Icon: Grade,
          name: 'Following',
          value: profileGetRpc.numFollowing,
          className: 'following',
          // href: href(
          //   getProfileFollowingRoutePath({
          //     displayName: profileGetRpc.data.displayName,
          //     key: profileKey,
          //   }),
          // ),
        },
        {
          Icon: FilterNone,
          name: 'Resources',
          className: 'resources',
          value: profileGetRpc.ownKnownEntities.resources.length,
        },

        ...plugins.getKeyedAddons('overallCardItems'),
      ],
      profileForm: profileGetRpc.data,
      // state: {
      //   followed: false,
      // },
      validationSchemas,
    }
    return props
  }, [
    profileGetRpc,
    mainLayoutProps,
    isAdmin,
    isAuthenticated,
    isCreator,
    profileKey,
    upBgImageTaskCurrent,
    upBgImageTaskCurrentObjectUrl,
    upAvatarTaskCurrent,
    upAvatarTaskCurrentObjectUrl,
    showAccountApprovedSuccessAlert,
    follow,
    toggleIsPublisher,
    editProfile,
    plugins,
    validationSchemas,
    upAvatarTaskSet,
    upAvatarTaskId,
    updateMyLocalProfile,
    upBgImageTaskSet,
    upBgImageTaskId,
    collectionCtx,
    resourceCtx,
  ])
  return profileProps
}
