'use client'
// import { ReactComponent as SearchIcon } from '@/assets/icons/search.svg'
import SearchIcon from '@/assets/icons/search.svg'
// import Image from 'next/image'
import PrimaryButton from '../PrimaryButton/PrimaryButton'
import './Searchbox.scss'

export type SearchboxProps = {
  initialSearchText: string
  placeholder: string
  searchTextChange(text: string): void
  triggerSearch(): void
  size?: 'small' | 'big'
  showSearchButton?: boolean
}

export default function Searchbox({
  initialSearchText,
  placeholder,
  size = 'small',
  showSearchButton,
  triggerSearch,
  searchTextChange,
}: SearchboxProps) {
  console.log({ SearchIcon })
  return (
    <div className={`searchbox size-${size}`}>
      <SearchIcon />
      <label htmlFor="search-text" className="sr-only" hidden>
        Search
      </label>
      <input
        className="search-text"
        id="search-text"
        placeholder={placeholder}
        autoFocus
        defaultValue={initialSearchText}
        onChange={e => searchTextChange(e.target.value)}
        onKeyDown={e => e.code === 'Enter' && triggerSearch()}
      />
      {showSearchButton && (
        <PrimaryButton onClick={() => triggerSearch()}>
          <span>Search</span>
          {/* <Image src={SearchIcon} alt="search" width={15} /> */}
          <SearchIcon />
        </PrimaryButton>
      )}
    </div>
  )
}
