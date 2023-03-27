import { resFakeData } from './fakeData.mjs'

const getFakeData = (resourceKey: string) => (resourceKey ? resFakeData : resFakeData)

export const empityResourceForm = getFakeData('0')
