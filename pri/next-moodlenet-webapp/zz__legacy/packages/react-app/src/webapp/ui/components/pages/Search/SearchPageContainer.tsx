import type { FC } from 'react'
import { Search } from './Search'
import { useSearchProps } from './SearchPageHook.mjs'

export const SearchPageContainer: FC = () => {
  const { searchProps, wrappers } = useSearchProps()
  return wrappers.reduceRight(
    (wrapChildren, { key, Wrapper }) => <Wrapper key={key}>{wrapChildren}</Wrapper>,
    <Search {...searchProps} />,
  )
}
