import ArrowAltIcon from '@material-ui/icons/ArrowRightAltRounded'
import SwapVertIcon from '@material-ui/icons/SwapVertRounded'
import { FC, useCallback, useState } from 'react'
import './styles.scss'

export type SortState = 'inactive' | 'more' | 'less'

export type SortButtonProps = {
  label: string
  state?: SortState
  active?: boolean
  clicked: (label: string, state: SortState) => void
}

export const SortButton: FC<SortButtonProps> = ({ label, state, clicked, active }) => {
  const [inState, setInState] = useState(state)

  const onClick = useCallback(() => {
    const nextState = inState === 'inactive' ? 'more' : inState === 'more' ? 'less' : 'inactive'
    setInState(nextState)
    clicked(label, nextState)
  }, [clicked, inState, label])

  return (
    <div className={`check-button ${active ? inState : 'inactive'}`} onClick={onClick}>
      <div className="icon inactive-icon">
        <SwapVertIcon />
      </div>
      <div className="icon more-icon">
        <ArrowAltIcon />
      </div>
      <div className="icon less-icon">
        <ArrowAltIcon />
      </div>
      <span className="label">{label}</span>
    </div>
  )
}

SortButton.defaultProps = {
  state: 'inactive',
  active: false,
}

export default SortButton
