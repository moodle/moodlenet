import { FC } from 'react'
import './styles.scss'

export type ScoreCardProps = {
  kudos: number
  points: number
}

export const ScoreCard: FC<ScoreCardProps> = ({ kudos, points }) => {
  return (
    <div className="score-card">
      <div className="score">
        {points}
        <span>Points</span>
      </div>
      <div className="separator"></div>
      <div className="score">
        {kudos}
        <span>Kudos</span>
      </div>
    </div>
  )
}
