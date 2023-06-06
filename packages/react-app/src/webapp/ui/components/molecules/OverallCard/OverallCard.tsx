// import { t, Trans } from '@lingui/macro'
import { Card } from '@moodlenet/component-library'
// import { Card } from '@moodlenet/react-app'
import type { ComponentType, FC } from 'react'
import type { Href } from '../../../../../common/lib.mjs'
import { Link } from '../../elements/link.js'
// import { Href, Link } from '../../../../elements/link'
import './OverallCard.scss'

export type OverallCardItem = {
  Icon: ComponentType
  name: string
  value: string | number
  href?: Href
}

export type OverallCardProps = {
  items: OverallCardItem[]
  hideBorderWhenSmall?: boolean
  noCard?: boolean
  showIcons?: boolean
}

export const OverallCard: FC<OverallCardProps> = ({
  items,
  hideBorderWhenSmall,
  showIcons,
  noCard,
}) => {
  return !items || items.length === 0 ? null : (
    <Card
      className="overall-card"
      key="overall-card"
      hideBorderWhenSmall={hideBorderWhenSmall}
      noCard={noCard}
    >
      <div className="overall-container">
        {items && items.length > 0 && showIcons
          ? items?.map(item => {
              return (
                <div className="data" key="item.name">
                  <abbr title={`${item.name}`}>
                    <item.Icon />
                  </abbr>
                  {item.value}
                </div>
              )
            })
          : items?.map(item => {
              return item.href ? (
                <Link href={item.href} className="data" key={item.name}>
                  {item.value}
                  <span>{item.name}</span>
                </Link>
              ) : (
                <div className="data" key={item.name}>
                  {item.value}
                  <span>{item.name}</span>
                </div>
              )
            })}
      </div>
    </Card>
  )
}

OverallCard.defaultProps = {
  showIcons: false,
}
