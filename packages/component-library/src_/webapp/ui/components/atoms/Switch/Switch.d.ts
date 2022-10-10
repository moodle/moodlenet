import { FC } from 'react'
import './Switch.scss'
export declare type SwitchProps = {
  enabled: boolean
  mandatory?: boolean
  size?: 'small' | 'medium' | 'big'
  className?: string
  onClick?(arg0?: unknown): unknown
  onMouseDown?(arg0: unknown): unknown
}
export declare const Switch: FC<SwitchProps>
export default Switch
//# sourceMappingURL=Switch.d.ts.map
