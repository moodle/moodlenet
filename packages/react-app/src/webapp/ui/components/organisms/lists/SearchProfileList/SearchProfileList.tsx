import { ListCard, TertiaryButton } from '@moodlenet/component-library'
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
        <TertiaryButton
        // onClick={() => activateSeeAll('People')}
        >
          See all people results
        </TertiaryButton>
      }
      className={`search-profile-list`}
      minGrid={170}
      maxRows={2}
    />
  )
}

SearchProfileList.defaultProps = {}

export default SearchProfileList
