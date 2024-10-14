'use client'
import { Trans } from 'react-i18next'
import HatLogo from '../../lib/assets/icons/hat-moodle.svg'
import './Fallback.scss'

export function Fallback() {

  return (
    <div className="fallback-page">
      <div className="content">
        <Trans>Page not found or access not allowed</Trans>
      </div>
      <div className="hat-logo">
        <HatLogo />
      </div>
    </div>
  )
}
