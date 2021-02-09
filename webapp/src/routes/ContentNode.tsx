import { NodeType } from '../graphql/types.graphql.gen'
import { ContentNodeRouteDef } from '../sitemap'
import { NeverPage } from '../helpers/navigation'
import { MNRouteProps, RouteFC } from '../sitemap/lib'

export const ContentNodeComponent: RouteFC<ContentNodeRouteDef> = ({
  match: {
    params: { id, nodeType },
  },
}) => {
  // TODO: check isId(id)
  switch (nodeType) {
    case NodeType.User:
      return <div>ContentNode User/{id}</div>
    case NodeType.Subject:
      return <div>ContentNode Subject/{id}</div>
    default:
      return NeverPage(nodeType)
  }
}

export const ContentNodeRoute: MNRouteProps<ContentNodeRouteDef> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:id',
  exact: true,
}
