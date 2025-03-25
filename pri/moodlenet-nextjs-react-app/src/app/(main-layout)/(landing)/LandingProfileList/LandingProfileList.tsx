'use client'
import { ListCard } from '../../../../ui/molecules/ListCard/ListCard'
import { ProfileCard, profileCardProps } from '../../../../ui/molecules/ProfileCard/ProfileCard'
import './LandingProfileList.scss'

export type landingProfileListProps = {
  suggestedContributorList: profileCardProps[]
  authenticatedUser: boolean
}

export function LandingProfileList({ authenticatedUser, suggestedContributorList }: landingProfileListProps) {
  return (
    <ListCard
      className={`landing-profile-list`}
      content={suggestedContributorList.map(props => ({
        key: props.profileHomeRoute,
        el: <ProfileCard {...props} />,
      }))}
      header={
        <div className="card-header">
          <div className="info">
            <div className="title">{authenticatedUser ? 'Authors selection' : 'Featured authors'}</div>
            <div className="subtitle">
              {authenticatedUser ? 'Top contributors you might appreciate' : 'Authors with outstanding contributions'}
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
