import { FC } from 'react'
import Header, { HeaderProps } from '../../components/Header/Header'
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader'
import { WithProps } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  headerWithProps: WithProps<HeaderProps>
  subHeaderWithProps: WithProps<SubHeaderProps>
  // isAuthenticated: boolean
}

export const HeaderPage: FC<HeaderPageProps> = ({ headerWithProps, subHeaderWithProps /* , isAuthenticated  */ }) => {
  const [HeaderCtrl, headerProps] = headerWithProps(Header)
  const [SubHeaderCtrl, subHeaderProps] = subHeaderWithProps(SubHeader)
  return (
    <div className="page-header">
      <HeaderCtrl {...headerProps} />
      <SubHeaderCtrl {...subHeaderProps} />
    </div>
  )
}

export default HeaderPage
