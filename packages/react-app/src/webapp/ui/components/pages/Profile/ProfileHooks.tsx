import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { profileFormValidationSchema } from '../../../../../common/profile/data.mjs'
import { WebUserProfile } from '../../../../../server/types.mjs'
import { MainContext } from '../../../../context/MainContext.mjs'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import { ProfileCardPropsControlled, ProfileProps } from './Profile.js'

const __should_be_from_server_maxUploadSize = 1024 * 1024 * 50

export const useProfileProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileProps | undefined => {
  const {
    use: { me },
  } = useContext(MainContext)

  const [profileResponse, setProfileResponse] = useState<{
    data: WebUserProfile
    canEdit: boolean
  }>()

  const saveProfile = useCallback<ProfileCardPropsControlled['saveProfile']>(
    async values => {
      const {
        aboutMe: description,
        displayName: title,
        location,
        organizationName,
        siteUrl,
      } = values
      const res = await me.rpc['webapp/profile/edit']({
        _key: profileKey,
        displayName: title,
        aboutMe: description,
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
    const profileCardProps: ProfileCardPropsControlled = {
      saveProfile,
      canEdit: profileResponse.canEdit,
      formValues: profileResponse.data,
      validationSchema: profileFormValidationSchema(__should_be_from_server_maxUploadSize), // FIXME
    }

    const props: ProfileProps = {
      profileCardProps,
      mainLayoutProps,
    }
    return props
  }, [mainLayoutProps, profileResponse, saveProfile])

  return profileProps
}
