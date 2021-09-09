import React from 'react'
import { CP, withCtrl } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../../pages/HeaderPage/HeaderPage'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  headerPageProps: CP<HeaderPageProps>
  isAuthenticated: boolean
  showSubHeader?: boolean
  hideSearchbox?: boolean
  style?: React.CSSProperties
}

export const HeaderPageTemplate = withCtrl<HeaderPageTemplateProps>(
  ({ headerPageProps, isAuthenticated, hideSearchbox, /*showSubHeader,*/ style, children }) => {
    return (
      <MainPageWrapper>
        <HeaderPage {...headerPageProps} isAuthenticated={isAuthenticated} hideSearchbox={hideSearchbox} />
        {/*<div className={`view ${isAuthenticated && showSubHeader ? 'double-header-page' : 'single-header-page'}`}   Uncomment when Tags implemented*/}
        <div className="view single-header-page" style={style}>
          {children}
        </div>
      </MainPageWrapper>
    )
  },
)
HeaderPageTemplate.displayName = 'HeaderPageTemplate'
HeaderPageTemplate.defaultProps = {
  showSubHeader: true,
}
