import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import { EdMetaContext } from '@moodlenet/ed-meta/webapp'
import { createPlugin } from '@moodlenet/react-app/webapp'
import { useContext, useMemo } from 'react'
import type { GeneralProps } from '../../../../ui/exports/ui.mjs'
import { MyProfileContext } from '../../../context/MyProfileContext.js'

export const GeneralSettingsPlugin = createPlugin<{
  mainColumn: AddOnMap<AddonItemNoKey>
}>()

export function useGeneralSettingsProps() {
  const myProfileCtx = useContext(MyProfileContext)
  const { publishedMetaOptions } = useContext(EdMetaContext)
  const plugins = GeneralSettingsPlugin.usePluginHooks()
  const generalProps = useMemo<GeneralProps | null>(() => {
    if (!myProfileCtx) {
      return null
    }
    const generalProps: GeneralProps = {
      mainColumnItems: plugins.getKeyedAddons('mainColumn'),
      interests: myProfileCtx.myInterests.current,
      interestsOptions: {
        languageOptions: publishedMetaOptions.languages,
        levelOptions: publishedMetaOptions.levels,
        licenseOptions: publishedMetaOptions.licenses,
        subjectOptions: publishedMetaOptions.subjects,
      },
      editInterests: myProfileCtx.myInterests.save,
    }
    return generalProps
  }, [
    myProfileCtx,
    plugins,
    publishedMetaOptions.languages,
    publishedMetaOptions.levels,
    publishedMetaOptions.licenses,
    publishedMetaOptions.subjects,
  ])
  return generalProps
}
