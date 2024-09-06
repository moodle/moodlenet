export interface Configs {
  validations: ValidationConfigs
}

export interface ValidationConfigs {
  user: {
    email: { max: number; min: number }
    password: { max: number; min: number }
    displayName: { max: number; min: number }
  }
}
