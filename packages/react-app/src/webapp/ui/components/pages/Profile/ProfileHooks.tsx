import { useMemo } from 'react'
import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
import { useProfileCardProps } from '../../organisms/ProfileCard/ProfileCardHooks.js'
import { profileStoriesValidationSchema } from '../../organisms/ProfileCard/stories-props.js'
import { ProfileProps } from './Profile.js'

export const useProfileProps = ({ profileKey }: { profileKey: string }): ProfileProps => {
  const profileCardProps = useProfileCardProps({ profileKey })
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
      profileCardSlots: {
        mainColumnItems: [],
        topItems: [],
      },
      profileForm: {
        aboutMe: '',
        displayName: '',
      },

      state: {
        followed: false,
      },
      validationSchema: profileStoriesValidationSchema,
    }
    return props
  }, [mainLayoutProps])

  return profileProps
}
