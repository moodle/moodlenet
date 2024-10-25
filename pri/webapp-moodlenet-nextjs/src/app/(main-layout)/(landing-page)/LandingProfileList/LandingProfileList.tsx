'use client'
import { ListCard } from '../../../../ui/molecules/ListCard/ListCard'
import { ProfileCard, profileCardProps } from '../../../../ui/molecules/ProfileCard/ProfileCard'
import './LandingProfileList.scss'

export type landingProfileListProps = {
  profilesPropsList: profileCardProps[]
  areCurrentUserSuggestions: boolean
}

export function LandingProfileList({ profilesPropsList, areCurrentUserSuggestions }: landingProfileListProps) {
  return (
    <ListCard
      className={`landing-profile-list`}
      content={profilesPropsList.map(props => ({
        key: props.userProfile.id,
        el: <ProfileCard {...props} />,
      }))}
      header={
        <div className="card-header">
          <div className="info">
            <div className="title">{areCurrentUserSuggestions ? 'Authors selection' : 'Featured authors'}</div>
            <div className="subtitle">
              {areCurrentUserSuggestions
                ? 'Top contributors you might appreciate'
                : 'Authors with outstanding contributions'}
            </div>
          </div>
        </div>
      }
      noCard={true}
      minGrid={170}
      maxRows={2}
    />
  )
}
