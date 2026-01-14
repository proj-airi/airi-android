import { batterystatsTools } from './batterystats'
import { cpustatTools } from './cpustat'
import { deviceTools } from './device'
import { inputTools } from './input'
import { shellTools } from './shell'
import { uiTools } from './ui'
import { utilsTools } from './utils'
import { wmTools } from './wm'

export const moduleTools = [
  wmTools,
  inputTools,
  utilsTools,
  cpustatTools,
  batterystatsTools,
  uiTools,
  deviceTools,
  shellTools,
]
