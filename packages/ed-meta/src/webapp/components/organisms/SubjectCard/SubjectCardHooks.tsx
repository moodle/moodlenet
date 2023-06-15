// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { href } from '@moodlenet/react-app/common'
import { createPluginHook } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type {} from '../../../../common/types.mjs'
import { getSubjectHomePageRoutePath } from '../../../../common/webapp-routes.mjs'
import { useSubjectData } from '../../pages/Subject/SubjectDataHooks.js'
import type { SubjectCardProps } from './SubjectCard.js'

export const SubjectCardPlugins = createPluginHook<
  { mainColumnItems: AddOnMap<AddonItemNoKey> },
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
      mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
      title: subjectData.title,
      numFollowers: subjectData.numFollowers,
      numResources: subjectData.numResources,
      subjectHomeHref: href(
        getSubjectHomePageRoutePath({ _key: subjectKey, title: subjectData.title }),
      ),
    }

    return subjectCardProps
  }, [plugins, subjectData, subjectKey])

  return subjectProps
}
