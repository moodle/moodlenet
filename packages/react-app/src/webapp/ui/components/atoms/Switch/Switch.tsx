import { FC } from 'react'
import './Switch.scss'

export type SwitchProps = {
  enabled: boolean
  mandatory?: boolean
  className?: string
  onClick?(arg0: unknown): unknown
  onMouseDown?(arg0: unknown): unknown
}

export const Switch: FC<SwitchProps> = ({ className, enabled, mandatory, onClick, onMouseDown }) => {
  return (
    <div
      className={`switch ${className ? className : ''}  ${enabled ? 'on' : 'off'} ${mandatory ? 'disabled' : ''}`}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <div className="moving-part" />
    </div>
  )
}

Switch.defaultProps = {}

export default Switch
