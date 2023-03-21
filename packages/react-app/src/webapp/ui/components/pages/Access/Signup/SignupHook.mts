import { useContext, useMemo } from 'react'
import { MainContext } from '../../../../../context/MainContext.mjs'
import { useFooterProps } from '../../../organisms/Footer/MainFooter/MainFooterHooks.mjs'
import { useMinimalisticHeaderProps } from '../../../organisms/Header/Minimalistic/MinimalisticHeaderHooks.mjs'
import { SignupProps } from './Signup.js'

export const useSignUpProps = (): SignupProps => {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  const { reg } = useContext(MainContext)
  const signupProps = useMemo<SignupProps>(() => {
    const signupItems = reg.signupItems.registry.entries.map(el => ({
      ...el.item,
      key: el.pkgId.name,
    }))
    return {
      headerProps,
      footerProps,
      signupItems,
    }
  }, [headerProps, footerProps, reg.signupItems.registry.entries])
  return signupProps
}
