import { Trans } from '@lingui/macro';
import { FC } from 'react';
import { NewResourceProgressState, NewResourceState } from '../../../pages/NewResource/NewResource';
import './styles.scss';

export type ProgressStateProps = {
  states: NewResourceProgressState
  currentState: NewResourceState
} 

export const ProgressState: FC<ProgressStateProps> = ({ states, currentState }) => {
  const currentIndex = states.map(state => state[0]).indexOf(currentState)
  const title = states[currentIndex]![1]
  
  return (
    <div className="progress-state">
      <div className="title"><span>{currentIndex + 1}</span><Trans>{title}</Trans></div> 
      <div className="progress-bar">
      {states.map((state, index) => {
        return <div className={state[0] === currentState ? 'current' : currentIndex > index ? 'done' : 'todo'}></div>
      })}
      </div>   
    </div>
  
  )
}

export default ProgressState
