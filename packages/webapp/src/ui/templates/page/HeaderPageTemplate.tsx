import { FC } from 'react'
import { PageHeader, UsePageHeaderProps } from '../../components/PageHeader'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {
  useProps: UsePageHeaderProps
}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ useProps: headerUseProps, children }) => {
  return (
    <MainPageWrapper>
      <PageHeader useProps={headerUseProps} />
      {children}
    </MainPageWrapper>
  )
}
