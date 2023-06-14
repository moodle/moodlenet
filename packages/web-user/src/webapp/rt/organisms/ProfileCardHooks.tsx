// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { OverallCardItem } from '@moodlenet/react-app/ui'
import { createHookPlugin } from '@moodlenet/react-app/webapp'
import { useMemo } from 'react'
import type { ProfileCardData } from '../../../common/profile/type.mjs'
import type { ProfileCardProps } from '../../ui/exports/ui.mjs'
import { useProfileProps } from '../page/profile/ProfileHooks.js'

export const ProfileCardPlugins = createHookPlugin<
  {
    bottomTouchColumnItems: AddonItemNoKey
    mainColumnItems: AddonItemNoKey
    overallCardItems: Omit<OverallCardItem, 'key'>
  },
  {
    profileKey: string
  }
>({ bottomTouchColumnItems: null, mainColumnItems: null, overallCardItems: null })

export const useProfileCardProps = (profileKey: string): ProfileCardProps | null => {
  const [addons] = ProfileCardPlugins.useHookPlugin({ profileKey })
  const profileProps = useProfileProps({ profileKey })

  const profileCardProps = useMemo(() => {
    if (!profileProps) {
      return null
    }
    const data: ProfileCardData = profileProps.data
    const access = profileProps.access
    const state = profileProps.state
    const actions = profileProps.actions
    const propsPage: ProfileCardProps = {
      mainColumnItems: addons.mainColumnItems,
      bottomTouchColumnItems: addons.bottomTouchColumnItems,
      overallCardProps: { items: addons.overallCardItems },
      data,
      access,
      actions,
      state,
    }

    return propsPage
  }, [addons.bottomTouchColumnItems, addons.mainColumnItems, addons.overallCardItems, profileProps])

  return profileCardProps
}
