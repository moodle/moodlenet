import { FC } from 'react'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import '../../styles/view.scss'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  headerPageProps: HeaderPageProps
}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ headerPageProps, children }) => {
  return (
    <MainPageWrapper>
      <HeaderPage {...headerPageProps} />
      <div className={`view ${headerPageProps.headerProps.me ? "logged-in" : "logged-out"}`}>{children}</div>
    </MainPageWrapper>
  )
}
