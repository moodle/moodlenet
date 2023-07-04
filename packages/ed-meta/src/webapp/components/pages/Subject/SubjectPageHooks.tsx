import { type AddonItem, type AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { createPlugin, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { SubjectOverallProps, SubjectProps } from './Subject.js'
import { useSubjectData } from './SubjectDataHooks.js'

export type SubjectPageGeneralActionsAddonItem = Pick<AddonItem, 'Item'>

export const SubjectPagePlugins = createPlugin<
  {
    mainColumnItems?: AddOnMap<AddonItemNoKey>
    overallItems?: AddOnMap<Omit<SubjectOverallProps, 'key'>>
    main_footerRowItems?: AddOnMap<AddonItemNoKey>
    main_headerItems?: AddOnMap<AddonItemNoKey>
    main_mainColumnItems?: AddOnMap<AddonItemNoKey>
  },
  { subjectKey: string }
>()

type SubjectPageHookArg = {
  subjectKey: string
}

export const useSubjectPageProps = ({ subjectKey }: SubjectPageHookArg) => {
  const mainLayoutProps = useMainLayoutProps()
  const subjectData = useSubjectData({ subjectKey })
  const plugins = SubjectPagePlugins.usePluginHooks({ subjectKey })

  return useMemo<SubjectProps | null | undefined>(() => {
    if (!subjectData) {
      return subjectData
    }
    const subjectProps: SubjectProps = {
      mainLayoutProps,
      iscedUrl: subjectData.iscedUrl,
      isIsced: subjectData.isIsced,
      title: subjectData.title,
      mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
      overallItems: plugins.getKeyedAddons('overallItems'),
      mainSubjectCardSlots: {
        footerRowItems: plugins.getKeyedAddons('main_footerRowItems'),
        headerItems: plugins.getKeyedAddons('main_headerItems'),
        mainColumnItems: plugins.getKeyedAddons('main_mainColumnItems'),
      },
    }
    return subjectProps
  }, [subjectData, mainLayoutProps, plugins])
}
