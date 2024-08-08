"use client"
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import type { FC } from 'react'
import type { DropdownProps } from '../Dropdown/Dropdown.js'
import { Dropdown, IconPill, IconTextOption } from '../Dropdown/Dropdown.js'

export type Visibility = 'Public' | 'Private'
export const Private: Visibility = `Private`
export const Public: Visibility = `Public`
export const VisibilityNodes = {
  Private: (
    <div>
      <VisibilityOffIcon />
    </div>
  ),
  Public: (
    <div>
      <VisibilityIcon />
    </div>
  ),
}
export const VisibilityDropdown: FC<
  Omit<DropdownProps & { multiple?: false; value?: Visibility }, 'pills'>
> = props => {
  return (
    <Dropdown
      pills={
        props.value && (
          <IconPill
            icon={
              props.value === Public
                ? VisibilityNodes.Public
                : props.value === Private
                ? VisibilityNodes.Private
                : null
            }
          />
        )
      }
      className="visibility-dropdown"
      {...props}
    >
      <IconTextOption
        key={Public}
        value={Public}
        label={/* t */ `Public`}
        icon={VisibilityNodes.Public}
      />
      <IconTextOption
        key={Private}
        value={Private}
        label={/* t */ `Private`}
        icon={VisibilityNodes.Private}
      />
    </Dropdown>
  )
}
