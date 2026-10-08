import { midFile } from "../classification/ClassifiedFile";
import { baseClass, BaseClassRule } from "./Classification"

export interface propertyRule  {
  propertyName: string,
  propertyValue: string
}
export interface FlatPropertyClass extends baseClass {
  type: 'property',
  rule: Array<propertyRule>
}

export class PropertyClass extends BaseClassRule<FlatPropertyClass>{
  private properties: Array<propertyRule>;
  constructor(data: FlatPropertyClass) {
    super(data)
    this.properties= data.rule
  }
  match(file: midFile): boolean{
    const frontmatter = file.metadataCache.frontmatter
    if (!frontmatter) return false
    for (const rule of this.properties) {
      if (!frontmatter[rule.propertyName]) return false
      if (frontmatter[rule.propertyName] !== rule.propertyValue) return false
    }
    return true
  }
}