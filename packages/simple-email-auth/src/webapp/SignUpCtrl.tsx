import { FC, useContext, useMemo, useState } from 'react'
import { SignupFormValues, SignupProps } from './Signup.js'
import { MainContext } from './MainComponent.js'
import * as SignUpAddon from './Signup.js'
import { useFormik } from 'formik'

export const usePanelProps = (): SignupProps => {
  const { pkgs } = useContext(MainContext)
  const [myPkg] = pkgs

  const [emailSent, setEmailSent] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const form = useFormik<SignupFormValues>({
    initialValues: { email: '', password: '', displayName: '' },
    async onSubmit({ email, password, displayName }) {
      setErrMsg('')
      const res = await myPkg.call('signup')({
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

export const SignUpPanelCtrl: FC = () => {
  const panelProps = usePanelProps()

  return <SignUpAddon.Panel {...panelProps} />
}
