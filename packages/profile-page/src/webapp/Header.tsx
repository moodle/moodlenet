import lib from 'moodlenet-react-app-lib'
import { FC, useContext } from 'react'

export const Text = 'Profile'
export const Path = '/profile'
export const Icon: FC = ({}) => {
  const { clientSessionData } = useContext(lib.auth.AuthCtx)
  const avatar = {
    backgroundImage:
      'url(' + clientSessionData?.avatarUrl ?? 'https://moodle.net/static/media/default-avatar.2ccf3558.svg' + ')',
    backgroundSize: 'cover',
  }

  return <div style={avatar} className="avatar" />
}
