import { App, CachedMetadata, getAllTags, normalizePath, TFile } from "obsidian";
import { devlog, logger } from "./logger";
import { setUtil } from "../settings/settings";
import { logs } from "./logClass";

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
    let log = new logs('Update', 'Process FrontMatter',false)
    log.devRecord({newFM,flags})
    let removeFlag:boolean = false
    if(flags && flags.length !==0){
      newFM[setUtil.base.NoticeProperty] = flags
    } else {
      removeFlag = true
    }
    await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
      try {
        Object.assign(frontmatter, newFM)
        if (removeFlag) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- frontmatter is weird (And any by default)
          delete frontmatter[setUtil.base.NoticeProperty]
        }
        log.add('Resulting FM', frontmatter)
        log.log('Updated')
      } catch (e) {
        console.debug(e)
      }
    })
  }
  public async moveFile(file: TFile, destination: string, folderArray: string[]) {
    let log = devlog.start('Move', "Move File")
    log.info.destination = destination
    log.info.folderArray = folderArray
    let madeFilesArray:string[]=[]
    let path: string = ''
    for( let folder of folderArray){
      path = path ? `${path}/${folder}` : folder
      const check = this.app.vault.getFolderByPath(normalizePath(path))
      if (!check) {
          madeFilesArray.push(path)
          await this.app.vault.createFolder(normalizePath(path))
      }
    }
    log.extra.madeFiles = madeFilesArray
    log.extra.createdPath = path
    const check = this.app.vault.getFolderByPath(path)
    log.extra.destinationFileExists = !!check
    devlog.loc(log)
    this.app.fileManager.renameFile(file, destination).catch((e)=>logger.debug(e))
  }
}

export const appUtils = AppUtils.getInstance();