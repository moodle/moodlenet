import { FC } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  LinkComponentType,
  ProvideLinkComponentCtx,
} from '../../../ui/elements/link'

export const ProvideReactRouterLinkComponent: FC = ({ children }) => {
  return (
    <ProvideLinkComponentCtx value={ReactRouterLinkComponent}>
      {children}
    </ProvideLinkComponentCtx>
  )
}

const ReactRouterLinkComponent: LinkComponentType = (props) => {
  const isExternal = props.href.ext
  const asExternal = props.asExt
  if (isExternal || asExternal) {
    const {
      href,
      externalClassName,
      externalStyle,
      activeClassName,
      activeStyle,
      ...restProps
    } = props
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
      <NavLink {...restProps} to={href.url} ref={null}>
        {props.children}
      </NavLink>
    ) : (
      <Link {...restProps} to={href.url} ref={null}>
        {props.children}
      </Link>
    )
  }
}
