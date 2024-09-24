import type { Href } from '@moodlenet/component-library'
import { ListCard } from '@moodlenet/component-library'
import type { ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard'
import { ProfileCard } from '../../ProfileCard/ProfileCard'
import './LandingProfileList.scss'

export type LandingProfileListProps = {
  searchAuthorsHref: Href
  profilesPropsList: { props: ProxyProps<ProfileCardProps>; key: string }[]
  hasSetInterests: boolean
}

export const LandingProfileList: FC<LandingProfileListProps> = ({
  profilesPropsList,
  hasSetInterests,
  // searchAuthorsHref,
}) => {
  const title = (
    <div className="title">{hasSetInterests ? 'Authors selection' : 'Featured authors'}</div>
  )

  const subtitle = (
    <div className="subtitle">
      {hasSetInterests
        ? 'Top contributors you might appreciate'
        : 'Authors with outstanding contributions'}
    </div>
  )

  return (
    <ListCard
      className={`landing-profile-list`}
      content={useMemo(
        () =>
          profilesPropsList
            .slice(0, 11)
            .map(({ key, props }) => ({ key, el: <ProfileCard key={key} {...props} /> })),
        [profilesPropsList],
      )}
      header={
        <div className="card-header">
          <div className="info">
            {title}
            {subtitle}
          </div>
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
