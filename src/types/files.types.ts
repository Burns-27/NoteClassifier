import { CachedMetadata, TFile } from "obsidian";
import { updateRes } from "./responses.types";

export interface TClsFile {
  readonly TFile: TFile, 
  readonly name: string,
  readonly destination: string,
  update: () => Promise<updateRes>, 
  flags: flagsProp
}
export type midFile = {
  TFile: TFile,
  metadataCache: CachedMetadata,
  tags:Array<string>|null
}

export type flagsProp = {
    pathFallback: boolean,
    propsMissing: boolean, 
    propsInvalid: boolean
  }