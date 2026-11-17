
/**
 * Name space to handle the checking of settings to see if Need to add a flag. 
 */

import { TFile } from "obsidian";
import { settings } from "../settings/settings";
import { appUtils } from "./AppUtils";
import { Logs } from "./logClass";
import { TClsFile } from "../types";
/**
 * Checks settings for if unclassified files should be flagged, and flags them. 
 * @param file TFile
 * @param log Log instance 
 */
function flagUnclassified(file: TFile, log:Logs) {
  log.add('Flag Unclassified', settings.base.flagUnclassified)
  if (settings.base.flagUnclassified) {
    const fm: Record<string, unknown> = {}
    fm[settings.base.flagProperty] = ['Unable to Classify']
    void appUtils.addFM(file, fm, log)
  }
}
/**
 * Compairs flags on file, and settings for what flags are required. 
 * @param file TClsFile, with the flaged properties
 * @param log the log instance
 */
function addFlags(file: TClsFile, log: Logs):boolean {
  let flagged: boolean = false
  const flags:string[] = []
  if (settings.base.flagFallback&& file.flags.pathFallback) {
    flags.push('Destination fallback')
    flagged = true
  }
  if (settings.base.flagPropsInvalid &&file.flags.propsInvalid) {
    flags.push('Invalid Properties')
    flagged = true
  }
  if (settings.base.flagPropsMissing&& file.flags.propsMissing) {
    flags.push('Missing Properties')
    flagged = true
  }
  if (flagged) {
    file.addFM(settings.base.flagProperty, flags)    
  }
  return flagged
}

function addClsProp(file: TClsFile, log: Logs) {
  if (settings.base.addClassificationProp) {
    log.add('File Classification', file.clsName)
    const fm: Record<string, unknown> = {}
    fm[settings.base.classificationProp] = file.clsName
    void appUtils.addFM(file.TFile, fm, log)
  }
}
export const flag = {
  unclassified:flagUnclassified, 
  add:addFlags,
  addClsProp,
}