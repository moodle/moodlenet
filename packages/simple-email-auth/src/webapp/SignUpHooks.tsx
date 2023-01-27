import { useFormik } from 'formik'
import { FC, useContext, useMemo, useState } from 'react'
import { MainContext } from './MainContext.js'
import * as SignUpAddon from './Signup.js'
import { SignupFormValues, SignupProps } from './Signup.js'

export const usePanelProps = (): SignupProps => {
  const {
    use: { me },
  } = useContext(MainContext)

  const [emailSent, setEmailSent] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const form = useFormik<SignupFormValues>({
    initialValues: { email: '', password: '', title: '' },
    async onSubmit({ email, password, title }) {
      setErrMsg('')
      const res = await me.rpc.signup({
        title,
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
