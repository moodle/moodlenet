// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import { createPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type {} from '../../../../common/types.mjs'
import { getSubjectHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useSubjectData } from '../../pages/Subject/SubjectDataHooks'
import type { SubjectCardOverallProps, SubjectCardProps } from './SubjectCard'

export const SubjectCardPlugins = createPlugin<
  {
    mainColumnItems?: AddOnMap<AddonItemNoKey>
    overallItems?: AddOnMap<Omit<SubjectCardOverallProps, 'key'>>
  },
  { subjectKey: string }
>()

export const useSubjectCardProps = (subjectKey: string): SubjectCardProps | null => {
  const plugins = SubjectCardPlugins.usePluginHooks({ subjectKey })
  const subjectData = useSubjectData({ subjectKey })

  const subjectProps = useMemo(() => {
    if (!subjectData) {
      return null
    }
    const subjectCardProps: SubjectCardProps = {
      overallItems: plugins.getKeyedAddons('overallItems'),
      mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
      title: subjectData.title,
      subjectHomeHref: href(
        getSubjectHomePageRoutePath({ _key: subjectKey, title: subjectData.title }),
      ),
    }

    return subjectCardProps
  }, [plugins, subjectData, subjectKey])

  return subjectProps
}
