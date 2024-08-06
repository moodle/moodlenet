import type { FC } from 'react'
import './Switch.scss'

export type SwitchProps = {
  enabled: boolean
  mandatory?: boolean
  size?: 'small' | 'medium' | 'big'
  className?: string
  toggleSwitch(arg0?: unknown): unknown
}

export const Switch: FC<SwitchProps> = ({ className, enabled, mandatory, size, toggleSwitch }) => {
  return (
    <div
      className={`switch ${className ? className : ''}  ${enabled ? 'on' : 'off'} ${
        mandatory ? 'disabled' : ''
      } ${size} `}
      onClick={toggleSwitch}
    >
      <div
        className={`moving-part ${enabled ? 'to-on' : 'to-off'} ${enabled ? 'on' : 'off'} ${size}`}
      />
    </div>
  )
}

Switch.defaultProps = {
  size: 'big',
}

export default Switch
