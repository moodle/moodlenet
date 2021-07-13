import { FC } from 'react'
import Header, { HeaderProps } from '../../components/Header/Header'
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader'
import { WithProps } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  withHeaderProps: WithProps<HeaderProps>
  withSubHeaderProps: WithProps<SubHeaderProps>
  // isAuthenticated: boolean
}

export const HeaderPage: FC<HeaderPageProps> = ({ withHeaderProps, withSubHeaderProps /* , isAuthenticated  */ }) => {
  const [HeaderWithProps, headerProps] = withHeaderProps(Header)
  const [SubHeaderWithProps, subHeaderProps] = withSubHeaderProps(SubHeader)
  return (
    <div className="page-header">
      <HeaderWithProps {...headerProps} />
      <SubHeaderWithProps {...subHeaderProps} />
    </div>
  )
}

export default HeaderPage
