import { ListCard } from '@moodlenet/component-library'
import type { FC, ReactElement } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import { ProfileCard } from '../../ProfileCard/ProfileCard.js'
import './ProfileList.scss'

export type ProfileListProps = {
  smallProfileCardPropsList: ProfileCardProps[]
  title?: ReactElement
}

export const ProfileList: FC<ProfileListProps> = ({ smallProfileCardPropsList, title }) => {
  return (
    <ListCard
      content={useMemo(
        () =>
          smallProfileCardPropsList
            .slice(0, 11)
            .map(smallProfileCardProps => (
              <ProfileCard key={smallProfileCardProps.data.userId} {...smallProfileCardProps} />
            )),
        [smallProfileCardPropsList],
      )}
      {...(title
        ? {
            title: title,
          }
        : {})}
      className={`people-list`}
      noCard={true}
      minGrid={170}
      // maxHeight={267}
      maxRows={1}
    />
  )
}

ProfileList.defaultProps = {}

export default ProfileList
