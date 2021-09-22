import { FC } from 'react'
import { CP } from '../../../lib/ctrl'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../../Access/AccessHeader/AccessHeader'
import './styles.scss'

export type CookiesPolicyProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
}

export const CookiesPolicy: FC<CookiesPolicyProps> = ({accessHeaderProps}) => {

  return (
    <MainPageWrapper>
        {/* <MainPageWrapper onKeyDown={handleKeyDown}> */}
          <AccessHeader {...accessHeaderProps} page={'login'} />
    </MainPageWrapper>
  )
}

CookiesPolicy.displayName = 'CookiesPolicyPage'
