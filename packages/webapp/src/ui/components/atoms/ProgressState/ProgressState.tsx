import { FC } from 'react'
import './styles.scss'

export type ProgressStateProps = {
  stateNames: string[]
  progressSubtitles?: string[]
  currentIndex: number
}

export const ProgressState: FC<ProgressStateProps> = ({
  stateNames,
  progressSubtitles,
  currentIndex,
}) => {
  const title = stateNames[currentIndex]
  const subtitle = progressSubtitles && progressSubtitles[currentIndex]

  return (
    <div className="progress-state">
      <div className="progress-header">
        <span className="number">{currentIndex + 1}</span>
        <span className="title">{title}</span>
        {subtitle && <span className="subtitle">{subtitle}</span>}
      </div>
      <div className="progress-bar">
        {stateNames.map((state, index) => {
          return (
            <div
              key={state}
              className={
                index === currentIndex
                  ? 'current'
                  : currentIndex > index
                  ? 'done'
                  : 'todo'
              }
            ></div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressState
