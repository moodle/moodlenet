import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { ArrowForwardIosRounded } from '@mui/icons-material'
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
      content={useMemo(
        () =>
          profilesPropsList
            .slice(0, 11)
            .map(profilePropsList => (
              <ProfileCard key={profilePropsList.data.userId} {...profilePropsList} />
            )),
        [profilesPropsList],
      )}
      className={`people-list`}
      noCard={true}
      minGrid={170}
      maxHeight={267}
      title={
        <div className="card-header">
          <div className="info">
            <div className="title">Featured authors</div>
            <div className="subtitle">Authors with outstanding contributions</div>
          </div>
          {
            <SecondaryButton className="more" color="dark-blue">
              <Link href={searchAuthorsHref}>See more authors</Link>
              <ArrowForwardIosRounded />
            </SecondaryButton>
          }
        </div>
      }
    />
  )
}

LandingProfileList.defaultProps = {}

export default LandingProfileList
