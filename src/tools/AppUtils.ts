import { App, CachedMetadata, getAllTags, normalizePath, TFile } from "obsidian";
import { logger } from "../logger";

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
  public  processFrontmater(file: TFile, newFM: Record<string, unknown>) {
     this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      try {
        Object.assign(frontmatter, newFM)
      } catch (e) {
        console.debug(e)
      }
    }).catch((e)=>logger.debug(e))
  }
  public  moveFile(file: TFile, destination: string, folderArray: string[]) {
    let path: string = ''
    folderArray.forEach((folder) => {
      path = path ? `${path}/${folder}` : folder
      const check = this.app.vault.getFolderByPath(path)
      if (!check) {
         void this.app.vault.createFolder(normalizePath(path))
      }
    })
     this.app.fileManager.renameFile(file, destination).catch((e)=>logger.debug(e))
  }
}

export const appUtils = AppUtils.getInstance();