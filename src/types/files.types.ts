import { CachedMetadata, FrontMatterCache, TFile } from "obsidian";
import { updateRes } from "./responses.types";

export interface TClsFile {
  readonly TFile: TFile, 
  readonly startPath:string, 
  name: string,
  frontmatter?: FrontMatterCache
  tags?: Array<string>,
  classification: string,
  destination: string,
  reportFlags: ReportFlags[]
  update:()=>updateRes , 
}
export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
  tags:Array<string>|null
}
export type ReportFlags = "Missing Properties for path"|"Missing Required Properties"