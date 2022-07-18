import lib from 'moodlenet-react-app-lib';
import React, { FC, useEffect } from 'react';
import { ConfigApiKey, ErrorMsg } from './types';

// const getValue = (obj:any, field:string) => obj[field] ? obj[field].value : null
const eventTargetReader = (eventTarget: HTMLFormElement, fields:string[])=>{
    return fields.reduce((acc, field)=> ({ ...acc, [field]:eventTarget[field]}), {})
}

const InputLabel = ({label, type, placeholder, value, name, ...others}: any)=>(
  <label style={{display: 'block'}} >
    {label} &nbsp;
    <input
      type={type || 'text'}
      placeholder={placeholder || ''}
      defaultValue={value}
      name={name}
      {...others}
    />
  </label>
)

const FormConfig: FC = (_) => {
const [config, setConfig] = React.useState<ConfigApiKey | null>(null)
const [error, setError] = React.useState<ErrorMsg | null>(null)

  useEffect(()=>{
    lib.priHttp.fetch<any>('moodlenet-passport-auth', '0.1.10')('getAll')({}).then((res:any)=>{
      console.log('res of ptiHttp fetch', res)
      setConfig(res.data)
    })

  },[])

  // const getValue = (field:string)=> config && (config as any)[field] ? (config as any)[field] : ''
  const setterConfig = (val:ConfigApiKey )=> {
    console.log('setter config ', val)
    setConfig(val)
  }
  const handleSubmit = (event :React.FormEvent<HTMLFormElement>):void => {
    event.preventDefault()
    const formValues = eventTargetReader(event.currentTarget, ['provider','apiKey', 'apiSecret','other'] )
    const newFormValues = (formValues || {}) as ConfigApiKey
    setConfig(newFormValues)
    lib.priHttp.fetch<any>('moodlenet-passport-auth', '0.1.10')('save')(newFormValues).then((res:any)=>{
      console.log('res of ptiHttp fetch', res)
    })
   // const [error]=onSubmit(newFormValues)
    setError(error)
    //console.log('values', formValues)
    console.log('second ', formValues);
  }

  const handleReset =(_ :any) :void =>setterConfig({apiKey:''})

  return <div>
    <h3>Config Api Key</h3>
    <form onSubmit={handleSubmit}>
      <InputLabel
        label="Api key"
        type="text"
        placeholder="Api key"
        value={config?.apiKey || ''}
        name="apiKey"
      />
      <InputLabel
        label="Api secret"
        type="text"
        placeholder="Api secret"
        value={config?.apiSecret || ''}
        name="apiSecret"
      />
      <div>
      <button type="submit" style={{  }} >
        salva
        </button>
        <button onClick={handleReset} style={{  }} >
        reset
        </button>
        </div>
        <div> {error && error.msg}</div>
    </form>
  </div>
}

export default FormConfig