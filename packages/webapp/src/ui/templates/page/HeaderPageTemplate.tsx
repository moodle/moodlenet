import { FC } from 'react'
import { WithProps } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import '../../styles/view.scss'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  withHeaderPageProps: WithProps<HeaderPageProps>
  isAuthenticated: boolean
}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ withHeaderPageProps, isAuthenticated, children }) => {
  const [HeaderPageWithProps, headerPageProps] = withHeaderPageProps(HeaderPage)
  return (
    <MainPageWrapper>
      <HeaderPageWithProps {...headerPageProps} />
      <div className={`view ${isAuthenticated ? 'logged-in' : 'logged-out'}`}>{children}</div>
    </MainPageWrapper>
  )
}
