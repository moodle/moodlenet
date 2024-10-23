import { net_webapp_nextjs_default_configs } from '@moodle/module/net-webapp-nextjs/setup'
import { net_default_configs } from '@moodle/module/net/setup'
import { org_default_configs } from '@moodle/module/org/setup'
import { storage_default_configs } from '@moodle/module/storage/setup'
import { userAccount_default_configs } from '@moodle/module/user-account/setup'
import { user_profile_default_configs } from '@moodle/module/user-profile/setup'
import { dbStruct } from '../../../db-structure'
import { saveModConfigs } from '../../../lib/modules'
// import { removePropOnInsert } from '../lib/id'

export async function insertInitialData({ dbStruct }: { dbStruct: dbStruct }) {
 ---------------
}


REMOVE "displayName": "Admindf", FROM JWT PAYLAOD it seems  not used, and  doesn't update when editing profile ..
