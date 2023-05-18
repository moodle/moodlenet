import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import { ProfileCard } from '../../ProfileCard/ProfileCard.js'
import './BrowserProfileList.scss'

export type BrowserProfileListProps = {
  profilesCardPropsList: ProfileCardProps[]
  showAll: boolean
  setShowAll: React.Dispatch<React.SetStateAction<string | undefined>>
  loadMore: (() => unknown) | null
}

export const BrowserProfileList: FC<BrowserProfileListProps> = ({
  profilesCardPropsList,
  showAll,
  setShowAll,
  loadMore,
}) => {
  return (
    <ListCard
      className={`browser-profile-list ${showAll ? 'show-all' : ''}  ${
        loadMore ? 'load-more' : ''
      }`}
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
        showAll ? (
          loadMore ? (
            <TertiaryButton onClick={loadMore}>Load more</TertiaryButton>
          ) : null
        ) : (
          <TertiaryButton onClick={() => setShowAll('people-list')}>
            See all people results
          </TertiaryButton>
        )
      }
      minGrid={170}
      maxRows={showAll ? undefined : 2}
    />
  )
}

BrowserProfileList.defaultProps = {}

export default BrowserProfileList
