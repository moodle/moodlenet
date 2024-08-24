import { mod } from '../mod'

export interface Deployment<_mod extends mod> {
  modName: string
  wakeUp(): Promise<Init>
}

export interface Init {
  deploy(secHandle): Promise<Deploy>
}
export interface SecondaryHandle {}
