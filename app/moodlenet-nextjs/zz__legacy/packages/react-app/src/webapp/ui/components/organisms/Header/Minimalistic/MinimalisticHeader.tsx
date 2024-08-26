import type { AddonItem } from '@moodlenet/component-library'

import type { FC, PropsWithChildren } from 'react'
import type { HeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitle.js'
import HeaderTitle from '../../../atoms/HeaderTitle/HeaderTitle.js'

import './MinimalisticHeader.scss'

export type MinimalisticHeaderProps = {
  headerTitleProps: HeaderTitleProps
  leftItems: AddonItem[]
  centerItems: AddonItem[]
  rightItems: AddonItem[]
}

export const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = ({
  headerTitleProps,
  leftItems,
  centerItems,
  rightItems,
}) => {
  const { logo, smallLogo, url } = headerTitleProps

  const updatedLeftItems = [
    {
      Item: () => <HeaderTitle key="header-title" logo={logo} smallLogo={smallLogo} url={url} />,
      key: 'header-title',
    },
    ...(leftItems ?? []),
  ].filter((item): item is AddonItem => !!item)

  const updatedCenterItems = [...(centerItems ?? [])].filter((item): item is AddonItem => !!item)

  const updatedRightItems = [...(rightItems ?? [])].filter((item): item is AddonItem => !!item)

  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">
          {updatedLeftItems.map(({ Item, key }) => (
            <Item key={key} />
          ))}
        </div>
        <div className="center">
          {updatedCenterItems.map(({ Item, key }) => (
            <Item key={key} />
          ))}
        </div>
        <div className="right">
          {updatedRightItems.map(({ Item, key }) => (
            <Item key={key} />
          ))}
        </div>
      </div>
    </div>
  )
}
