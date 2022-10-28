import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { SignupFormValues, SignupProps } from './Signup.js'
import { MainContext } from './MainComponent.js'
import * as SignUpAddon from './Signup.js'

export const usePanelProps = (): SignupProps => {
  const { pkgs } = useContext(MainContext)
  const [myPkg] = pkgs

  const signUp = useCallback(
    async ({
      displayName,
      email,
      password,
    }: SignupFormValues): Promise<{ success: true } | { success: false; msg: string }> => {
      const res = await myPkg.call('signup')({
        displayName,
        email,
        password,
      })
      return res
    },
    [myPkg],
  )

  const panelProps = useMemo<SignupProps>(() => {
    const props: SignupProps = {
      signUp,
    }

    return props
  }, [signUp])

  return panelProps
}

export const SignUpPanelCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <SignUpAddon.Panel {...panelProps} />
}
