'use client'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

interface Props {
  initialSearchText: string
  placeholder: string
}
export default function HeaderSearchbox({ initialSearchText, placeholder }: Props) {
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
