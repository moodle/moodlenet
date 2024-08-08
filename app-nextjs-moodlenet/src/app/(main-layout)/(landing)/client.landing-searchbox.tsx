'use client'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

interface Props {
  initialSearchText: string
  placeholder: string
}
export default function ClientLandingHeaderSearchbox({ initialSearchText, placeholder }: Props) {
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
