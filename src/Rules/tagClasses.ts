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
  private tag: string;
  private matchStyle: "includes" | "exact";
  constructor(data: FlatTagClass) {
    super(data)
    this.tag = data.rule.tag
    this.matchStyle = data.rule.match
  }

  match(file: midFile): boolean{
    //TODO (Tag Rule) build out match logic
    return false
  }
}