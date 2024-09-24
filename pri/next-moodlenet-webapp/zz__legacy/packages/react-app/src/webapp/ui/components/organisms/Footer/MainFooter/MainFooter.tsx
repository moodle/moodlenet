import type { AddonItem } from '@moodlenet/component-library'
import { Footer } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import './MainFooter.scss'

export type MainFooterProps = {
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
  showCopyright?: boolean
}

export const MainFooter: FC<MainFooterProps> = ({
  leftItems,
  centerItems,
  rightItems,
  showCopyright,
}) => {
  const updatedLeftItems = useMemo(() => {
    return [...(leftItems ?? []).map(({ Item, key }) => <Item key={key} />)].filter(Boolean)
  }, [leftItems])

  const updatedCenterItems = useMemo(() => {
    return [...(centerItems ?? []).map(({ Item, key }) => <Item key={key} />)].filter(Boolean)
  }, [centerItems])

  const updatedRightItems = useMemo(() => {
    return [...(rightItems ?? []).map(({ Item, key }) => <Item key={key} />)].filter(Boolean)
  }, [rightItems])

  return (
    <Footer
      leftItems={updatedLeftItems}
      centerItems={updatedCenterItems}
      rightItems={updatedRightItems}
      showCopyright={showCopyright}
    ></Footer>
  )
}
