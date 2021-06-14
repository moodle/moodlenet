import { FC } from 'react'
import { PageHeader, PageHeaderProps } from '../../components/PageHeader'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  pageHeaderProps: PageHeaderProps
}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ pageHeaderProps, children }) => {
  return (
    <MainPageWrapper>
      <PageHeader {...pageHeaderProps} />
      {children}
    </MainPageWrapper>
  )
}
