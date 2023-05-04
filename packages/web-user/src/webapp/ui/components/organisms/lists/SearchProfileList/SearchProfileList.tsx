import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import { ProfileCard } from '../../ProfileCard/ProfileCard.js'
import './SearchProfileList.scss'

export type SearchProfileListProps = {
  profilesCardPropsList: ProfileCardProps[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const SearchProfileList: FC<SearchProfileListProps> = ({
  profilesCardPropsList,
  showAll,
  setShowAll,
}) => {
  return (
    <ListCard
      className={`search-profile-list ${showAll ? 'show-all' : ''}`}
      content={useMemo(
        () =>
          profilesCardPropsList
            // .slice(0, 11)
            .map(profileCardPropsList => (
              <ProfileCard key={profileCardPropsList.data.userId} {...profileCardPropsList} />
            )),
        [profilesCardPropsList],
      )}
      header={
        <div className="card-header">
          <div className="title">
            People
            {/* {peopleTitle ? peopleTitle : People} */}
          </div>
          {/* {!seeAll && ( */}
          {
            // <SecondaryButton
            //   // onClick={() => activateSeeAll('People')}
            //   color="dark-blue"
            // >
            //   See all
            // </SecondaryButton>
          }
        </div>
      }
      footer={
        !showAll ? (
          <TertiaryButton onClick={() => setShowAll('people-list')}>
            See all people results
          </TertiaryButton>
        ) : null
      }
      minGrid={170}
      maxRows={showAll ? undefined : 2}
    />
  )
}

SearchProfileList.defaultProps = {}

export default SearchProfileList
