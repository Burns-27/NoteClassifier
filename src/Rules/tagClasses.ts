import { getAllTags } from "obsidian";
import { midFile } from "../classification/ClassifiedFile";
import { baseClass, BaseClassRule } from "./Classification";

interface tagRule {
  tag: string,
  match: "includes"|"exact",
}
export interface FlatTagClass extends baseClass {
  type: 'tag',
  rule: tagRule
}

export class TagClass extends BaseClassRule<FlatTagClass>{
  private tag: Array<string>;
  private matchStyle: "includes" | "exact";
  constructor(data: FlatTagClass) {
    super(data)
    this.matchStyle = data.rule.match
    if (this.matchStyle == "includes") {
      
      this.tag = data.rule.tag.split(/[,//]/)
    } 
    if (this.matchStyle == "exact") {
      this.tag = data.rule.tag.split(",")
    }
  }

  match(file: midFile): boolean{
    if (!file.tags || file.tags.length== 0 ) return false
    if (this.matchStyle == "includes") return this.includeMatch(tags)
    return false
  }
  private includeMatch(tags: Array<string>): boolean{
    return false
  }

  private exactMatch(tags: Array<string>): boolean{
    return false
  }
}