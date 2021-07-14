import { FC } from 'react'
import Header, { HeaderProps } from '../../components/Header/Header'
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader'
import { WithProps } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  headerWithProps: WithProps<HeaderProps>
  subHeaderProps: SubHeaderProps | null
}

export const HeaderPage: FC<HeaderPageProps> = ({ headerWithProps, subHeaderProps }) => {
  const [HeaderCtrl, headerProps] = headerWithProps(Header)
  return (
    <div className="page-header">
      <HeaderCtrl {...headerProps} />
      {subHeaderProps && <SubHeader {...subHeaderProps} />}
    </div>
  )
}

export default HeaderPage
