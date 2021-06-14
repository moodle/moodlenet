import { FC } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { PUBLIC_URL } from '../../../constants'
import { LinkComponentCtx, LinkComponentType } from '../../../ui/elements/link'

export const LinkComponentProvider: FC = ({ children }) => {
  return <LinkComponentCtx.Provider value={LinkComponent}>{children}</LinkComponentCtx.Provider>
}

const LinkComponent: LinkComponentType = props => {
  const isExternal = !((PUBLIC_URL && props.href?.startsWith(PUBLIC_URL)) || props.href?.startsWith('/'))
  if (isExternal || !props.href) {
    return (
      <a {...props} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    )
  }
  const LinkComp = props.activeClassName || props.activeStyle ? NavLink : Link
  return (
    <LinkComp {...props} to={props.href} ref={null}>
      {props.children}
    </LinkComp>
  )
}
