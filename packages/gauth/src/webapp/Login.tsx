import lib from 'moodlenet-react-app-lib'
import { FC } from 'react'

const { PrimaryButton } = lib.ui.components.atoms
export type LoginFormValues = { email: string; password: string }

export const Icon: FC = () => <span>social</span>
export const Panel: FC = () => {
  return (
    <>
      <a href="/_/moodlenet-gauth/login/federated/google">
        <PrimaryButton>Google</PrimaryButton>
      </a>
      <PrimaryButton onClick={unimplemented}>Facebook</PrimaryButton>
      <PrimaryButton onClick={unimplemented}>Twitter</PrimaryButton>
    </>
  )
}

function unimplemented() {
  alert('not implemented')
}
