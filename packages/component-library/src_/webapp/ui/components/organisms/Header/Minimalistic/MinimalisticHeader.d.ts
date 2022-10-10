import { FC, PropsWithChildren } from 'react'
import { Organization } from '../../../../types.js'
import './MinimalisticHeader.scss'
export declare type MinimalisticHeaderProps = {
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
  organization: Organization
}
declare const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>>
export default MinimalisticHeader
//# sourceMappingURL=MinimalisticHeader.d.ts.map
