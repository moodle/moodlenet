'use client'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

export default function HeaderSearchbox({
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
        size: 'small',
      }}
    />
  )
}
