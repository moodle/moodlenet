import { layoutPropsWithChildren } from '../../../../../lib/server/utils/slots'

export default async function PublicResourceLayout(props: layoutPropsWithChildren) {
  return props.children
}
