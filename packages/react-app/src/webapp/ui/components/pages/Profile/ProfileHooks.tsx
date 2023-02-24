// import { useMemo } from 'react'
// import { useMainLayoutProps } from '../../layout/MainLayout/MainLayoutHooks.mjs'
// import { useProfileCardProps } from '../../organisms/ProfileCard/ProfileCardHooks.js'
// import { ProfileProps } from './Profile.js'

// export const useProfileProps = ({ profileKey }: { profileKey: string }): ProfileProps => {
//   const profileCardProps = useProfileCardProps({ profileKey })
//   const mainLayoutProps = useMainLayoutProps()
//   const profileProps = useMemo<ProfileProps>(() => {
//     const props: ProfileProps = {
//       profileCardProps,
//       mainLayoutProps,
//     }
//     return props
//   }, [mainLayoutProps, profileCardProps])

//   return profileProps
// }
