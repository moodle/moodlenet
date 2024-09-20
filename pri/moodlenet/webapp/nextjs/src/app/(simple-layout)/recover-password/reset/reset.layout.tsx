import { layoutPropsWithChildren } from '@/lib/server/utils/slots'
import './reset.style.scss'

export default async function ResetLayout(props: layoutPropsWithChildren) {
  return props.children
}
