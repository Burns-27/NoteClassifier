import type { FlatPropertyRule, FlatRule, FlatTagRule, TRule } from "../types/rules.types";
import { ExactPropertyRule,  } from "./propertyRule";
import { ExactTagRule, IncludeTagRule } from "./tagRule";

function createPropertyRule(flat: FlatPropertyRule, clsName: string): TRule{
  return new ExactPropertyRule(flat, clsName)
}
 function createTagRule(flat: FlatTagRule, clsName: string): TRule{
    switch (flat.matchType) {
      case "exact":
        return new ExactTagRule(flat, clsName)
      case "include":
        return new IncludeTagRule(flat, clsName)
    }
}
  
export function CreateRule(flat: FlatRule, clsName: string): TRule{
    switch (flat.type) {
      case "tag":
        return createTagRule(flat, clsName)
      case "property":
        return createPropertyRule(flat, clsName)
    }
  }