import { useFooterProps, useMinimalisticHeaderProps } from '@moodlenet/react-app/webapp'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { shell } from '../../shell.mjs'
import type { NewPasswordProps } from './NewPassword.js'

export function useNewPasswordProps({ token }: { token: string }) {
  const nav = useNavigate()
  const footerProps = useFooterProps()
  const headerProps = useMinimalisticHeaderProps()
  const changePassword = useCallback(
    (password: string) => {
      shell.rpc.me['webapp/change-password-using-token']({ password, token }).then(
        ({ success }) => {
          if (success) {
            nav('/login')
          }
        },
      )
    },
    [nav, token],
  )
  const props: NewPasswordProps = {
    footerProps,
    changePassword,
    headerProps,
  }
  return props
}
