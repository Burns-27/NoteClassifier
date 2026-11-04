import { SettingDefinitionList, SettingGroupItem } from "obsidian";
import type { midFile } from "./files.types";
import type { ClsPathRes, ClsPropsRes, ClsRes } from "./responses.types";
import { TRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  rules: Map<string, TRule>, 
  getPath: () => ClsPathRes,
  match: (file: midFile) => ClsRes,
  getProps: () => ClsPropsRes, 
  flat: FlatCls
  getSettings:(update:(cls:TCls)=>void)=>SettingDefinitionList[]
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: string[],
  destination: string,
  description?: string,
  requriedProperties: string[],
  propOrder?: string[],
  template?: string,
}

