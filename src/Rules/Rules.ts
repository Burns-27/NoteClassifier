
import type { midFile } from "../types/files.types"
import type  { RuleMatchRes } from "../types/responses.types"
import type { FlatRule, MatchTypeOpts, RuleTypeOpts, TRule } from "../types/rules.types"



export abstract class Rule implements TRule{
  public id: string
  abstract flat: FlatRule
  public type: RuleTypeOpts
  public matchType: MatchTypeOpts
  public clsName: string
  abstract desc: string
  constructor(data: FlatRule, clsName: string) {
    this.id = data.id
    this.type = data.type
    this.matchType = data.matchType
    this.clsName = clsName
  }
  
  abstract match(file:midFile):RuleMatchRes
}

