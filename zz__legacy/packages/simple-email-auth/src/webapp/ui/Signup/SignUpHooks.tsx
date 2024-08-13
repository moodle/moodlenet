import { useFormik } from 'formik'
import type { FC, PropsWithChildren } from 'react'
import { useMemo, useState } from 'react'
import { shell } from '../../shell.mjs'
import type { SignupFormValues, SignupProps } from './Signup.js'
import * as SignUpAddon from './Signup.js'

export const usePanelProps = (): SignupProps => {
  const [emailSent, setEmailSent] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const form = useFormik<SignupFormValues>({
    initialValues: { email: '', password: '', displayName: '' },
    async onSubmit({ email, password, displayName }) {
      setErrMsg('')
      const res = await shell.rpc.me('signup')({
        displayName,
        email,
        password,
      })

      if (!res.success) {
        setErrMsg(res.msg)
        return
      }
      setEmailSent(true)
    },
  })

  const panelProps = useMemo<SignupProps>(() => {
    const props: SignupProps = {
      form,
      errMsg,
      emailSent,
    }

    return props
  }, [emailSent, errMsg, form])

  return panelProps
}

export const SignUpPanelContainer: FC<PropsWithChildren> = ({ children }) => {
  const panelProps = usePanelProps()

  return <SignUpAddon.SignupPanel {...panelProps}>{children}</SignUpAddon.SignupPanel>
}
