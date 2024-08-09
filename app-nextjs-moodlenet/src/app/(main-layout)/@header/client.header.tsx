'use client'
import PrimaryButton from '@/components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'
import TertiaryButton from '@/components/atoms/TertiaryButton/TertiaryButton'
import { Person } from '@mui/icons-material'
import Link from 'next/link'

export function LoginHeaderButton() {
  return (
    <Link href="/login" className="login-button access-button">
      <PrimaryButton>
        {/* <Trans> */}
        <span>Login</span>
        {/* </Trans> */}
        <Person />
      </PrimaryButton>
    </Link>
  )
}

export function SignupHeaderButton() {
  return (
    <Link href="/signup" className="signup-button access-button">
      <TertiaryButton>
        {/* <Trans> */}
        Sign up
        {/* </Trans> */}
      </TertiaryButton>
    </Link>
  )
}

export default function HeaderSearchbox({ placeholder }: { placeholder: string }) {
  return (
    <Searchbox
      {...{
        placeholder,
        search: console.log,
        boxSize: 'small',
        triggerBtn: true,
      }}
    />
  )
}
