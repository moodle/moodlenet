import type { AddonItem, FooterProps } from '@moodlenet/component-library'
import { Footer } from '@moodlenet/component-library'
import type { FC } from 'react'
import { useMemo } from 'react'
import './MainFooter.scss'

export type MainFooterProps = {
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
} & FooterProps

export const MainFooter: FC<MainFooterProps> = ({
  leftItems,
  centerItems,
  rightItems,
  ...props
}) => {
  const updatedLeftItems = useMemo(() => {
    return [...(leftItems ?? [])].filter(Boolean)
  }, [leftItems])

  const updatedCenterItems = useMemo(() => {
    return [...(centerItems ?? [])].filter(Boolean)
  }, [centerItems])

  const updatedRightItems = useMemo(() => {
    return [...(rightItems ?? [])].filter(Boolean)
  }, [rightItems])

  return (
    <Footer
      leftItems={updatedLeftItems}
      centerItems={updatedCenterItems}
      rightItems={updatedRightItems}
      {...props}
    ></Footer>
  )
}
