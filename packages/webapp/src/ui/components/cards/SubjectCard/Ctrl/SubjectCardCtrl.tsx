import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { CtrlHook } from '../../../../lib/ctrl'
import { SubjectCardProps } from '../SubjectCard'
import { useSubjectCardQuery } from './SubjectCard.gen'

export const useSubjectCardCtrl: CtrlHook<SubjectCardProps, { id: Id }> = ({ id }) => {
  const subjectNode = useSubjectCardQuery({ variables: { id } }).data?.node
  const { org: localOrg } = useLocalInstance()
  const subjectCardUIProps = useMemo<SubjectCardProps | null>(() => {
    if (!subjectNode) {
      return null
    }
    const orgData = subjectNode._organization ?? localOrg
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
