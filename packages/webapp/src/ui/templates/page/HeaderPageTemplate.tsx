import { FC } from 'react'
import { useHeader } from '../../context'
import { MainPageWrapper } from './MainPageWrapper'

export type HeaderPageTemplateProps = {}

export const HeaderPageTemplate: FC<HeaderPageTemplateProps> = ({ children }) => {
  const Header = useHeader()

  return (
    <MainPageWrapper>
      {Header}
      {children}
    </MainPageWrapper>
  )
}
