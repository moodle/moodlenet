import { FC } from 'react'
import './styles.scss'

export type ProgressStateProps = {
  stateNames: string[]
  currentIndex: number
}

export const ProgressState: FC<ProgressStateProps> = ({ stateNames, currentIndex }) => {
  const title = stateNames[currentIndex]

  return (
    <div className="progress-state">
      <div className="title">
        <span>{currentIndex + 1}</span>
        {title}
      </div>
      <div className="progress-bar">
        {stateNames.map((state, index) => {
          return (
            <div
              key={state}
              className={index === currentIndex ? 'current' : currentIndex > index ? 'done' : 'todo'}
            ></div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressState
