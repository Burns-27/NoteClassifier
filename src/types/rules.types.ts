
import { midFile } from "./files.types"
import {RuleMatchRes } from "./responses.types"
export type FlatRule = FlatTagRule | FlatPropertyRule

export interface TRule {
  desc: string
  match: (file: midFile) => RuleMatchRes
  clsName: string
  id: string,
  flat:FlatRule,
}
export type RuleTypeOpts = 'tag' | 'property'
export type MatchTypeOpts = 'exact' | 'include'

export type FlatExactTagRule = {
  type: "tag",
  id:string,
  matchType: "exact",
  tag: string,
}
export type FlatIncludeTagRule = {
  type: "tag",
  id:string, 
  matchType: "include",
  tag: string,
}
export type FlatTagRule = FlatExactTagRule | FlatIncludeTagRule


export type FlatExactPropertyRule = {
  type: "property",
  id:string,
  matchType: "exact"
  propertyName: string,
  propertyValue: string
}

export type FlatPropertyRule = FlatExactPropertyRule


