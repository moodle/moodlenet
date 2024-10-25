import type {
  AnchorHTMLAttributes,
  ComponentType,
  CSSProperties,
  DetailedHTMLProps,
  FC,
  PropsWithChildren,
} from 'react'
import { createContext, useContext } from 'react'
import * as ReactRouterDom from 'react-router-dom'
import type { Href } from '../../../../common/lib.mjs'
export type LinkComponentElementProps = DetailedHTMLProps<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: Href
    asExt?: boolean
  },
  HTMLAnchorElement
> & {
  exact?: boolean
  strict?: boolean
  activeClassName?: string
  activeStyle?: CSSProperties
  externalClassName?: string
  externalStyle?: CSSProperties
}
export type LinkComponentType = ComponentType<PropsWithChildren<LinkComponentElementProps>>

export const Link: LinkComponentType = props => {
  const { LinkComp } = useContext(LinkComponentCtx)
  return <LinkComp {...props}>{props.children}</LinkComp>
}

const ReactRouterLinkComponent: LinkComponentType = props => {
  const isExternal = props.href.ext
  const asExternal = props.asExt
  if (isExternal || asExternal) {
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
    const { href, externalClassName, externalStyle, ...restProps } = props
    return props.activeClassName || props.activeStyle ? (
      <ReactRouterDom.NavLink {...restProps} to={href.url} ref={null}>
        {props.children}
      </ReactRouterDom.NavLink>
    ) : (
      <ReactRouterDom.Link {...restProps} to={href.url} ref={null}>
        {props.children}
      </ReactRouterDom.Link>
    )
  }
}

export type LinkComponentCtxType = { LinkComp: LinkComponentType }
export const LinkComponentCtx = createContext<LinkComponentCtxType>(null as any)

const ctxValue: LinkComponentCtxType = { LinkComp: ReactRouterLinkComponent }
export const ProvideLinkComponentCtx: FC<PropsWithChildren<unknown>> = ({ children }) => {
  return <LinkComponentCtx.Provider value={ctxValue}>{children}</LinkComponentCtx.Provider>
}
