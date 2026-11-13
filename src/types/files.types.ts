import { CachedMetadata, TFile } from "obsidian";
import { updateRes } from "./responses.types";

export interface TClsFile {
  readonly TFile: TFile, 
  name: string,
  destination: string,
  reportFlags: ReportFlags[],
  update: () => Promise<updateRes>, 
}
export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
  tags:Array<string>|null
}
export type ReportFlags = "Missing Properties for path"|"Missing Required Properties"|"One or More Properties has Incorrect Value"