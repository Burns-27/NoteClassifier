import { CachedMetadata, TFile } from "obsidian";

export interface TClsFile {
  readonly TFile: TFile, 
  readonly name: string,
  readonly destination: string,
  readonly clsName:string, 
  move: () => boolean;
  checkProps: () => boolean;
  checkPropExists: (property: string) => boolean;
  getPropertyString: (property: string) => string | false;
  addFM: (property: string, value: unknown) => void;
  updateFM: () => void;
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