import { ListCard, SecondaryButton } from '@moodlenet/component-library'
import { FC, ReactElement, useMemo } from 'react'
import { ProfileCard, ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import './SearchProfileList.scss'

export type SearchProfileListProps = {
  profilesCardPropsList: ProfileCardProps[]
  title?: ReactElement
}

export const SearchProfileList: FC<SearchProfileListProps> = ({ profilesCardPropsList }) => {
  return (
    <ListCard
      content={useMemo(
        () =>
          profilesCardPropsList
            .slice(0, 11)
            .map(profileCardPropsList => (
              <ProfileCard key={profileCardPropsList.data.userId} {...profileCardPropsList} />
            )),
        [profilesCardPropsList],
      )}
      title={
        <div className="card-header">
          <div className="title">
            People
            {/* {peopleTitle ? peopleTitle : People} */}
          </div>
          {/* {!seeAll && ( */}
          {
            <SecondaryButton
            // onClick={() => activateSeeAll('People')}
            >
              See more
            </SecondaryButton>
          }
        </div>
      }
      className={`people-list`}
      noCard={true}
      minGrid={170}
      maxHeight={267}
    />
  )
}

SearchProfileList.defaultProps = {}

export default SearchProfileList
