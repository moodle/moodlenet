// import { NodeType } from '../graphql/types.graphql.gen'
import { NodeType } from '@moodlenet/common/lib/pub-graphql/types.graphql.gen'
import { Routes } from '../../../common/lib/webapp/sitemap'
import { NeverPage } from '../helpers/navigation'
import { MNRouteProps, RouteFC } from './lib'

const camelCaseType = (_: string) => (_ && _[0].toUpperCase() + _.substr(1)) as NodeType

export const ContentNodeComponent: RouteFC<Routes.ContentNode> = ({
  match: {
    params: { id, nodeType },
  },
}) => {
  // TODO: check isId(id)
  nodeType = camelCaseType(nodeType)
  switch (nodeType) {
    case NodeType.User:
      return <div>ContentNode User/{id}</div>
    case NodeType.Subject:
      return <div>ContentNode Subject/{id}</div>
    case NodeType.Collection:
      return <div>ContentNode Collection/{id}</div>
    case NodeType.Resource:
      return <div>ContentNode Resource/{id}</div>
    default:
      return NeverPage(nodeType)
  }
}

export const ContentNodeRoute: MNRouteProps<Routes.ContentNode> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:id',
  exact: true,
}
