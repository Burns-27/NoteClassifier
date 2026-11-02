import { Notice } from "obsidian";
import { settingUtil } from "../settings/settingsUtil";


export interface debugLogArgs {
  path: pathStrings, 
  loc: string,
  msg: string, 
  info: Record<string, unknown>,
  extra:Record<string, unknown>
}
type pathStrings = "Classify" | "Move" | "Settings" | "Props" |"Main"
function start(path: pathStrings, loc: string, msg:string = ""): debugLogArgs{
  return {
    path: path,
    loc,
    msg,
    info: {},
    extra:{}
  }
}
function location(args: debugLogArgs) {
  if (settingUtil.get().dev) {
    debug(`(${args.path} - ${args.loc}) ${args.msg}`, { ...args.info, extra: args.extra })
  } 
}
function cleanLog(args: debugLogArgs) {
  if (settingUtil.get().dev) {
    debug(`(${args.path} - ${args.loc}) ${args.msg}`, {...args.info, extra:args.extra})
  } else {
    debug(`(${args.path} - ${args.loc}) ${args.msg}`, args.info)
  }
}
const debug = (...args: unknown[]): void => {
  if (settingUtil.get().debug) {
    console.debug('[NCP]', ...args);
  }
};
const devErr = (args:debugLogArgs, error:unknown) => {
  debug(`ERROR (${args.path} - ${args.loc}) ${args.msg}`, args.info, error )
}

export const devlog = {
  loc: location,
  log:cleanLog, 
  err: devErr,
  start:start,
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