import { CachedMetadata, FrontMatterCache, TagCache, TFile } from "obsidian";
import { TClass } from "../Rules/Classification";
import { ActionResult } from "../logger";

export interface TClsFile {
  readonly TFile: TFile, 
  name: string,
  readonly startPath:string, 
  frontmatter: FrontMatterCache
  tags: TagCache,
  classification: string,
  update: () => ActionResult,
  move: ()=> ActionResult, 
}
export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
}

export class ClassifiedFile implements TClsFile {
  readonly TFile: TFile;
  public name: string;
  readonly startPath: string;
  public frontmatter: FrontMatterCache;
  public tags: TagCache;
  private metadataCache: CachedMetadata
  private cls: TClass;
  public classification: string;



}