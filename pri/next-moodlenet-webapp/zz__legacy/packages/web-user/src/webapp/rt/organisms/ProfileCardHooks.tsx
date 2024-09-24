// import { AuthCtx } from '@moodlenet/web-user/webapp'
import type { AddonItemNoKey } from '@moodlenet/component-library'
import type { AddOnMap } from '@moodlenet/core/lib'
import type { OverallCardItem } from '@moodlenet/react-app/ui'
import { createPlugin } from '@moodlenet/react-app/webapp'
import type { ProfileCardData } from '../../../common/profile/type.mjs'
import type { ProfileCardProps } from '../../ui/exports/ui.mjs'
import { useProfileProps } from '../page/profile/ProfileHooks'

export const ProfileCardPlugins = createPlugin<
  {
    bottomTouchColumnItems: AddOnMap<AddonItemNoKey>
    mainColumnItems: AddOnMap<AddonItemNoKey>
    overallCardItems: AddOnMap<Omit<OverallCardItem, 'key'>>
  },
  {
    profileKey: string
  }
>()

export const useProfileCardProps = (profileKey: string): ProfileCardProps | null => {
  const plugins = ProfileCardPlugins.usePluginHooks({ profileKey })
  const profileProps = useProfileProps({ profileKey, ownContributionListLimit: 0 })

  if (!profileProps) {
    return null
  }
  const data: ProfileCardData = profileProps.data
  const access = profileProps.access
  const state = profileProps.state
  const actions = profileProps.actions
  const profileCardProps: ProfileCardProps = {
    mainColumnItems: plugins.getKeyedAddons('mainColumnItems'),
    bottomTouchColumnItems: plugins.getKeyedAddons('bottomTouchColumnItems'),
    overallCardProps: {
      items: [...profileProps.overallCardItems, ...plugins.getKeyedAddons('overallCardItems')],
    },
    data,
    access,
    actions,
    state,
  }

  return profileCardProps
}
