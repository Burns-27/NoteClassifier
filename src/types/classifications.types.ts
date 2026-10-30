import { SettingGroupItem } from "obsidian";
import type { midFile } from "./files.types";
import type { ClsPathRes, ClsPropsRes, ClsRes } from "./responses.types";
import { FlatRule, TRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  rules: Map<string, TRule>, 
  getPath: () => ClsPathRes,
  match: (file: midFile) => ClsRes,
  getDesc: (cont: HTMLElement) => void,
  getProps: () => ClsPropsRes, 
  flat: FlatCls
  rulesSettingArray: (openModal:(cls:TCls,rule:FlatRule)=>void) => {item:SettingGroupItem, id:string}[], 
  
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: string[],
  destination: string,
  description?:string,
  requriedProperties:string[],
}