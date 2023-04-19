import { AddonItem, Header, HeaderProps, Searchbox } from '@moodlenet/component-library'
import { createContext, Dispatch, FC, SetStateAction, useContext, useMemo, useState } from 'react'
import { HeaderTitle, HeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitle.js'
import './MainHeader.scss'

export type MainHeaderContextT = {
  setHideSearchbox: Dispatch<SetStateAction<boolean>>
  hideSearchbox: boolean
}
export const MainHeaderContext = createContext<MainHeaderContextT>({
  setHideSearchbox: () => undefined,
  hideSearchbox: false,
})

export function useSimpleMainHeaderContextController(defaultHide = false) {
  const [hideSearchbox, setHideSearchbox] = useState(defaultHide)
  const mainHeaderContextValue = useMemo<MainHeaderContextT>(() => {
    return {
      hideSearchbox,
      setHideSearchbox,
    }
  }, [hideSearchbox])
  return mainHeaderContextValue
}

export type MainHeaderProps = {
  leftItems: AddonItem[]
  centerItems: AddonItem[]
  rightItems: AddonItem[]
  headerTitleProps: HeaderTitleProps
  search(text: string): unknown
} & HeaderProps

export const MainHeader: FC<MainHeaderProps> = ({
  leftItems,
  centerItems,
  rightItems,
  headerTitleProps,
  search,
  ...props
}) => {
  const { hideSearchbox } = useContext(MainHeaderContext)
  const [searchText, setSearchText] = useState('')

  const { logo, smallLogo, url } = headerTitleProps

  const updatedLeftItems = useMemo(() => {
    return [
      {
        Item: () => <HeaderTitle logo={logo} smallLogo={smallLogo} url={url} />,
        key: 'header-title',
      },
      ...(leftItems ?? []),
    ].filter(Boolean)
  }, [leftItems, logo, smallLogo, url])

  const updatedCenterItems = useMemo(() => {
    const searchbox = hideSearchbox
      ? undefined
      : {
          Item: () => (
            <Searchbox
              placeholder="Search for open education content"
              searchText={searchText}
              setSearchText={setSearchText}
              search={search}
            />
          ),
          key: 'searchbox',
        }
    return [searchbox, ...(centerItems ?? [])].filter((item): item is AddonItem => !!item)
  }, [centerItems, searchText, search, hideSearchbox])

  const updatedRightItems: AddonItem[] = useMemo(() => {
    return rightItems.filter((item): item is AddonItem => !!item)
  }, [rightItems])

  return (
    <Header
      leftItems={updatedLeftItems}
      centerItems={updatedCenterItems}
      rightItems={updatedRightItems}
      {...props}
    ></Header>
  )
}
