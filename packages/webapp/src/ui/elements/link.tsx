import { AnchorHTMLAttributes, ComponentType, createContext, CSSProperties, DetailedHTMLProps, useContext } from 'react'

export type LinkComponentElementProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & { activeClassName?: string; activeStyle?: CSSProperties }
export type LinkComponentType = ComponentType<LinkComponentElementProps>

export const Link: LinkComponentType = props => {
  const LinkComp = useContext(LinkComponentCtx)
  return <LinkComp {...props}>{props.children}</LinkComp>
}
export const LinkComponentCtx = createContext<LinkComponentType>(props => <a {...props}>{props.children}</a>)
