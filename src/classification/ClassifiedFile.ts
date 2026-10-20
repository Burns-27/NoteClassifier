import { CachedMetadata, FrontMatterCache, getAllTags, TFile } from "obsidian";

import NoteClassifier from "../main";
import { midFile, TClsFile } from "../types/files.types";
import { TCls } from "../types/classifications.types";
import { settingUtil } from "../settings/settingsUtil";
import { ActionResult } from "../types/responses.types";

export class ClsFile implements TClsFile {
  readonly TFile: TFile;
  public name: string;
  readonly startPath: string;
  readonly frontmatter?: FrontMatterCache;
  public tags?: Array<string>;
  private metadataCache: CachedMetadata
  private cls: TCls;
  public classification: string;

  constructor({TFile, metadataCache, tags}:midFile, classification: TCls) {
    this.TFile = TFile
    this.name = TFile.basename
    this.startPath = TFile.path
    this.metadataCache = metadataCache
    this.cls = classification
    this.classification = classification.name
    if (metadataCache.frontmatter) {
      this.frontmatter = metadataCache.frontmatter
    }
    if (tags) {
      this.tags = tags
    }
  } 
  static create(file: TFile, ncp: NoteClassifier): ActionResult{
    const cache = ncp.app.metadataCache.getFileCache(file)
    if (!cache) return { success: false, message: "No Metadata found" }
    const tags= getAllTags(cache)
    const matchRes = settingUtil.matchCls({TFile:file, metadataCache:cache, tags:tags})
    if (!matchRes.success) return matchRes
    if(!(matchRes.type === "cls match")) return {success:false, message: "Wrong Result from match", context:{res:matchRes}}
    const cls = new ClsFile({ TFile: file, metadataCache: cache, tags: tags }, matchRes.cls)
    return {
      success: true,
      type: "note cls",
      note:cls
    }
  }
}

