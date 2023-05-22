import { ListCard, TertiaryButton } from '@moodlenet/component-library'
import type { BrowserMainColumnItemBase, ProxyProps } from '@moodlenet/react-app/ui'
import type { FC } from 'react'
import { useMemo } from 'react'
import type { ProfileCardProps } from '../../ProfileCard/ProfileCard.js'
import { ProfileCard } from '../../ProfileCard/ProfileCard.js'
import './BrowserProfileList.scss'

export type BrowserProfileListProps = {
  profilesCardPropsList: { props: ProxyProps<ProfileCardProps>; key: string }[]
  loadMore: (() => unknown) | null
} & BrowserMainColumnItemBase

export const BrowserProfileList: FC<BrowserProfileListProps> = ({
  profilesCardPropsList,
  showAll,
  setShowAll,
  loadMore,
  showHeader,
}) => {
  console.log('showHeader', showHeader)
  return (
    <ListCard
      noCard={showAll && !showHeader}
      className={`browser-profile-list ${showAll ? 'show-all' : ''}  ${
        loadMore ? 'load-more' : ''
      }`}
      content={useMemo(
        () =>
          profilesCardPropsList
            // .slice(0, 11)
            .map(({ props, key }) => {
              return <ProfileCard key={key} {...props} />
            }),
        [profilesCardPropsList],
      )}
      header={
        showHeader && (
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
        )
      }
      footer={
        showAll ? (
          loadMore ? (
            <TertiaryButton onClick={loadMore}>Load more</TertiaryButton>
          ) : null
        ) : (
          <TertiaryButton onClick={setShowAll}>See all people results</TertiaryButton>
        )
      }
      minGrid={170}
      maxRows={showAll ? undefined : 2}
    />
  )
}

BrowserProfileList.defaultProps = { showHeader: true }

export default BrowserProfileList
