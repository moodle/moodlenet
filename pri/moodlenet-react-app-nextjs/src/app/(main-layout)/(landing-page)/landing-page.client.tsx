'use client'
import { Trans, useTranslation } from 'next-i18next'
import { PrimaryButton } from '../../../ui/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '../../../ui/atoms/Searchbox/Searchbox'

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
