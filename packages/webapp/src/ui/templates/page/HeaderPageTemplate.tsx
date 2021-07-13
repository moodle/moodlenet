import { FC } from 'react'
import { WithProps } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import '../../styles/view.scss'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  headerPageWithProps: WithProps<HeaderPageProps>
  isAuthenticated: boolean
}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ headerPageWithProps, isAuthenticated, children }) => {
  const [HeaderPageCtrl, headerPageProps] = headerPageWithProps(HeaderPage)
  return (
    <MainPageWrapper>
      <HeaderPageCtrl {...headerPageProps} />
      <div className={`view ${isAuthenticated ? 'logged-in' : 'logged-out'}`}>{children}</div>
    </MainPageWrapper>
  )
}
