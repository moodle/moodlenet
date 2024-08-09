'use client'
import PrimaryButton from '@/components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

export function ShareButton_Cli() {
  return (
    <PrimaryButton className="share-content" color="blue" onClick={undefined}>
      Publish content
    </PrimaryButton>
  )
}

export function HeadSearchbox_Cli({
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
        onChange: console.log,
        trigger: { text: 'Search', onClick: console.log },
      }}
    />
  )
}
