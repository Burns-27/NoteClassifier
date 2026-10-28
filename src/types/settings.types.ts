import { NodeClass } from "../classification/Classification";
import type { FlatCls } from "./classifications.types";
import type { midFile } from "./files.types";
import type { ClsRes, FlatClsRes, UpdateClsRes } from "./responses.types";

export interface NoteClassifierSettings {
  rules: Array<FlatCls>;
    nextID: number;
    createReports: boolean;
    ErrorNotice: boolean
  SummaryNotice: boolean
  NoticeProperty: string;
    debug: boolean
    ignoredFolders: string[]
    ignoreFilesProperty:string
}

export const DEFAULT_SETTINGS: NoteClassifierSettings = {
  rules: [],
  nextID: 1,
  createReports:false,
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
  getFlatCls: (id:string) => FlatClsRes,
  updateMain: (newSettings:Partial<NoteClassifierSettings>) => void,
  updateAll: (newSettings:Partial<NoteClassifierSettings>) => void,
  updateCls: (flat:FlatCls) => UpdateClsRes,
  newCls: (parentID?:string) => UpdateClsRes,
  nextID: () => string,
  rootNodes: () => NodeClass[],
  matchCls:(file:midFile)=>ClsRes,
}