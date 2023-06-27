import { FilterNone, Grade, PermIdentity } from '@material-ui/icons'
import { CollectionContext, useCollectionCardProps } from '@moodlenet/collection/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { ResourceContext, useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import type { OverallCardItem } from '@moodlenet/react-app/ui'
import { proxyWith } from '@moodlenet/react-app/ui'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { profileFormValidationSchema } from '../../../../common/profile/data.mjs'
import type { ProfileGetRpc } from '../../../../common/types.mjs'
import type { ProfileProps } from '../../../ui/exports/ui.mjs'
import { AuthCtx } from '../../context/AuthContext.js'
import { useMyFeaturedEntity } from '../../context/useMyFeaturedEntity.js'
import { shell } from '../../shell.mjs'

const __should_be_from_server_maxUploadSize = 1024 * 1024 * 50

export const ProfilePagePlugins = createPlugin<{
  main_mainColumnItems?: AddOnMap<AddonItemNoKey>
  main_topItems?: AddOnMap<AddonItemNoKey>
  main_footerItems?: AddOnMap<AddonItemNoKey>
  main_subtitleItems?: AddOnMap<AddonItemNoKey>
  main_titleItems?: AddOnMap<AddonItemNoKey>
  mainColumnItems?: AddOnMap<AddonItemNoKey>
  sideColumnItems?: AddOnMap<AddonItemNoKey>
  overallCardItems?: AddOnMap<Omit<OverallCardItem, 'key'>>
}>()

export const useProfileProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileProps | undefined => {
  const plugins = ProfilePagePlugins.usePluginHooks()

  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)

  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const [profileGetRpc, setProfileGetRpc] = useState<ProfileGetRpc>()

  const editProfile = useCallback<ProfileProps['actions']['editProfile']>(
    async values => {
      const { aboutMe, displayName, location, organizationName, siteUrl } = values

      await shell.rpc.me['webapp/profile/edit']({
        _key: profileKey,
        displayName,
        aboutMe,
        location,
        organizationName,
        siteUrl,
      })
    },
    [profileKey],
  )

  useEffect(() => {
    shell.rpc.me['webapp/profile/get']({ _key: profileKey }).then(res => {
      if (!res) {
        return
      }
      setProfileGetRpc(res)
    })
  }, [profileKey])

  const mainLayoutProps = useMainLayoutProps()
  const follow = useMyFeaturedEntity({ _key: profileKey, entityType: 'profile', feature: 'follow' })

  const profileProps = useMemo<ProfileProps | undefined>(() => {
    if (!profileGetRpc) {
      return
    }
    const isAdmin = !!clientSessionData?.isAdmin
    const isCreator = clientSessionData?.myProfile?._key === profileKey
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
      mainLayoutProps,
      // followersHref: href(
      //   getFollowersRoutePath({
      //     key: profileKey,
      //     displayName: profileGetRpc.data.displayName,
      //   }),
      // ),
      access: {
        canEdit: profileGetRpc.canEdit,
        isAdmin,
        isAuthenticated,
        isCreator,
        canFollow: profileGetRpc.canFollow,
      },
      data: {
        userId: profileKey,
        displayName: profileGetRpc.data.displayName,
        avatarUrl: profileGetRpc.data.avatarUrl,
        backgroundUrl: profileGetRpc.data.backgroundUrl,
        profileHref: profileGetRpc.profileHref,
      },
      state: {
        profileUrl: profileGetRpc.profileUrl,
        followed: follow.isFeatured,
        numFollowers: profileGetRpc.numFollowers,
      },
      actions: {
        editProfile,
        toggleFollow: () => {
          follow.toggle()
        },
        setAvatar: (avatar: File | undefined | null) => {
          console.log('setAvatar', avatar)
          shell.rpc.me['webapp/upload-profile-avatar/:_key'](
            { file: [avatar] },
            { _key: profileKey },
          )
        },
        setBackground: (background: File | undefined | null) => {
          console.log('setBackground', background)
          shell.rpc.me['webapp/upload-profile-background/:_key'](
            { file: [background] },
            { _key: profileKey },
          )
        },
        sendMessage: (message: string) =>
          shell.rpc.me['webapp/send-message-to-user/:profileKey']({ message }, { profileKey }),
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
      sideColumnItems: plugins.getKeyedAddons('sideColumnItems'),
      overallCardItems: [
        { Icon: PermIdentity, name: 'Followers', value: profileGetRpc.numFollowers },
        { Icon: Grade, name: 'Kudos', value: profileGetRpc.numKudos },
        {
          Icon: FilterNone,
          name: 'Resources',
          value: profileGetRpc.ownKnownEntities.resources.length,
        },

        ...plugins.getKeyedAddons('overallCardItems'),
      ],
      profileForm: profileGetRpc.data,
      // state: {
      //   followed: false,
      // },
      validationSchema: profileFormValidationSchema(__should_be_from_server_maxUploadSize), // FIXME
    }
    return props
  }, [
    profileGetRpc,
    clientSessionData?.isAdmin,
    clientSessionData?.myProfile?._key,
    profileKey,
    mainLayoutProps,
    isAuthenticated,
    follow,
    editProfile,
    plugins,
    collectionCtx,
    resourceCtx,
  ])
  return profileProps
}
