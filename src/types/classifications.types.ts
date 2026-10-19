import { midFile, TClsFile } from "./files.types";
import { FlatRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  getPath: (file: TClsFile) => string,
  match: (file: midFile) => boolean,
  getRuleDesc: ()=>string,
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: FlatRule[],
  destination: string,
  requriedProperties:string[],
}