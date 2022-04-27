import ArrowAltIcon from '@material-ui/icons/ArrowRightAltRounded'
import SwapVertIcon from '@material-ui/icons/SwapVertRounded'
import { FC, useCallback, useEffect, useState } from 'react'
import PrimaryButton from '../../../../atoms/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../../../atoms/SecondaryButton/SecondaryButton'
import './styles.scss'

export type SortState = 'inactive' | 'more' | 'less'

export type SortButtonProps = {
  label: string
  state?: SortState
  active?: boolean
  clicked: (label: string, state: SortState) => void
}

export const SortButton: FC<SortButtonProps> = ({
  label,
  state,
  clicked,
  active,
}) => {
  const [inState, setInState] = useState(state)

  useEffect(() => {
    !active && setInState('inactive')
  }, [active, inState])

  const onClick = useCallback(() => {
    const nextState =
      inState === 'inactive' ? 'more' : inState === 'more' ? 'less' : 'inactive'
    setInState(nextState)
    clicked(label, nextState)
  }, [clicked, inState, label])

  const labelElement = <span className="label">{label}</span>

  return (
    <div className={`sort-button ${inState}`}>
      {inState === 'inactive' ? (
        <SecondaryButton color="grey" onClick={onClick}>
          <SwapVertIcon />
          {labelElement}
        </SecondaryButton>
      ) : (
        <PrimaryButton color="blue" onClick={onClick}>
          {inState === 'more' && <ArrowAltIcon />}
          {inState === 'less' && <ArrowAltIcon />}
          {labelElement}
        </PrimaryButton>
      )}
    </div>
  )
}

SortButton.defaultProps = {
  state: 'inactive',
  active: false,
}

export default SortButton
