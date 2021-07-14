import { FC } from 'react'
import { WithProps } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import '../../styles/view.scss'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps =
  | {
      status: 'idle'
      headerPageWithProps: WithProps<HeaderPageProps>
      isAuthenticated: boolean
    }
  | {
      status: 'loading'
    }

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = props => {
  if (props.status === 'loading') {
    return null
  }
  const { headerPageWithProps, isAuthenticated, children } = props
  const [HeaderPageCtrl, headerPageProps] = headerPageWithProps(HeaderPage)
  return (
    <MainPageWrapper>
      <HeaderPageCtrl {...headerPageProps} />
      <div className={`view ${isAuthenticated ? 'logged-in' : 'logged-out'}`}>{children}</div>
    </MainPageWrapper>
  )
}
