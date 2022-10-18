import { MainLayout, MainLayoutProps } from '@moodlenet/react-app/ui.mjs'
import { ComponentType, FC } from 'react'
import { OverallCard, OverallCardProps } from '../../molecules/OverallCard/OverallCard.js'
import { ProfileCard, ProfileCardProps } from '../../organisms/ProfileCard/ProfileCard.js'
import './Profile.scss'

export type ProfileProps = {
  mainLayoutProps: MainLayoutProps
  overallCardProps: OverallCardProps
  profileCardProps: ProfileCardProps
  mainColumnContent?: { Comp: ComponentType<{ callback(): void }>; key: string; callback(): void }[]
  // mainColumnContent?: { Comp: ComponentType; key: string }[]
}

export const Profile: FC<ProfileProps> = ({
  mainLayoutProps,
  overallCardProps,
  profileCardProps,
  mainColumnContent,
}) => {
  return (
    <MainLayout {...mainLayoutProps}>
      <div className="profile">
        <div className="content">
          <div className="main-column">
            <ProfileCard {...profileCardProps} />
            {mainColumnContent?.map(({ Comp, key, callback }) => {
              return <Comp key={key} callback={callback} />
            })}
          </div>
          <div className="side-column">
            <OverallCard {...overallCardProps} />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
Profile.displayName = 'ProfilePage'
export default Profile
