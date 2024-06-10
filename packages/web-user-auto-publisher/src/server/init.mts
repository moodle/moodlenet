import { env } from './env.mjs'

if (!env.noBgProc) {
  // BEWARE: the following line is under !noBgProc condition and not awaited,
  // in order to execute this feature first-setup in background
  // remove condition and await next persistence upgrades
  // consider how to manage this in case of later upgrades
  import('./init/persistence-upgrade.mjs')
}
