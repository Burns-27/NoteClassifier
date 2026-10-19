import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";

export interface TClsFile {
  readonly TFile: TFile, 
  name: string,
  readonly startPath:string, 
  frontmatter?: FrontMatterCache
  tags?: Array<string>,
  classification: string,
  /*
  validateProperties: () => ActionResult,
  addMissingProperties:()=> ActionResult,
  move: () => ActionResult, 
  */
}
export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
  tags:Array<string>|null
}