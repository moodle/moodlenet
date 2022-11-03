import { FC, useCallback, useContext, useMemo, useState } from 'react'
import ProfilePage, { ProfilePageProps } from './ProfilePage_orig_Bru.js'
import { fakeProfilePageProps } from '../fakeData.js'
import { MainContext } from '../MainComponent.js'

type RespCall =
  | {
      success: true
    }
  | {
      success: false
      msg: string
    }

export const usePanelProps = (): ProfilePageProps => {
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

  const panelProps = useMemo<ProfilePageProps>(() => {
    const props: ProfilePageProps = fakeProfilePageProps
    return props
  }, [])

  return panelProps
}

export const ProfilePageCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <ProfilePage {...panelProps} />
}
