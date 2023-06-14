import { type AddonItem, type AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { createPluginHook, useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useEffect, useMemo, useState } from 'react'
import type { SubjectPageData } from '../../../../common/types.mjs'
import { shell } from '../../../rt/shell.mjs'
import type { SubjectOverallProps, SubjectProps } from './Subject.js'

export type SubjectPageGeneralActionsAddonItem = Pick<AddonItem, 'Item'>

export const SubjectPagePlugins = createPluginHook<
  {
    mainColumnItems?: AddOnMap<AddonItemNoKey>
    overallItems?: AddOnMap<SubjectOverallProps>
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
  const [subjectPageData, setSubjectPageData] = useState<SubjectPageData | null>(null)
  useEffect(() => {
    shell.rpc.me['webapp/subject-page-data/:_key'](undefined, { _key: subjectKey }).then(
      setSubjectPageData,
    )
  }, [subjectKey])
  const plugins = SubjectPagePlugins.usePluginHooks({ subjectKey })

  return useMemo<SubjectProps | null>((): SubjectProps | null => {
    if (!subjectPageData) {
      return null
    }
    const subjectProps: SubjectProps = {
      mainLayoutProps,
      iscedUrl: subjectPageData.iscedUrl,
      isIsced: subjectPageData.isIsced,
      title: subjectPageData.title,
      mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
      overallItems: plugins.getKeyedAddons('overallItems'),
      mainSubjectCardSlots: {
        footerRowItems: plugins.getKeyedAddons('main_footerRowItems'),
        headerItems: plugins.getKeyedAddons('main_headerItems'),
        mainColumnItems: plugins.getKeyedAddons('main_mainColumnItems'),
      },
    }
    return subjectProps
  }, [subjectPageData, mainLayoutProps, plugins])
}
