import { Id } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { useMemo } from 'react'
import { createWithProps } from '../../../../lib/ctrl'
import { SubjectCardProps } from '../SubjectCard'
import { useSubjectCardQuery } from './SubjectCard.gen'

export const [SubjectCardCtrl, subjectCardWithProps, subjectCardWithPropList] = createWithProps<
  SubjectCardProps,
  { id: Id }
>(({ id, __key, __uiComp: SubjectCardUI, ...rest }) => {
  const subjectNode = useSubjectCardQuery({ variables: { id } }).data?.node

  const subjectCardUIProps = useMemo<SubjectCardProps | null>(
    () =>
      subjectNode
        ? {
            organization: { url: 'bfh.ch', color: '' },
            title: subjectNode.name,
            ...rest,
          }
        : null,
    [subjectNode, rest],
  )
  return subjectCardUIProps && <SubjectCardUI {...subjectCardUIProps} />
})
