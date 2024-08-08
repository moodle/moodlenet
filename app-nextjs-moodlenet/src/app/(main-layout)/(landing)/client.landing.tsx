'use client'
import PrimaryButton from '@/components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

export async function ShareButton() {
  return (
    <PrimaryButton className="share-content" color="blue" onClick={undefined}>
      Publish content
    </PrimaryButton>
  )
}

export function HeaderSearchbox({
  initialSearchText,
  placeholder,
}: {
  initialSearchText: string
  placeholder: string
}) {
  return (
    <Searchbox
      {...{
        initialSearchText,
        placeholder,
        searchTextChange: () => undefined,
        triggerSearch: () => undefined,
        showSearchButton: true,
        size: 'big',
      }}
    />
  )
}
