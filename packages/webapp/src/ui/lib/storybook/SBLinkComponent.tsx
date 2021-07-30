import _LinkTo, { LinkTo } from '@storybook/addon-links/react'
import { FC } from 'react'
import { LinkComponentCtx, LinkComponentType } from '../../elements/link'

// HACK: it seems '@storybook/addon-links' typings are not accurate
const SBLinkTo = (_LinkTo as any) as typeof LinkTo

export const ProvideGlobalSBLinkComponent: FC = ({ children }) => {
  return <LinkComponentCtx.Provider value={SBLinkComp}>{children}</LinkComponentCtx.Provider>
}

const SBLinkComp: LinkComponentType = props => {
  const isExternal = props.href.ext
  const asExternal = props.asExt
  const [kind, story] = props.href.url.split('/')

  if (isExternal || asExternal || !(kind && story)) {
    const { href, externalClassName, externalStyle, activeClassName, activeStyle, ...restProps } = props
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
    const { href, externalClassName, externalStyle, children, ...restProps } = props
    // props.activeClassName || props.activeStyle
    return (
      <SBLinkTo {...restProps} kind={kind} story={story} ref={null}>
        {children}
      </SBLinkTo>
    )
  }
}
