'use client'
import PrimaryButton from 'ui-cmps/atoms/PrimaryButton/PrimaryButton'
import Searchbox from 'ui-cmps/atoms/Searchbox/Searchbox'

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
