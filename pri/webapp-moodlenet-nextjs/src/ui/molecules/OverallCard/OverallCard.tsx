import Link from 'next/link'
import type { ComponentType } from 'react'
import { Card } from '../../atoms/Card/Card'
import './OverallCard.scss'

export type overallCardItem = {
  Icon: ComponentType
  name: string
  value: string | number
  className?: string
  href?: string
}

export type overallCardProps = {
  items: overallCardItem[]
  hideBorderWhenSmall?: boolean
  noCard?: boolean
  showIcons?: boolean
}

export function OverallCard({ items, hideBorderWhenSmall, showIcons, noCard }: overallCardProps) {
  return !items || items.length === 0 ? null : (
    <Card className="overall-card" key="overall-card" hideBorderWhenSmall={hideBorderWhenSmall} noCard={noCard}>
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
function getValueString(value: string | number) {
  return typeof value === 'number' ? value.toLocaleString() : value
}
