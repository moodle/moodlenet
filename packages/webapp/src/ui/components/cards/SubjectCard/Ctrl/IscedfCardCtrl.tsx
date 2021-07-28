import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { CtrlHook } from '../../../../lib/ctrl'
import { SubjectCardProps } from '../SubjectCard'
import { useIscedfCardQuery } from './IscedfCard.gen'

export const useIscedfCardCtrl: CtrlHook<SubjectCardProps, { id: ID }> = ({ id }) => {
  const subjectNode = useIscedfCardQuery({ variables: { id } }).data?.node
  const { org: localOrg } = useLocalInstance()
  const subjectCardUIProps = useMemo<SubjectCardProps | null>(() => {
    if (!(subjectNode && subjectNode.__typename === 'Iscedf')) {
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
    }
  }, [subjectNode, localOrg])
  return subjectCardUIProps && [subjectCardUIProps]
}
