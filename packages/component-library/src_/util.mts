import { platform } from 'os'
export function fixModuleLocForWebpackByOS(moduleLoc:string){
    switch(platform()){
        case 'win32':
          return moduleLoc.replaceAll('\\','\\\\')
        default:
          return moduleLoc
    }
    
}