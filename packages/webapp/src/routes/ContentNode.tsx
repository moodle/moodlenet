import { Routes } from '../../../common/lib/webapp/sitemap'
// import { NodeType } from '../graphql/types.graphql.gen'
import { NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { NeverPage } from '../helpers/navigation'
import { MNRouteProps, RouteFC } from './lib'

export const ContentNodeComponent: RouteFC<Routes.ContentNode> = ({
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

export const ContentNodeRoute: MNRouteProps<Routes.ContentNode> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:id',
  exact: true,
}
