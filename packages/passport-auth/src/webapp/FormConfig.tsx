import React, { FC, useContext, useRef } from 'react'
import { PassportConfigs } from '../store/types'
import { PassportContext } from './MainProvider'

export const FormConfig: FC = () => {
  const apiKeyRef = useRef<HTMLInputElement>(null)
  const apiSecretRef = useRef<HTMLInputElement>(null)
  const ctx = useContext(PassportContext)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (!(apiKeyRef.current && apiSecretRef.current)) {
      return
    }
    event.preventDefault()
    const configs: PassportConfigs = {
      google: {
        apiKey: apiKeyRef.current.value,
        apiSecret: apiSecretRef.current.value,
      },
    }
    ctx.save(configs)
  }

  return (
    <div>
      <h3>Google Config Api Key</h3>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block' }}>
          Api Key &nbsp;
          <input ref={apiKeyRef} type={'text'} placeholder={'Api Key'} defaultValue={ctx.configs.google?.apiKey} />
        </label>
        <label style={{ display: 'block' }}>
          Api Secret &nbsp;
          <input
            ref={apiSecretRef}
            type={'text'}
            placeholder={'Api Secret'}
            defaultValue={ctx.configs.google?.apiKey}
          />
        </label>

        <div>
          <button type="submit" style={{}}>
            salva
          </button>
        </div>
      </form>
    </div>
  )
}
