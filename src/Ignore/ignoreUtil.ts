import { FrontMatterCache, TFile, TFolder } from "obsidian";

import { settings } from "../settings/settings";
import { appUtils, Logs } from "../tools";

/**
 * Intermidiary between obsidian specific things, settings, and Files and File logic. 
 */

export class IgnoreUtil {
  private static instance: IgnoreUtil;

  private constructor() {}

  public static getInstance(): IgnoreUtil {
    if (!IgnoreUtil.instance) {
      IgnoreUtil.instance = new IgnoreUtil();
    }
    return IgnoreUtil.instance;
  }
  get prop(): string{
    return settings.base.ignoreFilesProperty
  }
  get ignoredFolders(): Set<string> {
    return settings.ignoredFoldersSet
  }
  public checkFolder(file: TFile, log: Logs): boolean {
    const path = file.path
    log.add('File path', path)
    let folderPaths = []
    let slashIndex = path.indexOf('/')
    while (slashIndex !== -1) {
      const folderPath = path.slice(0, slashIndex);
      folderPaths.push(folderPath)
      if (this.ignoredFolders.has(folderPath)) {
        log.add('Ignored folder', folderPath)
        return true
      }
      slashIndex = path.indexOf('/', slashIndex + 1)
    }
    return false
  }
  public checkProperty(fm: FrontMatterCache, log: Logs): boolean {
  const prop = this.prop
  log.add('Value of Ignore Prop', fm[prop])
  //If the property isnt on the file
  if (fm[prop] == undefined) return false
  //If the property isnt a boolean 
  if (typeof fm[prop] !== 'boolean') return false
  return fm[prop]
  }
  /**
 * Adds Folder to Ignored Folder Set. 
 * Will still need to Save Settings after. 
 * @param folder - either Obsidian TFolder or string.  
 */
 public markFolder(folder: TFolder|string) {
  const path:string = (folder instanceof TFolder)?folder.path:folder
  settings.ignoredFoldersSet.add(path)
}
/**
 * Adds the ignored file property to a file. 
 * @param file The Obsidian TFile
 * @param log  The log instance
 */
public markFile(file: TFile, log:Logs) {
 
  const newFM: Record<string, unknown> = {}
  newFM[this.prop] = true
  log.add('newFM passed to apputil', newFM)
  void appUtils.addFM(file, newFM, log)
}

}

export const ignore = IgnoreUtil.getInstance();





