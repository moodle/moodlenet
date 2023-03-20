import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { ArrowForwardRounded } from '@mui/icons-material'
import { FC, useMemo } from 'react'
import { Link } from '../../../elements/link.js'
import { ProfileCard, ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
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
