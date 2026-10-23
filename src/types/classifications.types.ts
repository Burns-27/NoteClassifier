import { midFile } from "./files.types";
import { ActionResult } from "./responses.types";
import { FlatRule, TRule } from "./rules.types";

export interface TCls {
  readonly id: string;
  readonly parentID?: string | null;
  readonly name: string;
  rules: TRule[], 
  getPath: () => ActionResult,
  match: (file: midFile) => ActionResult,
  getDesc: (cont: HTMLElement) => void,
  getProps:()=>ActionResult, 
}

export type FlatCls = {
  id: string;
  parentID?: string | null;
  name: string
  rules: FlatRule[],
  destination: string,
  requriedProperties:string[],
}