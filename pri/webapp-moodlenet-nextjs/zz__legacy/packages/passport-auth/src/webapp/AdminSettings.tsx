import type { AddonItem } from '@moodlenet/component-library'
import { FormConfig } from './FormConfig'

export const Menu: AddonItem = { Item: () => <span>Passport Auth</span>, key: 'menu-passport-auth' }
export const Content: AddonItem = {
  Item: () => (
    <div className="passport-auth" key="passport-auth">
      <FormConfig />
    </div>
  ),
  key: 'content-passport-auth',
}
