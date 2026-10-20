import { midFile, TClsFile } from "./files.types";
import { FlatRule, TRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  rules: TRule[], 
  getPath: (file: TClsFile) => string,
  match: (file: midFile) => boolean,
  getDesc: (cont:HTMLElement)=>void,
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: FlatRule[],
  destination: string,
  requriedProperties:string[],
}