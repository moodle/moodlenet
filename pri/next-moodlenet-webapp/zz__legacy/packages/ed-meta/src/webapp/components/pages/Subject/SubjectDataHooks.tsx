import { silentCatchAbort } from '@moodlenet/react-app/webapp'
import { useEffect, useState } from 'react'
import type { SubjectData } from '../../../../common/types.mjs'
import { shell } from '../../../rt/shell.mjs'

export const useSubjectData = ({
  subjectKey,
}: {
  subjectKey: string
}): SubjectData | null | undefined => {
  const [subjectData, setSubjectData] = useState<SubjectData | null | undefined>(undefined)
  useEffect(() => {
    setSubjectData(undefined)
    shell.rpc
      .me('webapp/subject-page-data/:_key', { rpcId: `subject-page-data/${subjectKey}` })(
        undefined,
        { _key: subjectKey },
      )
      .then(setSubjectData)
      .catch(silentCatchAbort)
  }, [subjectKey])

  return subjectData
}
