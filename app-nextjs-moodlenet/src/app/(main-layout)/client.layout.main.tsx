'use client'
import PrimaryButton from '@/components/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '@/components/atoms/Searchbox/Searchbox'
import TertiaryButton from '@/components/atoms/TertiaryButton/TertiaryButton'
import { Person } from '@mui/icons-material'
import { siteUrls } from 'lib/common/utils/site-urls'
import Link from 'next/link'

export function LoginHeaderButton() {
  const { access } = siteUrls()
  return (
    <Link href={access.login} className="login-button access-button">
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
  const { access } = siteUrls()
  return (
    <Link href={access.signup} className="signup-button access-button">
      <TertiaryButton>
        {/* <Trans> */}
        Sign up
        {/* </Trans> */}
      </TertiaryButton>
    </Link>
  )
}

export function HeaderSearchbox({ placeholder }: { placeholder: string }) {
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
