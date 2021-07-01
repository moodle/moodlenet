import { Id, parseNodeIdString } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { FC } from 'react'
import { Routes } from '../../../common/lib/webapp/sitemap'
import { ProvideContentNodeContext } from '../context/ContentNodeContext'
import { NodeType } from '../graphql/pub.graphql.link'
import { NeverPage } from '../helpers/navigation'
import { CollectionPageComponent } from './ContentNode/CollectionPage'
import { ProfilePageComponent } from './ContentNode/ProfilePage'
import { ResourcePageComponent } from './ContentNode/ResourcePage'
import { SubjectPageComponent } from './ContentNode/SubjectFieldPage'
import { MNRouteProps, RouteFC } from './lib'

export const ContentNodeComponent: RouteFC<Routes.ContentNode> = ({ match: { params } }) => {
  const parsedId = parseNodeIdString(`${params.nodeType}/${params.key}`)
  if (!parsedId) {
    return NeverPage(null as never)
  }
  const { id, nodeType } = parsedId

  return (
    <ProvideContentNodeContext id={id} type={nodeType}>
      <ContentNodeComponentSwitch id={id} nodeType={nodeType} />
    </ProvideContentNodeContext>
  )
}
export const ContentNodeComponentSwitch: FC<{ nodeType: NodeType; id: Id }> = ({ id, nodeType }) => {
  if (nodeType === 'Profile') {
    return <ProfilePageComponent id={id} />
  } else if (nodeType === 'SubjectField') {
    return <SubjectPageComponent id={id} />
  } else if (nodeType === 'Collection') {
    return <CollectionPageComponent id={id} />
  } else if (nodeType === 'Resource') {
    return <ResourcePageComponent id={id} />
  } else {
    return NeverPage(nodeType)
  }
}

export const ContentNodeRoute: MNRouteProps<Routes.ContentNode> = {
  component: ContentNodeComponent,
  path: '/content/:nodeType/:key',
  exact: false,
}
