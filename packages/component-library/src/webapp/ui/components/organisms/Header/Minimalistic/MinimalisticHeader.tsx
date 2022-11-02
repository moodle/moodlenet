import { FC, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { AddonItem, sortAddonItems } from '../../../../../../ui.mjs'
// import { MainContext } from '../../../../../MainContext.js'
import { PrimaryButton } from '../../../atoms/PrimaryButton/PrimaryButton.js'
import { SecondaryButton } from '../../../atoms/SecondaryButton/SecondaryButton.js'
import HeaderTitle, { HeaderTitleProps } from '../HeaderTitle/HeaderTitle.js'
import './MinimalisticHeader.scss'

export type MinimalisticHeaderProps = {
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
  headerTitleProps: HeaderTitleProps
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
}

export const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = (
  { page, headerTitleProps, leftItems, centerItems, rightItems } /* { devMode, setDevMode } */,
) => {
  const { logo, smallLogo, url } = headerTitleProps

  const rightButtons = page !== 'activation' && (
    <div className="buttons">
      {page !== 'signup' && (
        <Link to="/signup">
          {/* // TODO Implement on Controller */}
          <SecondaryButton color="orange">
            {/* <Trans> */}
            Sign up
            {/* </Trans> */}
          </SecondaryButton>
        </Link>
      )}
      {page !== 'login' && (
        <Link to="/login">
          {/* TODO Implement on Controller */}
          <SecondaryButton color="orange">
            {/* <Trans> */}
            Log in
            {/* </Trans> */}
          </SecondaryButton>
        </Link>
      )}
      <a href="https://moodle.com/moodlenet/" target="__blank">
        <PrimaryButton color="grey">
          {/* <Trans> */}
          Learn more
          {/* </Trans> */}
        </PrimaryButton>
      </a>
    </div>
  )

  const updatedLeftItems = sortAddonItems([
    <HeaderTitle key="header-title" logo={logo} smallLogo={smallLogo} url={url} />,
    ...(leftItems ?? []),
  ])

  const updatedCenterItems = sortAddonItems([...(centerItems ?? [])])

  const updatedRightItems = sortAddonItems([rightButtons, ...(rightItems ?? [])])

  // const {
  // registries: {
  //   header: { rightComponents },
  // },
  // } = useContext(MainContext)
  // const { registry: rightComponentsRegistry } = rightComponents.useRegistry()
  return (
    <div className="minimalistic-header">
      <div className="content">
        <div className="left">{updatedLeftItems}</div>
        <div className="center">{updatedCenterItems}</div>
        <div className="right">
          {updatedRightItems}
          {/* {rightComponentsRegistry.entries.flatMap(({ pkg, item: { Component } }, index) => {
            return <Component key={`${pkg.id}:${index}`} />
          })} */}
        </div>
      </div>
    </div>
  )
}
