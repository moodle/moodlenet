import { FC } from 'react'
import { Link } from 'react-router-dom'
import { DefaultLinkComponent, LinkComponent, LinkComponentType } from '../../../ui/context'

export const LinkComponentProvider: FC = ({ children }) => {
  return <LinkComponent.Provider value={LinkComp}>{children}</LinkComponent.Provider>
}
const LinkComp: LinkComponentType = props =>
  props.href.external ? (
    <DefaultLinkComponent {...props} />
  ) : (
    <Link {...{ ...props, to: props.href.dest, href: props.href.dest, ref: null }} />
  )
