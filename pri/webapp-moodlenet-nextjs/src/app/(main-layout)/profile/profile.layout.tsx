import { layoutPropsWithChildren } from '../../../lib/server/utils/slots'
import './profile.style.scss'

export default async function ProfileLayout(props: layoutPropsWithChildren) {
  return props.children
}
