import { NodeClass } from "../classification/Classification";
import type { FlatCls } from "./classifications.types";
import type { midFile } from "./files.types";
import type { ClsRes, UpdateClsRes } from "./responses.types";

export interface NoteClassifierSettings {
  rules: Map<string, FlatCls>;
    nextID: number;
    ErrorNotice: boolean
  SummaryNotice: boolean
  NoticeProperty: string;
    debug: boolean
    ignoredFolders: string[]
    ignoreFilesProperty:string
}

export const DEFAULT_SETTINGS: NoteClassifierSettings = {
  rules: new Map<string, FlatCls>,
  nextID: 1,
  ErrorNotice: true,
  SummaryNotice: true,
  NoticeProperty: "NC_Notice",
  debug: false,
  ignoredFolders: [],
  ignoreFilesProperty:"NCP_Ignore"
};

export interface SettingUtil {
  get: () => NoteClassifierSettings,
  getCls: (id:string) => ClsRes,
  updateMain: (newSettings:Partial<NoteClassifierSettings>) => void,
  updateAll: (newSettings:Partial<NoteClassifierSettings>) => void,
  updateCls: (flat:FlatCls) => UpdateClsRes,
  newCls: (parentID?:string) => UpdateClsRes,
  nextID: () => string,
  rootNodes: () => NodeClass[],
  matchCls:(file:midFile)=>ClsRes,
}