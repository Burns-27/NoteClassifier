import { settingUtil } from "../settings/settingsUtil"
import type { midFile } from "../types/files.types"
import type  { RuleMatchRes } from "../types/responses.types"
import type { FlatRule, MatchTypeOpts, RuleTypeOpts, TRule } from "../types/rules.types"
import { CreateRule, } from "./Factory"


export function RuleFactory(idArray:string[], clsName:string): Map<string,TRule> {
  let madeRules: Map<string, TRule> = new Map()
  for (const id of idArray) {
    const flatRuleRes = settingUtil.getFlatRule(id)
    if (flatRuleRes.success) {
      const flatRule = flatRuleRes.rule
      madeRules.set(id, CreateRule(flatRule, clsName))
    }
  }
  return madeRules
}
export abstract class Rule implements TRule{
  public id: string
  abstract flat: FlatRule
  public type: RuleTypeOpts
  public matchType: MatchTypeOpts
  public clsName: string
  constructor(data: FlatRule, clsName: string) {
    this.id = data.id
    this.type = data.type
    this.matchType = data.matchType
    this.clsName = clsName
  }
  
  
  abstract getDesc():string
  abstract match(file:midFile):RuleMatchRes
}

