import { FC, useCallback, useContext, useMemo, useState } from 'react'
import ProfilePage, { ProfileProps } from './Profile.js'
import { MainContext } from '../../../MainContext.js'
import { useMainLayoutProps } from '@moodlenet/react-app/ui'

type RespCall =
  | {
      success: true
    }
  | {
      success: false
      msg: string
    }

export const useProfileProps = (): ProfileProps => {
  const { pkgs } = useContext(MainContext)
  const [profileApi] = pkgs
  const [errMsg, setErrMsg] = useState('')

  const createProfile = useCallback(async () => {
    const res: any = await profileApi.call('createProfile')({
      displayName: 'test create',
      userId: 'u111',
    })
    !(res as RespCall).success && setErrMsg(res.msg)
  }, [profileApi])

  const mainLayoutProps = useMainLayoutProps()

  const panelProps = useMemo<ProfileProps>(() => {
    const props: ProfileProps = {
      // displayName,
      // profileCardProps,
      mainLayoutProps,
    }
    return props
  }, [])

  return panelProps
}

export const ProfileCtrl: FC = () => {
  const panelProps = useProfileProps()

  return <ProfilePage {...panelProps} />
}
