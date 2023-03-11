import { AddonItem, PrimaryButton, SecondaryButton } from '@moodlenet/component-library'

import { FC, PropsWithChildren } from 'react'
import HeaderTitle, { HeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitle.js'
import { Href, Link } from '../../../elements/link.js'

import './MinimalisticHeader.scss'

export type MinimalisticHeaderProps = {
  page: 'login' | 'signup' | 'activation' | 'rootLogin'
  headerTitleProps: HeaderTitleProps
  signupHref: Href
  loginHref: Href
  leftItems?: AddonItem[]
  centerItems?: AddonItem[]
  rightItems?: AddonItem[]
}

export const MinimalisticHeader: FC<PropsWithChildren<MinimalisticHeaderProps>> = (
  {
    page,
    headerTitleProps,
    leftItems,
    centerItems,
    rightItems,
    loginHref,
    signupHref,
  } /* { devMode, setDevMode } */,
) => {
  const { logo, smallLogo, url } = headerTitleProps

  const rightButtons = page !== 'activation' && {
    Item: () => (
      <div className="buttons">
        {page !== 'signup' && (
          <Link href={signupHref}>
            {/* // TODO ETTO Implement on Controller */}
            <SecondaryButton color="orange">
              {/* <Trans> */}
              Sign up
              {/* </Trans> */}
            </SecondaryButton>
          </Link>
        )}
        {page !== 'login' && (
          <Link href={loginHref}>
            {/* TODO ETTO Implement on Controller */}
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
    ),
    key: 'buttons',
  }

  const updatedLeftItems = [
    {
      Item: () => <HeaderTitle key="header-title" logo={logo} smallLogo={smallLogo} url={url} />,
      key: 'header-title',
    },
    ...(leftItems ?? []),
  ]

  const updatedCenterItems = [...(centerItems ?? [])]

  const updatedRightItems = [rightButtons, ...(rightItems ?? [])].filter(
    (item): item is AddonItem => !!item,
  )

  // const {
  // registries: {
  //   header: { rightComponents },
  // },
  // } = useContext(MainContext)
  // const { registry: rightComponentsRegistry } = rightComponents.useRegistry()
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
          {/* {rightComponentsRegistry.entries.flatMap(({ pkg, item: { Component } }, index) => {
            return <Component key={`${pkg.id}:${index}`} />
          })} */}
        </div>
      </div>
    </div>
  )
}
