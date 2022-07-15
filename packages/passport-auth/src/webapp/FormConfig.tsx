import React, { FC } from 'react';
import { ConfigApiKey, ErrorMsg } from './types';

interface PropsForm {
  configDefault: ConfigApiKey
  onSubmit:(config:ConfigApiKey)=>[ErrorMsg | null, ConfigApiKey | undefined]
}

const getValue = (obj:any, field:string) => obj[field] ? obj[field].value : null
const eventTargetReader = (eventTarget: HTMLFormElement, fields:string[])=>{
    return fields.reduce((acc, field)=> ({ ...acc, [field]: getValue(eventTarget, field)}), {})
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

const FormConfig: FC<PropsForm> = ({configDefault, onSubmit}) => {
const [config, setConfig] = React.useState<ConfigApiKey>({ ...(configDefault || {}) })
const [error, setError] = React.useState<ErrorMsg | null>(null)
  console.log('render form ',configDefault );

  const getValue = (field:string)=> config && (config as any)[field] ? (config as any)[field] : ''
  const setterConfig = (val:ConfigApiKey )=> {
    console.log('setter config ', val)
    setConfig(val)
  }
  const handleSubmit = (event :React.FormEvent<HTMLFormElement>):void => {
    event.preventDefault()
    const formValues = eventTargetReader(event.currentTarget, ['provider','apiKey', 'apiSecret','other'] )
    const newFormValues = (formValues || {apiKey:''}) as ConfigApiKey
    setConfig(newFormValues)
    const [error]=onSubmit(newFormValues)
    setError(error)
    //console.log('values', formValues)
    console.log('second ', formValues);
  }

  const handleReset =(_ :any) :void =>setterConfig(configDefault)

  return <div>
    <h3>Config Api Key</h3>
    <form onSubmit={handleSubmit}>
      <InputLabel
        label="Provider"
        type="text"
        placeholder="Provider"
        value={getValue('provider')}
        name="provider"
      />
      <InputLabel
        label="Api key"
        type="text"
        placeholder="Api key"
        value={getValue('apiKey')}
        name="apiKey"
      />
      <InputLabel
        label="Api secret"
        type="text"
        placeholder="Api secret"
        value={getValue('apiSecret')}
        name="apiSecret"
      />
      <InputLabel
        label="Other"
        type="text"
        placeholder="Other"
        value={getValue('other')}
        name="other"
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