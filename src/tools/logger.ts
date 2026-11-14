import { Notice } from "obsidian";
import { setUtil } from "../settings/settings";


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
  if (setUtil.base.dev) {
    debug(`(${args.path} - ${args.loc}) ${args.msg}`, { ...args.info, extra: args.extra })
  } 
}
function cleanLog(args: debugLogArgs) {
  if (setUtil.base.dev) {
    debug(`(${args.path} - ${args.loc}) ${args.msg}`, {...args.info, extra:args.extra})
  } else {
    debug(`(${args.path} - ${args.loc}) ${args.msg}`, args.info)
  }
}
const debug = (...args: unknown[]): void => {
  if (setUtil.base.debug) {
    console.debug('*NCP*', ...args);
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
  if (setUtil.base.ErrorNotice) {
    new Notice(thing)
  }
  debug(thing, args)
}

function summaryNotice(moved: number, flagged: number, ignored:number, failed:number) {
  if (setUtil.base.SummaryNotice) {
    new Notice(`${moved} Files moved
${flagged} Files flagged 
${ignored} Files ignored
${failed} Files failed`)
  }
  debug('Update all Files Summary',{FilesMoved:moved, filesFlagged:flagged, filesIgnored:ignored, filesFailed:failed})
}

export const logger = {
  err: errorNotice,
  sum: summaryNotice,
  debug:debug
}