import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { profileFormValidationSchema } from '../../../../../common/profile/data.mjs'
import { WebUserProfile } from '../../../../../server/types.mjs'
import { MainContext } from '../../../../context/MainContext.mjs'
import { AuthCtx } from '../../../../web-lib.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
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

  const toggleFollow = useCallback<ProfileProps['actions']['toggleFollow']>(async () => {
    throw new Error('not Implemented')
  }, [])
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
      },
      actions: {
        editProfile,
        toggleFollow,
      },
      mainProfileCardSlots: {
        mainColumnItems: [],
        topItems: [],
      },
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
    toggleFollow,
  ])

  return profileProps
}
