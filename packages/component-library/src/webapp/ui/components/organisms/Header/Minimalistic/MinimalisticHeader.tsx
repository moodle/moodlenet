import type { FC, PropsWithChildren, ReactElement } from 'react'
import './MinimalisticHeader.scss'

export type MinimalisticHeaderProps = {
  leftItems?: ReactElement[]
  centerItems?: ReactElement[]
  rightItems?: ReactElement[]
}

export const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = (
  { leftItems, centerItems, rightItems } /* { devMode, setDevMode } */,
) => {
  // const {
  // registries: {
  //   header: { headerRightComponents },
  // },
  // } = useContext(MainContext)
  // const { registry: rightComponentsRegistry } = headerRightComponents.useRegistry()
  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">{leftItems}</div>
        <div className="center">{centerItems}</div>
        <div className="right">
          {rightItems}
          {/* {rightComponentsRegistry.entries.flatMap(({ pkg, item: { Component } }, index) => {
            return <Component key={`${pkg.id}:${index}`} />
          })} */}
        </div>
      </div>
    </div>
  )
}
