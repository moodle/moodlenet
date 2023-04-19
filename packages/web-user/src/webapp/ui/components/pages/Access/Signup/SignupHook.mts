import { useFooterProps, useMinimalisticHeaderProps } from '@moodlenet/react-app/ui'
import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { SignupProps } from './Signup.js'

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const { registries } = useContext(MainContext)
  const signupProps = useMemo<SignupProps>(() => {
    const signupItems = registries.signupItems.registry.entries.map(el => ({
      ...el.item,
      key: el.pkgId.name,
    }))
    return {
      headerProps,
      footerProps,
      signupItems,
    }
  }, [headerProps, footerProps, registries.signupItems.registry.entries])
  return signupProps
}
