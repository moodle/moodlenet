export type BareMetalHandle = {
  set_kernel_mod: (kernelMod: string) => void
  get_kernel_mod: () => string
  reboot: () => void
  cwd: string
  modRequire: NodeRequire
}

// export type Boot = (_: BareMetalHandle) => Promise<unknown>
// export type BootModule = {
//   boot: Boot
// }
