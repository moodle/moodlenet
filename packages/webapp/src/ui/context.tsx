import { AnchorHTMLAttributes, ComponentType, createContext, DetailedHTMLProps, useContext } from 'react'

// ^Link
export type LinkDef = {
  dest: string
  external: boolean
}

export type LinkComponentElementProps = Omit<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  'href'
> & { href: LinkDef }
export type LinkComponentType = ComponentType<LinkComponentElementProps>
export const DefaultLinkComponent: LinkComponentType = props => {
  const aProps: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> = {
    ...props,
    href: props.href.dest,
    ...(props.href.external ? { target: '_blank', rel: 'noopener noreferrer' } : null),
  }
  return <a {...aProps}>{props.children}</a>
}
export const LinkComponent = createContext<LinkComponentType>(DefaultLinkComponent)
export const useLink = () => useContext(LinkComponent)
// $Link
