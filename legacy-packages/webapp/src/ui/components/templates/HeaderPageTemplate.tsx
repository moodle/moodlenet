import React from 'react'
import Footer from '../../components/organisms/Footer/Footer'
import { CP, withCtrl } from '../../lib/ctrl'
import HeaderPage, { HeaderPageProps } from '../pages/HeaderPage/HeaderPage'
import { MainPageWrapper, MainPageWrapperProps } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  mainPageWrapperProps: CP<MainPageWrapperProps>
  headerPageProps: CP<HeaderPageProps>
  isAuthenticated: boolean
  showSubHeader?: boolean
  hideSearchbox?: boolean
  hideHeader?: boolean
  style?: React.CSSProperties
  className?: string
}

export const HeaderPageTemplate = withCtrl<HeaderPageTemplateProps>(
  ({
    headerPageProps,
    className,
    isAuthenticated,
    hideSearchbox,
    hideHeader,
    mainPageWrapperProps,
    /*showSubHeader,*/ style,
    children,
  }) => {
    return (
      <MainPageWrapper {...mainPageWrapperProps}>
        {!hideHeader && (
          <HeaderPage {...headerPageProps} hideSearchbox={hideSearchbox} />
        )}
        {/*<div className={`view ${isAuthenticated && showSubHeader ? 'double-header-page' : 'single-header-page'}`}   Uncomment when Tags implemented*/}
        <div className={`view single-header-page ${className}`} style={style}>
          {children}
          <Footer isAuthenticated={isAuthenticated} />
        </div>
      </MainPageWrapper>
    )
  }
)
HeaderPageTemplate.displayName = 'HeaderPageTemplate'
HeaderPageTemplate.defaultProps = {
  showSubHeader: true,
}
