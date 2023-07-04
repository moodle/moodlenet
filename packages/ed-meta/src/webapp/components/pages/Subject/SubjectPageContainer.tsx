import { Fallback } from '@moodlenet/react-app/ui'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import type { FC } from 'react'
import SubjectPage from './Subject.js'
import { useSubjectPageProps } from './SubjectPageHooks.js'

export const SubjectPageContainer: FC<{ subjectKey: string }> = ({ subjectKey }) => {
  const SubjectProps = useSubjectPageProps({ subjectKey })
  const mainLayoutProps = useMainLayoutProps()
  if (SubjectProps === null) {
    return <Fallback mainLayoutProps={mainLayoutProps} />
  } else if (SubjectProps === undefined) return null
  return <SubjectPage {...SubjectProps} key={subjectKey} />
}
