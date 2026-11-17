import { App, CachedMetadata, getAllTags, normalizePath, TFile } from "obsidian";
import {  logger } from "./logger";
import { Logs } from "./logClass";
import { TClsFile } from "../types";
/**
 * App util is the class that handles the interaction with the Obsidian app, and the vault.
 * It is a singleton class,
 * It is initialized in the main.ts file, during onload. 
 */
export class AppUtils {
  private static instance: AppUtils;
  private app!: App;
  private constructor() { }

  public static getInstance(): AppUtils {
    if (!AppUtils.instance) {
      AppUtils.instance = new AppUtils();
    }
    return AppUtils.instance;
  }
  public ini(app: App) {
    this.app = app
  }
  public getFileCache(file: TFile): CachedMetadata | null{
    return this.app.metadataCache.getFileCache(file)
  }
  public getAllTags(cache: CachedMetadata) {
    return getAllTags(cache)
  }
  /**
   * Adds properties, or updates existing properties, with out removing or adjust existing
   * @param file Obsidian TFile
   * @param fm the new FM to add or update 
   * @param log The log instance. 
   */
  public async addFM(file: TFile, fm: Record<string, unknown>, log: Logs) {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      try {
        log.add('starting fm', {...frontmatter})
        Object.assign(frontmatter, fm)
        log.add('resulting fm', {...frontmatter})
      } catch (e) {
        console.error(e)
      }
    })
  }
  /**
   * Replaces frontmatter entirely
   * @param file Obsidian TFile
   * @param newFM The new Frontmatter Object
   * @param log the log instance. 
   */
  public async processFrontmater(file: TFile, newFM: Record<string, unknown>, log:Logs) {
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      try {
        frontmatter = newFM
        log.add('Finished Frontmatter', {...frontmatter})
      } catch (e) {
        console.debug(e)
      }
    })
  }
  /**
   * 
   * @returns the active workspace file, or false
   */
  public getActiveFile(): TFile | false{
		const file = this.app.workspace.getActiveFile()
				if (file) {
					return file
				} 
			return false
  }
  /**
   * Checks destination path, creates missing folders, and moves the file to the new destination.
   * @param file The classified file
   * @param log the log instance
   */
  public async moveFile(file: TClsFile, log:Logs) {
    let folderArray = file.destination.split('/')
    let madeFilesArray:string[]=[]
    let path: string = ''
    for (let folder of folderArray) {
      path = normalizePath(`${path}/${folder}`)
      const check = this.app.vault.getFolderByPath(path)
      if (!check) {
          madeFilesArray.push(path)
          await this.app.vault.createFolder(path)
      }
    }
    log.add('Made Folders', madeFilesArray)
    const check = this.app.vault.getFolderByPath(path)
    log.add('Destination folder', check)
    const finalPath = normalizePath(`${path}/${file.TFile.name}`)
    log.add('final path', finalPath)
    this.app.fileManager.renameFile(file.TFile, finalPath).catch((e)=>logger.debug(e))
  }
}

export const appUtils = AppUtils.getInstance();