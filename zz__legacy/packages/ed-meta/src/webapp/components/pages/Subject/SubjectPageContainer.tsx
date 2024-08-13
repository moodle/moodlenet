import { FallbackContainer } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import SubjectPage from './Subject.js'
import { useSubjectPageProps } from './SubjectPageHooks.js'

export const SubjectPageContainer: FC<{ subjectKey: string }> = ({ subjectKey }) => {
  const SubjectProps = useSubjectPageProps({ subjectKey })
  if (SubjectProps === null) {
    return <FallbackContainer />
  } else if (SubjectProps === undefined) return null
  return <SubjectPage {...SubjectProps} key={subjectKey} />
}
