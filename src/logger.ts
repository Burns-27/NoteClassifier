import { settingUtil } from "./settings/settingsUtil";



function location(loc: string, message:string,  info: Record<string, unknown>) {
  debug(`(${loc}) ${message}`, JSON.stringify(info, null, 2) )
}
function fallbackError(type: string, info: Record<string, unknown>) {
  debug(`(Fallback Error) ${type}`, JSON.stringify(info, null, 2))
}

const debug = (...args: unknown[]): void => {
  if (settingUtil.get().debug) {
    console.debug('[NCP]', ...args);
  }
};

function test(thing:string, ...args: unknown[]){
  return 
}
export const devlog = {
  loc: location,
  fallback: fallbackError,
  test: test, 
}