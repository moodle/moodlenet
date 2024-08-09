'use client'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'

export default function HeaderSearchbox({ placeholder }: { placeholder: string }) {
  return (
    <Searchbox
      {...{
        placeholder,
        onChange: console.log,
        boxSize: 'small',
        trigger: { onClick: console.log },
      }}
    />
  )
}
