
import { midFile } from "../types/files.types"
import { Rule } from "../types/rules.types"


export interface PropertyRule extends Rule {
  readonly type: "property"
  readonly matchType: "exact"
  propertyName: string,
  propertyValue: string,
}

type FlatExactPropertyRule = {
  type: "property",
  id:string,
  matchType: "exact"
  propertyName: string,
  propertyValue: string
}
export type FlatPropertyRule = FlatExactPropertyRule

export function NewPropertyRule(rule: FlatPropertyRule): PropertyRule{
  switch (rule.matchType) {
    case "exact":
      return new ExactPropertyRule(rule)
  }
}



class ExactPropertyRule implements PropertyRule {
  readonly propertyName: string
  readonly type = "property"
  readonly matchType = "exact"
  readonly propertyValue: string
  id: string
  readonly desc: string
  constructor(data: FlatExactPropertyRule) {
    this.propertyName = data.propertyName
    this.propertyValue = data.propertyValue
    this.id = data.id
    this.desc = `File Has '${this.propertyName}' Property with '${this.propertyValue}' as its value`
  }
  match(file: midFile): boolean{
    const frontmatter = file.metadataCache.frontmatter
    if (!frontmatter) return false
    if (!frontmatter[this.propertyName]) return false
    if (frontmatter[this.propertyName] !== this.propertyValue) return false
    return true
  }
  getDesc() {
    return `File ${this.propertyName} has value ${this.propertyValue}`
  }
}