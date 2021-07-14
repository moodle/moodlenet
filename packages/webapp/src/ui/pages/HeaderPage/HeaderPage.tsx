import { FC } from 'react'
import Header, { HeaderProps } from '../../components/Header/Header'
import SubHeader, { SubHeaderProps } from '../../components/SubHeader/SubHeader'
import { WithProps } from '../../lib/ctrl'
import './styles.scss'

export type HeaderPageProps = {
  headerWithProps: WithProps<HeaderProps>
} & (
  | {
      status: 'idle'
      subHeaderProps: SubHeaderProps | null
    }
  | {
      status: 'loading'
    }
)

export const HeaderPage: FC<HeaderPageProps> = props => {
  if (props.status === 'loading') {
    return null
  }
  const { headerWithProps, subHeaderProps } = props
  const [HeaderCtrl, headerProps] = headerWithProps(Header)
  return (
    <div className="page-header">
      <HeaderCtrl {...headerProps} />
      {subHeaderProps && <SubHeader {...subHeaderProps} />}
    </div>
  )
}

export default HeaderPage
