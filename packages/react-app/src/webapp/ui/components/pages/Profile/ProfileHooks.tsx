import { useMemo } from 'react'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import { ProfileProps } from './Profile.js'

import { useMainProfileCardProps } from '../../organisms/MainProfileCard/MainProfileCardHooks.js'
import { profileStoriesValidationSchema } from '../../organisms/MainProfileCard/stories-props.js'

export const useProfileProps = ({ profileKey }: { profileKey: string }): ProfileProps => {
  const profileCardProps = useMainProfileCardProps({ profileKey })
  console.log('Fix this useProfileProps method', profileCardProps)
  const mainLayoutProps = useMainLayoutProps()
  const profileProps = useMemo<ProfileProps>(() => {
    //TODO Substitute with real props
    const props: ProfileProps = {
      mainLayoutProps,
      access: {
        canEdit: false,
        isAuthenticated: false,
        isCreator: false,
        isAdmin: false,
      },
      actions: {
        editProfile: () => undefined,
        toggleFollow: () => undefined,
      },
      mainProfileCardSlots: {
        mainColumnItems: [],
        topItems: [],
      },
      profileForm: {
        aboutMe: '',
        displayName: '',
      },
      // state: {
      //   followed: false,
      // },
      validationSchema: profileStoriesValidationSchema,
    }
    return props
  }, [mainLayoutProps])

  return profileProps
}
