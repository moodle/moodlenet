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
  className?: string
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
  const getValueString = (value: string | number) =>
    typeof value === 'number' ? value.toLocaleString() : value

  return !items || items.length === 0 ? null : (
    <Card
      className="overall-card"
      key="overall-card"
      hideBorderWhenSmall={hideBorderWhenSmall}
      noCard={noCard}
    >
      <div className="overall-container">
        {items && items.length > 0 && showIcons
          ? items?.map(({ name, Icon, value, className }) => {
              return (
                <abbr className="data" title={name} key={name}>
                  <div className={`title-icon ${className}`}>
                    <Icon />
                  </div>
                  {getValueString(value)}
                </abbr>
              )
            })
          : items?.map(({ name, href, value }) => {
              return href ? (
                <Link href={href} className="data" title={name} key={name}>
                  {getValueString(value)}
                  <span>{name}</span>
                </Link>
              ) : (
                <abbr className="data" title={name} key={name}>
                  {getValueString(value)}
                  <span>{name}</span>
                </abbr>
              )
            })}
      </div>
    </Card>
  )
}

OverallCard.defaultProps = {
  showIcons: false,
}
