import { FC, useState } from 'react'
import './Switch.scss'

export type SwitchProps = {
  enabled: boolean
  mandatory?: boolean
  size?: 'small' | 'medium' | 'big'
  className?: string
  onClick?(arg0?: unknown): unknown
  onMouseDown?(arg0: unknown): unknown
}

export const Switch: FC<SwitchProps> = ({ className, enabled, mandatory, size, onClick, onMouseDown }) => {
  const [localEnabled, setLocalEnabled] = useState(enabled)
  const [animation, setAnimation] = useState<'to-on' | 'to-off' | undefined>(undefined)

  return (
    <div
      className={`switch ${className ? className : ''}  ${/* enabled */ localEnabled ? 'on' : 'off'} ${
        mandatory ? 'disabled' : ''
      } ${size} `}
      // onClick={onClick}
      onClick={() => {
        onClick && onClick()
        setLocalEnabled(p => {
          setAnimation(p ? 'to-off' : 'to-on')
          return !p
        })
      }}
      onMouseDown={onMouseDown}
    >
      <div className={`moving-part ${animation} ${/* enabled */ localEnabled ? 'on' : 'off'} ${size}`} />
    </div>
  )
}

Switch.defaultProps = {
  size: 'big',
}

export default Switch