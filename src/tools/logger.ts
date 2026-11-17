import { Notice } from "obsidian";
import { settings } from "../settings/settings";


const debug = (...args: unknown[]): void => {
  if (settings.base.debug) {
    console.debug('*NCP*', ...args);
  }
};
function errorNotice(thing: string, ...args: unknown[]) {
  if (settings.base.ErrorNotice) {
    new Notice(thing)
  }
  debug(thing, args)
}

function summaryNotice(moved: number, flagged: number, ignored:number, failed:number) {
  if (settings.base.SummaryNotice) {
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