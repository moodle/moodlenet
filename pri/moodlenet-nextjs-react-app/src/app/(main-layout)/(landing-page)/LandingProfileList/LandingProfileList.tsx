'use client'
import { landingPageProps } from '@moodle/module/moodlenet-react-app'
import { useMySession } from '../../../../lib/client/globalContexts'
import { ListCard } from '../../../../ui/molecules/ListCard/ListCard'
import { ProfileCard } from '../../../../ui/molecules/ProfileCard/ProfileCard'
import './LandingProfileList.scss'

export type landingProfileListProps = {
  suggestedContributorList: landingPageProps['suggestedContent']['contributors']
}

export function LandingProfileList({ suggestedContributorList: profilesPropsList }: landingProfileListProps) {
  const areCurrentUserSuggestions = useMySession().session.type === 'authenticated'
  return (
    <ListCard
      className={`landing-profile-list`}
      content={profilesPropsList.map(props => ({
        key: props.moodlenetContributorAccessObject.id,
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
