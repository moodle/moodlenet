import { HeaderMenuItemRegItem, href } from '@moodlenet/react-app/ui'
import { ExitToApp } from '@mui/icons-material'
import { FC, ReactElement, useContext } from 'react'
import { AuthCtx } from '../../../../context/AuthContext.js'

// TODO //@ETTO Shoud separate hook from this component

type IconType = {
  icon: string | ReactElement
}
const IconContainer: FC = () => {
  const { clientSessionData } = useContext(AuthCtx)
  if (!clientSessionData?.myProfile) {
    return <></>
  }
  const iconUrl = '' // TODO //@ETTO: should use avatarUrl from clientSessionData?.myProfile
  return <HeaderProfileIcon icon={iconUrl}></HeaderProfileIcon>
}

export const HeaderProfileIcon: FC<IconType> = ({ icon }: IconType) => {
  return !icon ? (
    <></>
  ) : typeof icon === 'string' ? (
    <div
      style={{
        backgroundImage: 'url("' + icon + '")',
        // backgroundImage: 'url(' + clientSessionData.userDisplay.avatarUrl + ')',
        backgroundSize: 'cover',
      }}
      className="avatar"
    />
  ) : (
    icon
  )
}

export const profileAvatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: <IconContainer />,
  Path: href('/my-profile'),
  Text: 'Profile',
  ClassName: 'profile',
  // Position: position,
}

export const signoutAvatarmenuItemReg: HeaderMenuItemRegItem = {
  Icon: <ExitToApp />,
  Path: href('/signout'),
  Text: 'Sign out',
  ClassName: 'signout',
  // Position: position,
}
