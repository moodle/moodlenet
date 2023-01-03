import {
  ChangeEventHandler,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg'
import { elementFullyInViewPort } from '../../../helpers/utilities.js'
import './Searchbox.scss'

export type SearchboxProps = {
  searchText: string
  placeholder: string
  size?: 'small' | 'big'
  setSearchText(text: string): unknown
  setIsSearchboxInViewport?: Dispatch<SetStateAction<boolean>>
  marginTop?: number
}

export const Searchbox: FC<SearchboxProps> = ({
  searchText,
  placeholder,
  size,
  marginTop,
  setSearchText,
  setIsSearchboxInViewport,
}) => {
  const setSearchTextCB = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ev => setSearchText(ev.currentTarget.value),
    [setSearchText],
  )
  const searchboxRef = useRef<HTMLDivElement>(null)

  const setElementFullyInViewPort = useCallback(() => {
    if (setIsSearchboxInViewport) {
      searchboxRef.current && elementFullyInViewPort(searchboxRef.current, { marginTop: marginTop })
        ? setIsSearchboxInViewport(true)
        : setIsSearchboxInViewport(false)
    }
  }, [searchboxRef, marginTop, setIsSearchboxInViewport])

  useEffect(() => {
    setIsSearchboxInViewport && window.addEventListener('scroll', setElementFullyInViewPort, true)
    return () => {
      setIsSearchboxInViewport &&
        document.removeEventListener('scroll', setElementFullyInViewPort, true)
    }
  }, [setElementFullyInViewPort, setIsSearchboxInViewport])

  return (
    <div className={`searchbox size-${size}`} ref={searchboxRef}>
      <SearchIcon />
      <label htmlFor="search-text" className="sr-only" hidden>
        Search
      </label>
      <input
        className="search-text"
        id="search-text"
        placeholder={placeholder}
        autoFocus
        // defaultValue={''}
        defaultValue={searchText}
        onChange={setSearchTextCB}
      />
    </div>
  )
}

Searchbox.defaultProps = {
  size: 'small',
}

Searchbox.displayName = 'LandingPage'
export default Searchbox
