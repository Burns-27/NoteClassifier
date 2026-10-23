import { App, CachedMetadata, getAllTags, TFile } from "obsidian";

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
}

export const appUtils = AppUtils.getInstance();