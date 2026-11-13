import { settingUtil } from "../settings/settingsUtil";
import type { FlatPropertyRule, FlatRule, FlatTagRule, TRule } from "../types/rules.types";
import { ExactPropertyRule,  } from "./propertyRule";
import { ExactTagRule, IncludeTagRule } from "./tagRule";


  
export function CreateRule(flat: FlatRule, clsName: string): TRule{
    switch (flat.type) {
      case "tag":
        return createTagRule(flat, clsName)
      case "property":
        return createPropertyRule(flat, clsName)
    }
  }

function createTagRule(flat:FlatTagRule, clsName:string): TRule {
    switch (flat.matchType) {
      case "exact":
        return new ExactTagRule(flat, clsName)
      case "include":
        return new IncludeTagRule(flat, clsName)
    }
  }

function createPropertyRule(flat:FlatPropertyRule, clsName:string): TRule {
    switch (flat.matchType) {
      case "exact":
        return new ExactPropertyRule(flat, clsName)
    }
  }

  export function RuleFactory(idArray:string[], clsName:string): Map<string,TRule> {
    let madeRules: Map<string, TRule> = new Map()
    for (const id of idArray) {
      //TODO (Setting Refactor) Replace this with rule Map get and check
      const flatRuleRes = settingUtil.getFlatRule(id)
      if (flatRuleRes.success) {
        const flatRule = flatRuleRes.rule
        madeRules.set(id, CreateRule(flatRule, clsName))
      }
    }
    return madeRules
  }