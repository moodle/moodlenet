import type { FC } from 'react'
import { useState } from 'react'
import './Switch.scss'

export type SwitchProps = {
  enabled: boolean
  mandatory?: boolean
  size?: 'small' | 'medium' | 'big'
  className?: string
  toggleSwitch(arg0?: unknown): unknown
}

export const Switch: FC<SwitchProps> = ({ className, enabled, mandatory, size, toggleSwitch }) => {
  const [localEnabled, setLocalEnabled] = useState(enabled)
  const [animation, setAnimation] = useState<'to-on' | 'to-off' | undefined>(undefined)

  const onClick = () => {
    toggleSwitch()
    setLocalEnabled(p => {
      setAnimation(p ? 'to-off' : 'to-on')
      return !p
    })
  }

  return (
    <div
      className={`switch ${className ? className : ''}  ${localEnabled ? 'on' : 'off'} ${
        mandatory ? 'disabled' : ''
      } ${size} `}
      onClick={onClick}
    >
      <div
        className={`moving-part ${animation} ${/* enabled */ localEnabled ? 'on' : 'off'} ${size}`}
      />
    </div>
  )
}

Switch.defaultProps = {
  size: 'big',
}

export default Switch
