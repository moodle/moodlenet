import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { CtrlHook } from '../../../../lib/ctrl'
import { defaultOrganization } from '../../../../lib/static-data'
import { SubjectCardProps } from '../SubjectCard'
import { useSubjectCardQuery } from './SubjectCard.gen'

export const useSubjectCardCtrl: CtrlHook<SubjectCardProps, { id: Id }> = ({ id }) => {
  const subjectNode = useSubjectCardQuery({ variables: { id } }).data?.node

  const subjectCardUIProps = useMemo<SubjectCardProps | null>(
    () =>
      subjectNode
        ? {
            organization: defaultOrganization,
            title: subjectNode.name,
          }
        : null,
    [subjectNode],
  )
  return subjectCardUIProps && [subjectCardUIProps]
}
