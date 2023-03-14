import { Href, ListCard, SecondaryButton } from '@moodlenet/component-library'
import { ArrowForwardIosRounded } from '@mui/icons-material'
import { FC, useMemo } from 'react'
import { Link } from '../../elements/link.js'
import { SmallProfileCard, SmallProfileCardProps } from '../SmallProfileCard/SmallProfileCard.js'
import './SmallProfileCardList.scss'

export type SmallProfileCardListProps = {
  searchAuthorsHref: Href
  smallProfileCardPropsList: SmallProfileCardProps[]
}

export const SmallProfileCardList: FC<SmallProfileCardListProps> = ({
  smallProfileCardPropsList,
  searchAuthorsHref,
}) => {
  return (
    <ListCard
      content={useMemo(
        () =>
          smallProfileCardPropsList
            .slice(0, 11)
            .map(smallProfileCardProps => (
              <SmallProfileCard
                key={smallProfileCardProps.data.userId}
                {...smallProfileCardProps}
              />
            )),
        [smallProfileCardPropsList],
      )}
      title={
        <div className="card-header">
          <div className="info">
            <div className="title">Featured authors</div>
            <div className="subtitle">Authors with outstanding contributions</div>
          </div>
          {
            <SecondaryButton className="more" color="dark-blue">
              <Link href={searchAuthorsHref}>See more authors</Link>
              <ArrowForwardIosRounded />
            </SecondaryButton>
          }
        </div>
      }
      className={`people-list`}
      noCard={true}
      minGrid={170}
      maxHeight={267}
      // maxRows={1}
    />
  )
}

SmallProfileCardList.defaultProps = {}

export default SmallProfileCardList
