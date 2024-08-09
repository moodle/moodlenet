'use client'
import PrimaryButton from '@/components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

export function LandingHeadShareButton() {
  return (
    <PrimaryButton className="share-content" color="blue" onClick={undefined}>
      Publish content
    </PrimaryButton>
  )
}

export function LandingHeadSearchbox({
  defaultValue,
  placeholder,
}: {
  defaultValue: string
  placeholder: string
}) {
  return (
    <Searchbox
      {...{
        boxSize: 'big',
        icon: true,
        defaultValue,
        placeholder,
        search: console.log,
        triggerBtn: { label: 'Search' },
      }}
    />
  )
}
