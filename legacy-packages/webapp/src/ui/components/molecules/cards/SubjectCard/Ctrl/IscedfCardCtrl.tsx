import { narrowNodeType } from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { nodeGqlId2UrlPath } from '@moodlenet/common/dist/webapp/sitemap/helpers'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../../context/Global/LocalInstance'
import { href } from '../../../../../elements/link'
import { CtrlHook } from '../../../../../lib/ctrl'
import { SubjectCardProps } from '../SubjectCard'
import { useIscedfCardQuery } from './IscedfCard.gen'

export const useIscedfCardCtrl: CtrlHook<SubjectCardProps, { id: ID }> = ({
  id,
}) => {
  const subjectNode = narrowNodeType(['IscedField'])(
    useIscedfCardQuery({ variables: { id }, fetchPolicy: 'cache-and-network' })
      .data?.node
  )
  const { org: localOrg } = useLocalInstance()
  const subjectCardUIProps = useMemo<SubjectCardProps | null>(() => {
    if (!subjectNode) {
      return null
    }
    const orgData = null ?? localOrg
    const organization: SubjectCardProps['organization'] = {
      color: orgData.color,
      url: `${orgData.domain}`,
    }

    return {
      organization,
      title: subjectNode.name,
      subjectHomeHref: href(nodeGqlId2UrlPath(id)),
    }
  }, [subjectNode, localOrg, id])
  return subjectCardUIProps && [subjectCardUIProps]
}
