import { isJust } from '@moodlenet/common/lib/utils/array'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { headerCtrlWithProps } from '../../../components/Header/HeaderCtrl/HeaderCtrl'
import { createWithProps } from '../../../lib/ctrl'
import { FollowTag } from '../../../types'
import { HeaderPageProps } from '../HeaderPage'
import { useHeaderPagePinnedLazyQuery } from './HeaderPageCtrl.gen'
import './styles.scss'

export const [HeaderPageCtrl, headerPageCtrlwithProps] = createWithProps<HeaderPageProps, {}>(props => {
  const { currentProfile } = useSession()
  const [queryPinned, pinned] = useHeaderPagePinnedLazyQuery()

  useEffect(() => {
    if (currentProfile) {
      queryPinned({ variables: { currentProfileId: currentProfile.id } })
    }
  }, [currentProfile, queryPinned])

  const subHeaderProps = useMemo<HeaderPageProps['subHeaderProps']>(() => {
    const tags = pinned.data?.node?.pinnedList.edges
      .map(edge => (edge.node.__typename === 'SubjectField' ? edge.node : null))
      .filter(isJust)
      .map<FollowTag>(({ name }) => ({
        name,
        type: 'General',
      }))
    return tags
      ? {
          tags,
        }
      : null
  }, [pinned.data?.node?.pinnedList.edges])

  const headerPageProps = useMemo<HeaderPageProps>(() => {
    const { __key, __uiComp, ...rest } = props

    const headerPageProps: HeaderPageProps = {
      ...rest,
      subHeaderProps,
      headerWithProps: headerCtrlWithProps({ key: 'Header' }),
    }
    return headerPageProps
  }, [props, subHeaderProps])

  const { __uiComp: HeaderPageUI } = props

  return <HeaderPageUI {...headerPageProps} />
})
