'use client'
import { Trans, useTranslation } from 'next-i18next'
import { PrimaryButton } from '../../../ui/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../../ui/atoms/Searchbox/Searchbox'
import defaultBackground from '../../../ui/lib/assets/img/default-landing-background.png'
import { clientSlotItem } from '../../../lib/common/types'
import { moodlenetSiteInfo } from '@moodle/module/moodlenet'

export function LandingHeadShareButton() {
  return (
    <PrimaryButton className="share-content" color="blue" onClick={undefined}>
      <Trans>Publish content</Trans>
    </PrimaryButton>
  )
}

export function LandingHeadSearchbox() {
  const { t } = useTranslation()

  return (
    <Searchbox
      {...{
        boxSize: 'big',
        icon: true,
        defaultValue: '',
        placeholder: t('Search for open education content'),
        search: console.error,
        triggerBtn: { label: t('Search') },
      }}
    />
  )
}
export type landingPageHeaderProps = {
  headSlotItems: clientSlotItem[]
  moodlenetSiteInfo: moodlenetSiteInfo
}

export function LandingPageHeader({ headSlotItems, moodlenetSiteInfo }: landingPageHeaderProps) {
  const { subtitle, title } = moodlenetSiteInfo
  const headerStyle = {
    backgroundImage: `url("${defaultBackground.src}")`,
    backgroundSize: 'cover',
  }
  return (
    <div className="landing-header" style={headerStyle}>
      <div className="landing-title">
        <div className="title">{title}</div>
        <div className="subtitle">{subtitle}</div>
      </div>
      <LandingHeadSearchbox />
      {headSlotItems}
    </div>
  )
}
