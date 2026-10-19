import { FlatCls } from "./classifications.types";

export interface NoteClassifierSettings {
  rules: Array<FlatCls>;
    nextID: number;
    createReports: boolean;
    autoOpenReports: boolean;
    reportlocation: "folder" | "root" | "dynamic";
    ErrorNotice: boolean
    SummaryNotice: boolean
    debug: boolean
    promptOnSave: boolean
    ignoredFolders: string[]
    ignoreFilesProperty:string
}

export const DEFAULT_SETTINGS: NoteClassifierSettings = {
  rules: [],
  nextID: 1,
  createReports:false,
  autoOpenReports: true,
  reportlocation: "root",
  ErrorNotice: true,
  SummaryNotice: true,
  debug: false,
  promptOnSave: true,
  ignoredFolders: [],
  ignoreFilesProperty:"NCP_Ignore"
};