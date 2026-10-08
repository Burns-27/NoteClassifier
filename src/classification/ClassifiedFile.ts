import { CachedMetadata, FrontMatterCache, getAllTags, TagCache, TFile } from "obsidian";
import { TClass } from "../Rules/Classification";
import { ActionResult } from "../logger";
import NoteClassifier from "../main";

export interface TClsFile {
  readonly TFile: TFile, 
  name: string,
  readonly startPath:string, 
  frontmatter?: FrontMatterCache
  tags?: Array<string>,
  classification: string,
  validateProperties: () => ActionResult,
  addMissingProperties:()=> ActionResult,
  move: () => ActionResult, 
  create:(file:TFile)=>ClsFile|ActionResult
}

export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
  tags:Array<string>|null
}

export class ClsFile implements TClsFile {
  readonly TFile: TFile;
  public name: string;
  readonly startPath: string;
  readonly frontmatter?: FrontMatterCache;
  public tags?: Array<string>;
  private metadataCache: CachedMetadata
  private cls: TClass;
  public classification: string;

  constructor({TFile, metadataCache, tags}:midFile, classification: TClass) {
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
  static create(file: TFile, ncp: NoteClassifier): ClsFile | ActionResult{
    const cache = ncp.app.metadataCache.getFileCache(file)
    if (!cache) return { success: false, message: "No Metadata found" }
    const tags= getAllTags(cache)
    const cls = ncp.rootNodes.find((rule) => rule.search({ TFile: file, metadataCache: cache , tags:tags}))
    if (!cls) return { success: false, message: "No matching Classification" }
    return new ClsFile({TFile:file, metadataCache:cache, tags:tags}, cls.rule)
  }
}