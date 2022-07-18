import lib from 'moodlenet-react-app-lib'
import React, { FC } from 'react'
import FormConfig from './FormConfig'
import { ConfigApiKey, ErrorMsg } from './types'


const { MainLayout } = lib.ui.components.layout

const listDefault: ConfigApiKey[] = [
  { provider: 'google', apiKey: 'goooooooogle' },
  { provider: 'twitter', apiKey: 'twwwwiiittt' }
]

console.log(listDefault)

export const ListConfig: FC = () => {
  const [list, setList] = React.useState<ConfigApiKey[]>(listDefault);
  console.log('listConfig');
  const addSocial = (_: any) => {
    const foundIdx = list.findIndex(el => !el || !el.provider || !el.provider.trim())
    if (foundIdx > -1) { return }
    const _list: ConfigApiKey[] = [...list, { provider: '', apiKey: '' }]
    setList(_list)
  }
  const isEmpityStr = (obj: any, field: string) => !obj || !obj[field] || !obj[field].trim()
  const getStrTrim = (obj: any, field: string) => obj && obj[field] && obj[field].trim()
  const submitForm = (before: ConfigApiKey) =>   (configVals: ConfigApiKey) => { // Promise<[ErrorMsg | null, ConfigApiKey | undefined]> => {
    const provider = getStrTrim(configVals, 'provider')
    const apiKey = getStrTrim(configVals, 'apiKey')
console.log(submitForm)
    if (isEmpityStr(before, 'provider') && !apiKey && !provider) {
      setList(list.filter(el => !isEmpityStr(el, 'provider')))
      return [null, undefined]
    }

    if (!provider) return [{ field: 'provider', msg: 'missing provider ' } as ErrorMsg, undefined]
    if (!apiKey) return [{ field: 'apiKey', msg: 'missing Api Key ' } as ErrorMsg, undefined]
    const foundIdx = list.findIndex(el => el.provider === before.provider)
    const idxRepeat = list.findIndex((el, i) => el.provider === provider && i !== foundIdx)

    if (idxRepeat > -1) return [{ field: provider, msg: 'provider ' + provider + ' is present ' } as ErrorMsg, undefined]

    const _list = [...list]
    _list[foundIdx] = configVals
    lib.priHttp.fetch<any>('moodlenet-passport-auth', '0.1.10')('create')(configVals).then((res:any)=>{
      console.log('res of ptiHttp fetch', res)
    })

    setList(_list)
    return [null, configVals]
  }
  return <MainLayout>
    <h3>Config Api Key</h3>

    {// list.map((config: ConfigApiKey) => <FormConfig key={config.provider} configDefault={config} onSubmit={submitForm(config)} />)
    list.map((config: ConfigApiKey) => <FormConfig key={config.provider} />)}
    <button onClick={addSocial} style={{}} >
      addSocial
    </button>
  </MainLayout>
}

export default ListConfig