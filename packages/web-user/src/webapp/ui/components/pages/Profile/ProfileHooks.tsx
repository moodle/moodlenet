import { CollectionContext, useCollectionCardProps } from '@moodlenet/collection/webapp'
import { ResourceContext, useResourceCardProps } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import { proxyWith } from '@moodlenet/react-app/ui'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileFormValidationSchema } from '../../../../../common/profile/data.mjs'
import type { ProfileGetRpc } from '../../../../../common/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { shell } from '../../../../shell.mjs'
import type { ProfileProps } from './Profile.js'

const __should_be_from_server_maxUploadSize = 1024 * 1024 * 50

export const useProfileProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileProps | undefined => {
  const nav = useNavigate()

  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)

  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const [profileGetRpc, setProfileGetRpc] = useState<ProfileGetRpc>()

  // const toggleFollow = useCallback<ProfileProps['actions']['toggleFollow']>(async () => {
  //   throw new Error('not Implemented')
  // }, [])
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
          resourceCardProps: proxyWith(function usePropProxy() {
            return { props: useResourceCardProps(_key) }
          }),
        }
      })
    const collectionCardPropsList: ProfileProps['collectionCardPropsList'] =
      profileGetRpc.ownKnownEntities.collections.map(({ _key }) => {
        return {
          key: _key,
          collectionCardProps: proxyWith(function usePropProxy() {
            return { props: useCollectionCardProps(_key) }
          }),
        }
      })

    const props: ProfileProps = {
      mainLayoutProps,
      access: {
        canEdit: profileGetRpc.canEdit,
        isAdmin,
        isAuthenticated,
        isCreator,
        canPublish: false, //@ETTO Needs to be implemented
        canFollow: true, //@ETTO Needs to be implemented
        canBookmark: true, //@ETTO Needs to be implemented
      },
      data: {
        userId: '12sadsadsad', //@ETTO Needs to be implemented
        displayName: profileGetRpc.data.displayName, //@ETTO Needs to be implemented
        avatarUrl: profileGetRpc.data.avatarUrl,
        backgroundUrl: profileGetRpc.data.backgroundUrl,
        profileHref: href('/profile'), //@ETTO Needs to be implemented
      },
      state: {
        profileUrl: 'https://moodle.net/profile', //@ETTO Needs to be implemented
        followed: false, //@ETTO Needs to be implemented
        numFollowers: 13, //@ETTO Needs to be implemented
      },
      actions: {
        editProfile,
        toggleFollow: () => alert('Needs to be implemented'), //@ETTO Needs to be implemented
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
        mainColumnItems: [],
        topItems: [],
        footerItems: [],
        subtitleItems: [],
        titleItems: [],
      },
      createCollection: () =>
        collectionCtx.createCollection().then(({ homePath }) => nav(homePath)),
      createResource: () => resourceCtx.createResource().then(({ homePath }) => nav(homePath)),
      resourceCardPropsList,
      collectionCardPropsList,
      mainColumnItems: [], //@ETTO Needs to be implemented - create registry for it
      sideColumnItems: [], //@ETTO Needs to be implemented - create registry for it
      overallCardItems: [],
      profileForm: profileGetRpc.data,
      // state: {
      //   followed: false,
      // },
      validationSchema: profileFormValidationSchema(__should_be_from_server_maxUploadSize), // FIXME
    }
    return props
  }, [
    clientSessionData?.isAdmin,
    clientSessionData?.myProfile?._key,
    collectionCtx,
    editProfile,
    isAuthenticated,
    mainLayoutProps,
    nav,
    profileKey,
    profileGetRpc,
    resourceCtx,
  ])
  return profileProps
}
