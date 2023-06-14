import type { FC } from 'react'
import SubjectPage from './Subject.js'
import { useSubjectPageProps } from './SubjectPageHooks.js'

export const SubjectPageContainer: FC<{ subjectKey: string }> = ({ subjectKey }) => {
  const panelProps = useSubjectPageProps({ subjectKey })
  return panelProps && <SubjectPage {...panelProps} key={subjectKey} />
}
