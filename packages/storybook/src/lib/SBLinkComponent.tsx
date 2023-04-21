import LinkTo from '@storybook/addon-links/react.js'

import { LinkComponentCtx, LinkComponentType } from '@moodlenet/react-app/ui'
import { FC, PropsWithChildren } from 'react'

// HACK: it seems '@storybook/addon-links/react.js' typings are not accurate
const SBLinkTo = LinkTo as any as FC<PropsWithChildren<Record<string, unknown>>>

export const ProvideStorybookLinkComponent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <LinkComponentCtx.Provider value={{ LinkComp: StorybookLinkComponent }}>
      {/* <X>{children}</X> */}
      {children}
    </LinkComponentCtx.Provider>
  )
}

const StorybookLinkComponent: LinkComponentType = props => {
  const isExternal = props.href.ext
  const asExternal = props.asExt
  const splitHref = props.href.url.split('/')
  const story = splitHref.pop()
  const kind = splitHref.join('/')
  // console.log({
  //   isExternal,
  //   asExternal,
  //   kind,
  //   story,
  //   props,
  // })
  if (isExternal || asExternal || !(kind && story)) {
    //console.log('external !!')
    const { href, externalClassName, externalStyle, activeClassName, activeStyle, ...restProps } =
      props
    return (
      <a
        {...restProps}
        href={href.url}
        className={externalClassName}
        style={externalStyle}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
      </a>
    )
  } else {
    // console.log('internal !!')
    const { href, externalClassName, externalStyle, children, ...restProps } = props
    // props.activeClassName || props.activeStyle
    return (
      <SBLinkTo {...restProps} kind={kind} story={story}>
        {children}
      </SBLinkTo>
    )
  }
}
