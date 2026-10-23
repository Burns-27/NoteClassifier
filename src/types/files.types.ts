import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import { ActionResult } from "./responses.types";

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
  */
 getDestination: () => ActionResult, 
}
export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
  tags:Array<string>|null
}