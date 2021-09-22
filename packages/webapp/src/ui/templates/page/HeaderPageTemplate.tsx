import React from 'react'
import Footer from '../../components/molecules/Footer/Footer'
import { CP, withCtrl } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  headerPageProps: CP<HeaderPageProps>
  isAuthenticated: boolean
  showSubHeader?: boolean
  hideSearchbox?: boolean
  cookiesAccepted?: boolean
  style?: React.CSSProperties
}

export const HeaderPageTemplate = withCtrl<HeaderPageTemplateProps>(
  ({ headerPageProps, isAuthenticated, hideSearchbox, cookiesAccepted, /*showSubHeader,*/ style, children }) => {
    return (
      <MainPageWrapper cookiesAccepted={cookiesAccepted ? true : false}>
        <HeaderPage {...headerPageProps} isAuthenticated={isAuthenticated} hideSearchbox={hideSearchbox}/>
        {/*<div className={`view ${isAuthenticated && showSubHeader ? 'double-header-page' : 'single-header-page'}`}   Uncomment when Tags implemented*/}
        <div className="view single-header-page" style={style}>
          {children}
          <Footer />
        </div>
      </MainPageWrapper>
    )
  },
)
HeaderPageTemplate.displayName = 'HeaderPageTemplate'
HeaderPageTemplate.defaultProps = {
  showSubHeader: true,
  cookiesAccepted: true
}
