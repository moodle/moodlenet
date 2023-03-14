import { Card } from '@moodlenet/component-library'
import { FC } from 'react'
import './Browser.scss'

export const filterTypes = ['Subjects', 'Collections', 'Resources', 'People'] as const
export type BrowserProps = {
  // mainColumnItems?: ({ menuItem?: AddonItem } & AddonItem)[]
  // sideColumnItems?: AddonItem[]
}
export const Browser: FC<BrowserProps> = () =>
  // sideColumnItems,
  // mainColumnItems,
  {
    // const [currentSection, setCurrentSection] = useState(
    //   mainColumnItems && mainColumnItems.length > 0 ? mainColumnItems[0]?.key.toString() : '0',
    // )

    // const navMenuElements = useMemo(
    //   () =>
    //     mainColumnItems
    //       ? mainColumnItems
    //           .map(e => {
    //             const isCurrent = e.key.toString() === currentSection

    //             return e.menuItem ? (
    //               <div
    //                 key={e.key}
    //                 className={`section ${isCurrent ? 'selected' : ''}`}
    //                 onClick={() => setCurrentSection(e.key.toString())}
    //               >
    //                 <div className={`border-container ${isCurrent ? 'selected' : ''}`}>
    //                   <div className={`border ${isCurrent ? 'selected' : ''}`} />
    //                 </div>
    //                 <div className={`content ${isCurrent ? 'selected' : ''}`}>
    //                   {<e.menuItem.Item />}
    //                 </div>
    //               </div>
    //             ) : null
    //           })
    //           .filter(item => !!item)
    //       : [],
    //   [mainColumnItems, currentSection],
    // )

    // const navMenu = (
    //   <div className="nav-menu" role="navigation" key="nav-menu">
    //     <Card role="navigation">{navMenuElements}</Card>
    //   </div>
    // )

    // const updatedMainColumnItems = [...(mainColumnItems ?? [])].filter(
    //   (item): item is AddonItem => !!item,
    // )

    // const updatedSideColumnItems =
    // sideColumnItems,
    //   // navMenu,
    //   ...(sideColumnItems ?? []),
    // ].filter(
    //   (item): item is AddonItem =>
    //     // | JSX.Element
    //     !!item,
    // )

    // console.log('updatedSideColumnItems', updatedSideColumnItems)

    // const mainColumnRef = useRef<HTMLDivElement>(null)

    // const updateActiveSection = useCallback(() => {
    //   const parent = mainColumnRef.current
    //   const children = mainColumnRef.current?.children

    //   const heights = parent ? [parent.offsetTop] : [0]
    //   console.log('initial heights', heights)

    //   if (children) {
    //     for (let i = 0; i < children.length - 1; i++) {
    //       const child = children[i]
    //       console.log('child: ', child)

    //       const prevHeight = heights[i]
    //       console.log('prevHeight', prevHeight)

    //       const childHeight = child?.clientHeight
    //       console.log('childHeight ', childHeight)

    //       childHeight && heights.push(prevHeight ? childHeight + prevHeight : childHeight)
    //       const currentHeight = heights[i]
    //       console.log('currentHeight', currentHeight)

    //       if (currentHeight && window.pageYOffset >= currentHeight) {
    //         const key = child?.getAttribute('key')
    //         key && setCurrentSection(key)
    //       }
    //     }

    //     console.log('heights', heights)
    //   }
    // }, [])

    // useLayoutEffect(() => {
    //   console.log('getting here')
    //   window.addEventListener('scroll', updateActiveSection)
    //   return () => {
    //     window.removeEventListener('scroll', updateActiveSection)
    //   }
    // }, [updateActiveSection])

    // useEffect(() => {
    //   window.addEventListener('scroll', updateActiveSection)
    //   return () => {
    //     window.removeEventListener('scroll', updateActiveSection)
    //   }
    // }, [updateActiveSection])

    // The scroll listener
    // const handleScroll = useCallback(() => {
    //   console.log('scrolling')
    // }, [])

    // // Attach the scroll listener to the div
    // useEffect(() => {
    //   console.log('getting here')
    //   // const div = mainColumnRef.current
    //   document.addEventListener('scroll', handleScroll)
    //   return () => {
    //     console.log('removing listener')
    //     document.removeEventListener('scroll', handleScroll)
    //   }
    // }, [handleScroll])

    // add the scroll listener to the window
    // useEffect(() => {
    //   window.addEventListener('scroll', updateActiveSection)
    //   return () => {
    //     window.removeEventListener('scroll', updateActiveSection)
    //   }
    // }, [updateActiveSection])

    return (
      <div>
        <Card>Hella</Card>
        <Card>Hella</Card>
        {/* <Card>Hella</Card>
        <Card>Hella</Card>
        <Card>Hella</Card> */}
        {/* <Card>Hella</Card>
        <Card>Hella</Card>
        <Card>Hella</Card> */}
      </div>

      // <div className="browser">
      //   <div className="content">
      //     <div className="side-column">
      //       {/* {useMemo(
      //       () => updatedSideColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
      //       [updatedSideColumnItems],
      //     )} */}
      //     </div>
      //     <div className={`main-column`}>
      //       {/* <div ref={mainColumnRef} className={`main-column`}> */}
      //       {/* <Card>Hella</Card> */}
      //       <Card>Hella</Card>
      //       {/* {useMemo(
      //       () => updatedMainColumnItems.map(i => ('Item' in i ? <i.Item key={i.key} /> : i)),
      //       [updatedMainColumnItems],
      //     )} */}
      //     </div>
      //   </div>
      // </div>
    )
  }
Browser.displayName = 'BrowserPage'
