import { CSSProperties, FC, ReactNode } from 'react'
import { Organization } from '../../../types.js'
import './SimpleLayout.scss'
export declare type SimpleLayoutProps = {
  style?: CSSProperties
  contentStyle?: CSSProperties
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
  organization: Organization
  children?: ReactNode
}
declare const SimpleLayout: FC<SimpleLayoutProps>
export default SimpleLayout
//# sourceMappingURL=SimpleLayout.d.ts.map
