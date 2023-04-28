import { href } from '@moodlenet/react-app/common'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { profileFormValidationSchema } from '../../../../../common/profile/data.mjs'
import { WebUserProfile } from '../../../../../server/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import { ProfileProps } from './Profile.js'

const __should_be_from_server_maxUploadSize = 1024 * 1024 * 50

export const useProfileProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileProps | undefined => {
  const {
    use: { me },
  } = useContext(MainContext)

  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const [profileResponse, setProfileResponse] = useState<{
    data: WebUserProfile
    canEdit: boolean
  }>()

  // const toggleFollow = useCallback<ProfileProps['actions']['toggleFollow']>(async () => {
  //   throw new Error('not Implemented')
  // }, [])
  const editProfile = useCallback<ProfileProps['actions']['editProfile']>(
    async values => {
      const { aboutMe, displayName, location, organizationName, siteUrl } = values
      const res = await me.rpc['webapp/profile/edit']({
        _key: profileKey,
        displayName,
        aboutMe,
        location,
        organizationName,
        siteUrl,
      })
      // if (!res) {
      //   return
      // }
      setProfileResponse(res)
    },
    [me.rpc, profileKey],
  )

  useEffect(() => {
    me.rpc['webapp/profile/get']({ _key: profileKey }).then(res => {
      if (!res) {
        return
      }
      setProfileResponse(res)
    })
  }, [profileKey, me])

  const mainLayoutProps = useMainLayoutProps()

  const profileProps = useMemo<ProfileProps | undefined>(() => {
    if (!profileResponse) {
      return
    }
    const isAdmin = !!clientSessionData?.isAdmin
    const isCreator = clientSessionData?.myProfile?._key === profileKey

    const props: ProfileProps = {
      mainLayoutProps,
      access: {
        canEdit: profileResponse.canEdit,
        isAdmin,
        isAuthenticated,
        isCreator,
        canFollow: true, //@ETTO Needs to be implemented
      },
      data: {
        userId: '12sadsadsad', //@ETTO Needs to be implemented
        username: profileResponse.data.displayName, //@ETTO Needs to be implemented
        avatarUrl: 'sadsadsadsa.sdsad', //@ETTO Needs to be implemented
        backgroundUrl: 'sadsadsadsa.sdsad', //@ETTO Needs to be implemented
        profileHref: href('/profile'), //@ETTO Needs to be implemented
      },
      state: {
        profileUrl: 'https://moodle.net/profile', //@ETTO Needs to be implemented
        followed: false, //@ETTO Needs to be implemented
        numFollowers: 13, //@ETTO Needs to be implemented
      },
      actions: {
        editProfile,
        sendMessage: (_msg: string) => alert('Needs to be implemented'), //@ETTO Needs to be implemented
        toggleFollow: () => alert('Needs to be implemented'), //@ETTO Needs to be implemented
        setAvatar: (_file: File | undefined | null) => alert('Needs to be implemented'), //@ETTO Needs to be implemented
        setBackground: (_file: File | undefined | null) => alert('Needs to be implemented'), //@ETTO Needs to be implemented
      },
      mainProfileCardSlots: {
        mainColumnItems: [],
        topItems: [],
        footerItems: [],
        subtitleItems: [],
        titleItems: [],
      },
      createCollection: () => undefined, //@ETTO Needs to be implemented
      createResource: () => undefined, //@ETTO Needs to be implemented
      resourceCardPropsList: [], //@ETTO Needs to be implemented - get it from server
      collectionCardPropsList: [], //@ETTO Needs to be implemented - get it from server
      mainColumnItems: [], //@ETTO Needs to be implemented - create registry for it
      sideColumnItems: [], //@ETTO Needs to be implemented - create registry for it
      overallCardItems: [],
      profileForm: profileResponse.data,
      // state: {
      //   followed: false,
      // },
      validationSchema: profileFormValidationSchema(__should_be_from_server_maxUploadSize), // FIXME
    }
    return props
  }, [
    clientSessionData?.isAdmin,
    clientSessionData?.myProfile?._key,
    editProfile,
    isAuthenticated,
    mainLayoutProps,
    profileKey,
    profileResponse,
    // toggleFollow,
  ])

  return profileProps
}
