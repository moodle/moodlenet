'use client'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

export default function HeaderSearchbox({ placeholder }: { placeholder: string }) {
  return (
    <Searchbox
      {...{
        placeholder,
        search: console.log,
        boxSize: 'small',
        triggerBtn: true,
      }}
    />
  )
}
