import { NodeClass } from "../classification/Classification";
import type { FlatCls } from "./classifications.types";
import type { midFile } from "./files.types";
import type { ClsRes, flatRuleRes, UpdateClsRes } from "./responses.types";
import { FlatRule } from "./rules.types";

export interface NoteClassifierSettings {
  rules: Map<string, FlatRule>;
  classes:Map<string, FlatCls>
    nextID: number;
    ErrorNotice: boolean
  SummaryNotice: boolean
  NoticeProperty: string;
    debug: boolean
    ignoredFolders: string[]
    ignoreFilesProperty:string
}
const defaultClasses = new Map<string, FlatCls>()
const defaultRules = new Map<string,FlatRule>()
export type settingKeys = "nextID"|"ErrorNotice"|"SummaryNotice"|"NoticeProperty"|"debug"|"ignoredFolders"|"ignoreFilesProperty"
export const DEFAULT_SETTINGS: NoteClassifierSettings = {
  rules: defaultRules,
  classes: defaultClasses,
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
  matchCls: (file: midFile) => ClsRes,
  getFlatRule:(id:string)=>flatRuleRes
}