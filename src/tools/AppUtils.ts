import { App, CachedMetadata, getAllTags, normalizePath, TFile } from "obsidian";
import { devlog, logger } from "../logger";
import { settingUtil } from "../settings/settingsUtil";

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
  public async processFrontmater(file: TFile, newFM: Record<string, unknown>, flags?:string[]) {
     await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      try {
        Object.assign(frontmatter, newFM)
        if (flags && flags.length !== 0) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- frontmatter is weird
          frontmatter[settingUtil.get().NoticeProperty] = flags
        }
        else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- frontmatter is weird (And any by default)
          delete frontmatter[settingUtil.get().NoticeProperty]
        }
        devlog.loc('Update',"Frontmatter post update", {frontmatter:{...frontmatter}})
      } catch (e) {
        console.debug(e)
      }
    })
  }
  public async moveFile(file: TFile, destination: string, folderArray: string[]) {
    let path: string = ''
    for( let folder of folderArray){
      path = path ? `${path}/${folder}` : folder
      const check = this.app.vault.getFolderByPath(path)
      if (!check) {
          await this.app.vault.createFolder(normalizePath(path))
      }
    }
    const check = this.app.vault.getFolderByPath(path)
    devlog.loc('MoveFile', 'Right before move', { file, destination, path, check })
     this.app.fileManager.renameFile(file, destination).catch((e)=>logger.debug(e))
  }
}

export const appUtils = AppUtils.getInstance();