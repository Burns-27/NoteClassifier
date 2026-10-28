import type { midFile } from "./files.types";
import type { ClsPathRes, ClsPropsRes, ClsRes } from "./responses.types";
import { FlatRule, TRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  rules: TRule[], 
  getPath: () => ClsPathRes,
  match: (file: midFile) => ClsRes,
  getDesc: (cont: HTMLElement) => void,
  getProps:()=>ClsPropsRes, 
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: FlatRule[],
  destination: string,
  requriedProperties:string[],
}