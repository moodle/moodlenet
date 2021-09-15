import { FC } from 'react'
import { Card } from '../../atoms/Card/Card'
import './styles.scss'

export type OverallCardProps = {
  followers: number
  resources: number
  years: number | string
  kudos: number
  hideBorderWhenSmall?: boolean
  noCard?: boolean
}

export const OverallCard: FC<OverallCardProps> = ({ followers, resources, kudos, hideBorderWhenSmall, noCard }) => {
  return (
    <Card className="overall-card" hideBorderWhenSmall={hideBorderWhenSmall} noCard={noCard}>
      <div className="data">
        {followers}
        <span>Followers</span>
      </div>
      <div className="data">
        {kudos}
        <span>Kudos</span>
      </div>
      <div className="data">
        {resources}
        <span>Resources</span>
      </div>
      {/*<div className="data">{props.years} years ago<span>Joined</span></div>*/}
    </Card>
  )
}
