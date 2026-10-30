import { Notice } from "obsidian";
import { settingUtil } from "./settings/settingsUtil";



function location(loc: string, message?:string,  info?: Record<string, unknown>) {
  debug(`(${loc}) ${message??''}`, info??{} )
}
function fallbackError(type: string, info: Record<string, unknown>) {
  debug(`(Fallback Error) ${type}`, JSON.stringify(info, null, 2))
}

const debug = (...args: unknown[]): void => {
  if (settingUtil.get().debug) {
    console.debug('[NCP]', ...args);
  }
};
const devErr = (loc: string, message?: string, info?: Record<string, unknown>) => {
  debug(`ERROR (${loc}) ${message??''}`, info??{} )
}
function test(thing:string, ...args: unknown[]){
  return 
}
export const devlog = {
  loc: location,
  fallback: fallbackError,
  test: test, 
  err:devErr,
}
function errorNotice(thing: string, ...args: unknown[]) {
  if (settingUtil.get().ErrorNotice) {
    new Notice(thing)
  }
  debug(thing, args)
}

function summaryNotice(moved: number, flagged: number) {
  if (settingUtil.get().SummaryNotice) {
    new Notice(`${moved} Files moved, and ${flagged} files flagged for review`)
  }
  debug({FilesMoved:moved, filesFlagged:flagged})
}

export const logger = {
  err: errorNotice,
  sum: summaryNotice,
  debug:debug
}