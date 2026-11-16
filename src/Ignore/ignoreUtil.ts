import { FrontMatterCache, TFile, TFolder } from "obsidian";
import { logs } from "../tools/logClass";
import { setUtil } from "../settings/settings";
import { appUtils } from "../tools/AppUtils";
/**
 * Intermidiary between obsidian specific things, settings, and Files and File logic. 
 */



/**
 * Adds the ignored file property to a file. 
 * @param file The Obsidian TFile
 * @param log  The log instance
 */
function markFileIgnored(file: TFile, log:logs) {
  const prop = setUtil.base.ignoreFilesProperty
  const newFM: Record<string, unknown> = {}
  newFM[prop] = false
  log.add('newFM passed to apputil', newFM)
  void appUtils.addFM(file, newFM, log)
}
/**
 * Adds Folder to Ignored Folder Set. 
 * Will still need to Save Settings after. 
 * @param folder - either Obsidian TFolder or string.  
 */
function markFolderIgnored(folder: TFolder|string) {
  const path:string = (folder instanceof TFolder)?folder.path:folder
  setUtil.ignoredFoldersSet.add(path)
}

function checkIgnoredProperty(fm: FrontMatterCache, log:logs): boolean{
  const prop = setUtil.base.ignoreFilesProperty
  log.add('Value of Ignore Prop', fm[prop])
  //If the property isnt on the file
  if (fm[prop] == undefined) return false
  //If the property isnt a boolean 
  if (typeof fm[prop] !== 'boolean') return false
  return fm[prop]
}

function checkIgnoredFolder(file: TFile, log:logs):boolean {
  const path = file.path
  log.add('File path', path)
  let folderPaths = []
    let slashIndex = path.indexOf('/')
    while (slashIndex !== -1) {
      const folderPath = path.slice(0, slashIndex);
      folderPaths.push(folderPath)
      if (setUtil.ignoredFoldersSet.has(folderPath)) {
        log.add('Ignored folder', folderPath)
        return true
      }
      slashIndex = path.indexOf('/', slashIndex + 1)
    }
  return false
}

export const ignoreUtil = {
  checkIgnoredFolder,
  checkIgnoredProperty,
  markFileIgnored,
  markFolderIgnored
}