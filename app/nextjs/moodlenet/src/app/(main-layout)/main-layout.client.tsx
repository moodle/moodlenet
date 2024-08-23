'use client'
import { sitepaths } from '#lib/common/utils/sitepaths'
import PrimaryButton from '#ui/atoms/PrimaryButton/PrimaryButton'
import Searchbox from '#ui/atoms/Searchbox/Searchbox'
import TertiaryButton from '#ui/atoms/TertiaryButton/TertiaryButton'
import Person from '@mui/icons-material/Person'
import { t } from 'i18next'
import Link from 'next/link'

export function LoginHeaderButton() {
  const { access } = sitepaths()
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
  const { access } = sitepaths()
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

export function HeaderSearchbox() {
  return (
    <Searchbox
      {...{
        placeholder: t('Search for open educational content'),
        search: console.log,
        boxSize: 'small',
        triggerBtn: true,
      }}
    />
  )
}
