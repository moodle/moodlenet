import type { Href } from '@moodlenet/component-library'
import { ListCard, SecondaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { ArrowForwardRounded } from '@mui/icons-material'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import { ProfileCard } from '../../ProfileCard/ProfileCard.js'
import './LandingProfileList.scss'

export type LandingProfileListProps = {
  searchAuthorsHref: Href
  profilesPropsList: ProfileCardProps[]
}

export const LandingProfileList: FC<LandingProfileListProps> = ({
  profilesPropsList,
  searchAuthorsHref,
}) => {
  return (
    <ListCard
      className={`landing-profile-list`}
      content={useMemo(
        () =>
          profilesPropsList
            .slice(0, 11)
            .map(profilePropsList => (
              <ProfileCard key={profilePropsList.data.userId} {...profilePropsList} />
            )),
        [profilesPropsList],
      )}
      header={
        <div className="card-header">
          <div className="info">
            <div className="title">Featured authors</div>
            <div className="subtitle">Authors with outstanding contributions</div>
          </div>
          {
            <SecondaryButton className="more" color="dark-blue">
              <Link href={searchAuthorsHref}>See more authors</Link>
              <ArrowForwardRounded />
            </SecondaryButton>
          }
        </div>
      }
      noCard={true}
      minGrid={170}
      maxRows={2}
    />
  )
}

LandingProfileList.defaultProps = {}

export default LandingProfileList
