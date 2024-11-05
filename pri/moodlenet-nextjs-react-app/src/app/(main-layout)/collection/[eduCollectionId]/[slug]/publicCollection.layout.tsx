import { layoutPropsWithChildren } from '../../../../../lib/server/utils/slots'

export default async function PublicCollectionLayout(props: layoutPropsWithChildren) {
  return props.children
}
