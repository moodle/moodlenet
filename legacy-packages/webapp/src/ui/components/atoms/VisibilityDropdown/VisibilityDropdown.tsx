import { t } from '@lingui/macro'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import { FC } from 'react'
import {
  Dropdown,
  DropdownProps,
  IconPill,
  IconTextOption,
} from '../Dropdown/Dropdown'
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
> = (props) => {
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
        label={t`Public`}
        icon={VisibilityNodes.Public}
      />
      <IconTextOption
        key={Private}
        value={Private}
        label={t`Private`}
        icon={VisibilityNodes.Private}
      />
    </Dropdown>
  )
}
