
/**
 * Name space to handle the checking of settings to see if Need to add a flag. 
 */

import { TFile } from "obsidian";
import { setUtil } from "../settings/settings";
import { appUtils } from "../tools/AppUtils";
import { logs } from "../tools/logClass";
import { TClsFile } from "../types";
/**
 * Checks settings for if unclassified files should be flagged, and flags them. 
 * @param file TFile
 * @param log Log instance 
 */
function flagUnclassified(file: TFile, log:logs) {
  log.add('Flag Unclassified', setUtil.base.flagUnclassified)
  if (setUtil.base.flagUnclassified) {
    const fm: Record<string, unknown> = {}
    fm[setUtil.base.flagProperty] = ['Unable to Classify']
    void appUtils.addFM(file, fm, log)
  }
}
/**
 * Compairs flags on file, and settings for what flags are required. 
 * @param file TClsFile, with the flaged properties
 * @param log the log instance
 */
function addFlags(file: TClsFile, log: logs) {
  
}
export const flagUtil = {
  flagUnclassified, 
  addFlags
}